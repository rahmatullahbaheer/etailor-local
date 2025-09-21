import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useFocusEffect } from "@react-navigation/native";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import textStyles from "../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../utils/responsive/metrices";
import { OrderStorage } from "../utils/orderStorage";
import { showSuccessToast } from "../utils/toast";

const OrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log("Loading orders from database...");

      const allOrders = await OrderStorage.getAllOrders();
      console.log(`Loaded ${allOrders.length} orders`);

      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      console.error("Error details:", error.message);

      // Set empty array as fallback
      setOrders([]);

      Alert.alert(
        "Database Error",
        "Failed to load orders from database. Please try refreshing or restart the app.",
        [{ text: "Retry", onPress: () => loadOrders() }, { text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const tabs = [
    { key: "all", label: "All Orders", count: orders.length },
    {
      key: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      key: "progress",
      label: "In Progress",
      count: orders.filter((o) => o.status === "in_progress").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
  ];

  const getFilteredOrders = () => {
    let filtered = orders;

    if (activeTab !== "all") {
      const statusMap = {
        pending: "pending",
        progress: "in_progress",
        completed: "completed",
      };
      filtered = orders.filter(
        (order) => order.status === statusMap[activeTab]
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.secondary;
      case "in_progress":
        return colors.darkYellow;
      case "pending":
        return colors.primary;
      case "cancelled":
        return "#e74c3c";
      default:
        return colors.lightGray;
    }
  };

  const TabButton = ({ tab, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {tab.label}
      </Text>
      {tab.count > 0 && (
        <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
          <Text style={[styles.countText, isActive && styles.activeCountText]}>
            {tab.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await OrderStorage.updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Refresh the list
      showSuccessToast("Success", "Order status updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const showStatusOptions = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (selectedOrder) {
      setShowStatusModal(false);
      await updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder(null);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const showDeleteConfirmation = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        setShowDeleteModal(false);
        await OrderStorage.deleteOrder(selectedOrder.id);
        await loadOrders(); // Refresh the list
        showSuccessToast("Success", "Order deleted successfully");
        setSelectedOrder(null);
      } catch (error) {
        Alert.alert("Error", "Failed to delete order");
        console.error("Error deleting order:", error);
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  const OrderCard = ({ order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderTitleContainer}>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <Text style={styles.customerPhone}>{order.customer.phone}</Text>
        </View>
        <View style={styles.orderAmount}>
          <Text style={styles.amountText}>{order.order.totalAmount}</Text>
        </View>
      </View>

      <Text style={styles.orderItem}>Order ID: {order.id}</Text>

      <View style={styles.orderFooter}>
        <View style={styles.orderDates}>
          <Text style={styles.dateLabel}>
            Due: {formatDate(order.order.deliveryDate)}
          </Text>
          <Text style={styles.orderDate}>
            Suits: {order.order.suitCount || 0}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(order.status) }]}
          >
            {order.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => showStatusOptions(order)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="refresh" size={18} color="#3498db" />
          <Text style={[styles.actionButtonText, { color: "#3498db" }]}>
            Update Status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => showDeleteConfirmation(order)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="delete" size={18} color="#e74c3c" />
          <Text style={[styles.actionButtonText, { color: "#e74c3c" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons
        name="assignment"
        size={moderateScale(64)}
        color={colors.lightGray}
      />
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try adjusting your search"
          : "Start taking orders from customers"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.addOrderButton}
          onPress={() => navigation.navigate("AddOrder")}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addOrderButtonText}>Add First Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <PageHeader
          title="Orders"
          showBackButton={false}
          rightIcon="add"
          onRightIconPress={() => navigation.navigate("AddOrder")}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Orders"
        showBackButton={false}
        rightIcon="add"
        onRightIconPress={() => navigation.navigate("AddOrder")}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons
            name="search"
            size={moderateScale(20)}
            color={colors.lightGray}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor={colors.lightGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons
                name="clear"
                size={moderateScale(20)}
                color={colors.lightGray}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={() => setActiveTab(tab.key)}
          />
        ))}
      </ScrollView>

      {/* Orders List */}
      <FlatList
        data={getFilteredOrders()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      {/* Status Change Modal */}
      <Modal
        isVisible={showStatusModal}
        onBackdropPress={closeStatusModal}
        onBackButtonPress={closeStatusModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            <TouchableOpacity
              onPress={closeStatusModal}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={colors.lightGray} />
            </TouchableOpacity>
          </View>

          {selectedOrder && (
            <View style={styles.orderInfo}>
              <Text style={styles.orderInfoTitle}>
                Order: {selectedOrder.id}
              </Text>
              <Text style={styles.orderInfoCustomer}>
                Customer: {selectedOrder.customer.name}
              </Text>
              <Text style={styles.currentStatus}>
                Current Status:{" "}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(selectedOrder.status) },
                  ]}
                >
                  {selectedOrder.status.replace("_", " ").toUpperCase()}
                </Text>
              </Text>
            </View>
          )}

          <View style={styles.statusOptions}>
            <Text style={styles.optionsTitle}>Select New Status:</Text>

            {[
              {
                label: "Pending",
                value: "pending",
                icon: "schedule",
                color: colors.primary,
              },
              {
                label: "In Progress",
                value: "in_progress",
                icon: "work",
                color: colors.darkYellow,
              },
              {
                label: "Completed",
                value: "completed",
                icon: "check-circle",
                color: colors.secondary,
              },
              {
                label: "Cancelled",
                value: "cancelled",
                icon: "cancel",
                color: "#e74c3c",
              },
            ]
              .filter((option) => option.value !== selectedOrder?.status)
              .map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.statusOption, { borderColor: option.color }]}
                  onPress={() => handleStatusChange(option.value)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={24}
                    color={option.color}
                  />
                  <Text
                    style={[styles.statusOptionText, { color: option.color }]}
                  >
                    {option.label}
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={option.color}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={closeDeleteModal}
        onBackButtonPress={closeDeleteModal}
        style={styles.deleteModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}
      >
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteModalHeader}>
            <MaterialIcons name="warning" size={48} color="#e74c3c" />
            <Text style={styles.deleteModalTitle}>Delete Order</Text>
          </View>

          {selectedOrder && (
            <View style={styles.deleteOrderInfo}>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete this order?
              </Text>
              <Text style={styles.deleteOrderDetails}>
                Order: {selectedOrder.id}
              </Text>
              <Text style={styles.deleteOrderDetails}>
                Customer: {selectedOrder.customer.name}
              </Text>
              <Text style={styles.deleteWarning}>
                This action cannot be undone.
              </Text>
            </View>
          )}

          <View style={styles.deleteModalActions}>
            <TouchableOpacity
              style={[styles.deleteActionButton, styles.cancelButton]}
              onPress={closeDeleteModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteActionButton, styles.confirmDeleteButton]}
              onPress={handleDeleteOrder}
              activeOpacity={0.7}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.confirmDeleteButtonText}>Delete Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  searchContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: horizontalScale(8),
    ...textStyles.textRegular16,
    color: colors.darkGray,
  },
  tabsContainer: {
    maxHeight: verticalScale(60),
  },
  tabsContent: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(16),
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    marginRight: horizontalScale(12),
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...textStyles.textMedium14,
    color: colors.lightGray,
  },
  activeTabText: {
    color: colors.white,
  },
  countBadge: {
    backgroundColor: colors.lightGray + "30",
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(6),
    paddingVertical: verticalScale(2),
    marginLeft: horizontalScale(6),
    minWidth: moderateScale(20),
    alignItems: "center",
  },
  activeCountBadge: {
    backgroundColor: colors.white + "30",
  },
  countText: {
    ...textStyles.textMedium11,
    color: colors.lightGray,
  },
  activeCountText: {
    color: colors.white,
  },
  ordersList: {
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(20),
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(8),
  },
  orderTitleContainer: {
    flex: 1,
  },
  customerName: {
    ...textStyles.textSemibold16,
    color: colors.darkGray,
  },
  priorityIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(4),
  },
  priorityDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    marginRight: horizontalScale(6),
  },
  priorityText: {
    ...textStyles.textRegular11,
    color: colors.lightGray,
    textTransform: "capitalize",
  },
  orderAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    ...textStyles.textSemibold16,
    color: colors.darkGray,
  },
  orderItem: {
    ...textStyles.textRegular14,
    color: colors.mediumGray,
    marginBottom: verticalScale(12),
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  orderDates: {
    flex: 1,
  },
  dateLabel: {
    ...textStyles.textMedium12,
    color: colors.darkGray,
  },
  orderDate: {
    ...textStyles.textRegular11,
    color: colors.lightGray,
    marginTop: verticalScale(2),
  },
  statusBadge: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
  },
  statusText: {
    ...textStyles.textMedium12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyTitle: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
    marginTop: verticalScale(16),
  },
  emptySubtitle: {
    ...textStyles.textRegular14,
    color: colors.lightGray,
    textAlign: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
  addOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
  },
  addOrderButtonText: {
    ...textStyles.textMedium14,
    color: "#fff",
    marginLeft: horizontalScale(8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...textStyles.textRegular16,
    color: colors.lightGray,
    marginTop: verticalScale(16),
  },
  customerPhone: {
    ...textStyles.textRegular12,
    color: colors.lightGray,
    marginTop: verticalScale(2),
  },

  // Modal Styles
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingBottom: verticalScale(20),
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
  },
  closeButton: {
    padding: moderateScale(4),
  },
  orderInfo: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: colors.lightBg,
    marginHorizontal: horizontalScale(20),
    marginVertical: verticalScale(16),
    borderRadius: moderateScale(12),
  },
  orderInfoTitle: {
    ...textStyles.textSemibold16,
    color: colors.darkGray,
    marginBottom: verticalScale(4),
  },
  orderInfoCustomer: {
    ...textStyles.textRegular14,
    color: colors.mediumGray,
    marginBottom: verticalScale(4),
  },
  currentStatus: {
    ...textStyles.textRegular14,
    color: colors.mediumGray,
  },
  statusOptions: {
    paddingHorizontal: horizontalScale(20),
  },
  optionsTitle: {
    ...textStyles.textMedium16,
    color: colors.darkGray,
    marginBottom: verticalScale(16),
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  statusOptionText: {
    ...textStyles.textMedium16,
    flex: 1,
    marginLeft: horizontalScale(12),
  },

  // Order Actions
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: "row",
    agnItems: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    flex: 1,
    marginHorizontal: horizontalScale(4),
  },
  statusButton: {
    borderColor: "#3498db",
    backgroundColor: "#ecf7ff",
  },
  deleteButton: {
    borderColor: "#e74c3c",
    backgroundColor: "#fdf2f2",
  },
  actionButtonText: {
    ...textStyles.textBold14,
    marginLeft: horizontalScale(4),
  },

  // Delete Modal Styles
  deleteModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  deleteModalContent: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: horizontalScale(24),
    marginHorizontal: horizontalScale(20),
    maxWidth: horizontalScale(320),
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  deleteModalHeader: {
    alignItems: "center",
    marginBottom: verticalScale(24),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deleteModalTitle: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
    marginTop: verticalScale(16),
    textAlign: "center",
  },
  deleteOrderInfo: {
    marginBottom: verticalScale(24),
  },
  deleteModalText: {
    ...textStyles.textRegular16,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  deleteOrderDetails: {
    ...textStyles.textMedium14,
    color: colors.mediumGray,
    textAlign: "center",
    marginBottom: verticalScale(4),
  },
  deleteWarning: {
    ...textStyles.textRegular12,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: verticalScale(8),
    fontStyle: "italic",
  },
  deleteModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(8),
  },
  deleteActionButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    marginHorizontal: horizontalScale(8),
    alignItems: "center",
    justifyContent: "center",
    minHeight: verticalScale(48),
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  cancelButtonText: {
    ...textStyles.textMedium14,
    color: colors.darkGray,
  },
  confirmDeleteButton: {
    backgroundColor: "#e74c3c",
    flexDirection: "row",
    alignItems: "center",
  },
  confirmDeleteButtonText: {
    ...textStyles.textMedium14,
    color: colors.white,
    marginLeft: horizontalScale(4),
  },
});

export default OrdersScreen;
