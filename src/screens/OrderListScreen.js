import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { PageHeader } from "../components";
import { OrderStorage } from "../utils/orderStorage";

const OrderListScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
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
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "in_progress":
        return "#3498db";
      case "completed":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "in_progress":
        return "construct-outline";
      case "completed":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await OrderStorage.updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Refresh the list
      Alert.alert("Success", "Order status updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const showStatusOptions = (order) => {
    const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "In Progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ].filter((option) => option.value !== order.status);

    const buttons = statusOptions.map((option) => ({
      text: option.label,
      onPress: () => updateOrderStatus(order.id, option.value),
    }));

    buttons.push({ text: "Cancel", style: "cancel" });

    Alert.alert(
      "Update Order Status",
      `Current status: ${order.status
        .replace("_", " ")
        .toUpperCase()}\n\nSelect new status for Order ${order.id}:`,
      buttons
    );
  };

  const deleteOrder = async (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await OrderStorage.deleteOrder(orderId);
              await loadOrders();
              Alert.alert("Success", "Order deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete order");
              console.error("Error deleting order:", error);
            }
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        // Navigate to order details screen if you create one
        console.log("Order details:", item.id);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.customerName}>{item.customer.name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color="#fff"
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={18} color="#4a5568" />
          <Text style={styles.detailText}>{item.customer.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color="#4a5568" />
          <Text style={styles.detailText}>
            Delivery: {formatDate(item.order.deliveryDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={18} color="#38a169" />
          <Text
            style={[styles.detailText, { color: "#38a169", fontWeight: "600" }]}
          >
            Total: {item.order.totalAmount}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="shirt-outline" size={18} color="#4a5568" />
          <Text style={styles.detailText}>
            Suits: {item.order.suitCount || 0}
          </Text>
        </View>
        {item.order.description && (
          <View style={[styles.detailRow, { alignItems: "flex-start" }]}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color="#4a5568"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.detailText} numberOfLines={2}>
              {item.order.description}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={(e) => {
            e.stopPropagation();
            showStatusOptions(item);
          }}
        >
          <Ionicons name="refresh-outline" size={18} color="#3498db" />
          <Text style={[styles.actionButtonText, { color: "#3498db" }]}>
            Update Status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={(e) => {
            e.stopPropagation();
            deleteOrder(item.id);
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
          <Text style={[styles.actionButtonText, { color: "#e74c3c" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.createdDate}>
        Created: {formatDate(item.createdAt)}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="receipt-outline" size={64} color="#a0aec0" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyMessage}>
        Start managing your tailoring business by creating your first order.
        Track measurements, delivery dates, and customer details all in one
        place.
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddOrder")}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color="#2c7a7b" />
        <Text style={styles.addButtonText}>Create First Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <PageHeader title="Orders" showBackButton={true} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddOrder")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  customerName: {
    fontSize: 15,
    color: "#4a5568",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: "center",
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orderDetails: {
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e2e8f0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#2d3748",
    marginLeft: 12,
    fontWeight: "500",
    flex: 1,
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 0.48,
    justifyContent: "center",
    minHeight: 44,
  },
  statusButton: {
    borderColor: "#3182ce",
    backgroundColor: "#ebf8ff",
  },
  deleteButton: {
    borderColor: "#e53e3e",
    backgroundColor: "#fed7d7",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  createdDate: {
    fontSize: 12,
    color: "#718096",
    textAlign: "right",
    marginTop: 8,
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3748",
    marginTop: 24,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6fffa",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#38b2ac",
    shadowColor: "#38b2ac",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c7a7b",
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#38b2ac",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38b2ac",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
});

export default OrderListScreen;
