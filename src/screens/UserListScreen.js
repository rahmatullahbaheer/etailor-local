import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import { useCustomers } from "../hooks/useRedux";
import { setSearchQuery } from "../store/slices/customerSlice";
import { CustomerStorage, OrderStorage } from "../utils/orderStorage";

const { width: screenWidth } = Dimensions.get("window");

const UserListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customerOrderCounts, setCustomerOrderCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Load customers and their order counts from database
  const loadCustomers = async () => {
    try {
      setLoading(true);

      // Get all customers
      const customers = await CustomerStorage.getAllCustomers();

      // Get all orders to count orders per customer
      const orders = await OrderStorage.getAllOrders();

      // Count orders for each customer
      const orderCounts = {};
      orders.forEach((order) => {
        const customerPhone = order.customer.phone;
        orderCounts[customerPhone] = (orderCounts[customerPhone] || 0) + 1;
      });

      // Transform customers data to match UI expectations
      const transformedUsers = customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email || `${customer.phone}@example.com`, // Fallback email
        phone: customer.phone,
        image: customer.image,
        ordersCount: orderCounts[customer.phone] || 0,
        status: "active", // Default to active, you can add status logic later
        createdAt: customer.createdAt,
      }));

      setUsers(transformedUsers);
      setCustomerOrderCounts(orderCounts);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Focus listener to reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadCustomers();
    });

    return unsubscribe;
  }, [navigation]);

  // Handle user actions
  const handleUserPress = (user) => {
    setSelectedUser(user);
    setShowActionModal(true);
  };

  const handleViewUser = () => {
    setShowActionModal(false);
    // Navigate to user details screen (you can create this screen)
    navigation.navigate("CustomerDetails", { customer: selectedUser });
  };

  const handleEditUser = () => {
    setShowActionModal(false);
    // Navigate to edit customer screen
    navigation.navigate("AddCustomer", {
      editMode: true,
      customer: selectedUser,
    });
  };

  const handleDeleteUser = () => {
    setShowActionModal(false);

    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDeleteUser,
        },
      ]
    );
  };

  const confirmDeleteUser = async () => {
    try {
      // Check if customer has orders
      if (selectedUser?.ordersCount > 0) {
        Alert.alert(
          "Cannot Delete Customer",
          `${selectedUser.name} has ${selectedUser.ordersCount} order(s). Please delete all orders first before deleting the customer.`,
          [{ text: "OK" }]
        );
        return;
      }

      // Delete the customer
      await CustomerStorage.deleteCustomer(selectedUser.id);

      // Show success message
      Alert.alert(
        "Success",
        `${selectedUser.name} has been deleted successfully.`,
        [{ text: "OK" }]
      );

      // Refresh the list
      await loadCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete customer. Please try again."
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.userImage} />
        ) : (
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: getAvatarColor(item.name) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>
        )}
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: item.status === "active" ? "#2ecc71" : "#95a5a6",
            },
          ]}
        />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userPhone}>{item.phone}</Text>
      </View>

      <View style={styles.userStats}>
        <View style={styles.ordersContainer}>
          <Text style={styles.ordersCount}>{item.ordersCount}</Text>
          <Text style={styles.ordersLabel}>Orders</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.filter((u) => u.status === "active").length}
          </Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {users.reduce((sum, u) => sum + u.ordersCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color="#7f8c8d"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#bdc3c7"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="clear" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Loading component
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.loadingText}>Loading customers...</Text>
    </View>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="people-outline" size={80} color="#bdc3c7" />
      <Text style={styles.emptyTitle}>No Customers Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "No customers match your search criteria"
          : "Start by adding your first customer"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate("AddCustomer")}
        >
          <Text style={styles.emptyButtonText}>Add Customer</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Action Modal Component
  const renderActionModal = () => (
    <Modal
      visible={showActionModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowActionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalUserInfo}>
              {selectedUser?.image ? (
                <Image
                  source={{ uri: selectedUser.image }}
                  style={styles.modalUserImage}
                />
              ) : (
                <View
                  style={[
                    styles.modalAvatarContainer,
                    {
                      backgroundColor: getAvatarColor(selectedUser?.name || ""),
                    },
                  ]}
                >
                  <Text style={styles.modalAvatarText}>
                    {getInitials(selectedUser?.name || "")}
                  </Text>
                </View>
              )}
              <View style={styles.modalUserDetails}>
                <Text style={styles.modalUserName}>{selectedUser?.name}</Text>
                <Text style={styles.modalUserPhone}>{selectedUser?.phone}</Text>
                <Text style={styles.modalUserOrders}>
                  {selectedUser?.ordersCount} orders
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowActionModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={handleViewUser}
            >
              <MaterialIcons name="visibility" size={24} color="#3498db" />
              <Text style={[styles.actionButtonText, styles.viewButtonText]}>
                View Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEditUser}
            >
              <MaterialIcons name="edit" size={24} color="#f39c12" />
              <Text style={[styles.actionButtonText, styles.editButtonText]}>
                Edit Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteUser}
            >
              <MaterialIcons name="delete" size={24} color="#e74c3c" />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete Customer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <PageHeader title="User List" showBackButton={true} />
        {renderLoading()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="User List" showBackButton={true} />

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          filteredUsers.length === 0 && styles.emptyListContainer,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3498db"]}
            tintColor="#3498db"
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="person-add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Action Modal */}
      {renderActionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  listContainer: {
    paddingBottom: 20,
  },

  headerContainer: {
    padding: 16,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchIcon: {
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  userImageContainer: {
    position: "relative",
    marginRight: 16,
  },

  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },

  userPhone: {
    fontSize: 14,
    color: "#95a5a6",
  },

  userStats: {
    alignItems: "center",
    flexDirection: "row",
  },

  ordersContainer: {
    alignItems: "center",
    marginRight: 12,
  },

  ordersCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
  },

  ordersLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  separator: {
    height: 12,
  },

  /* Loading State */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#7f8c8d",
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyListContainer: {
    flexGrow: 1,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },

  emptyButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },

  modalUserInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  modalUserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  modalAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  modalAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  modalUserDetails: {
    flex: 1,
  },

  modalUserName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },

  modalUserPhone: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },

  modalUserOrders: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "500",
  },

  modalCloseButton: {
    padding: 8,
  },

  modalActions: {
    padding: 20,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },

  viewButton: {
    backgroundColor: "#ecf7ff",
    borderColor: "#3498db",
  },

  viewButtonText: {
    color: "#3498db",
  },

  editButton: {
    backgroundColor: "#fef9e7",
    borderColor: "#f39c12",
  },

  editButtonText: {
    color: "#f39c12",
  },

  deleteButton: {
    backgroundColor: "#fdf2f2",
    borderColor: "#e74c3c",
    marginBottom: 0,
  },

  deleteButtonText: {
    color: "#e74c3c",
  },

  /* Floating Action Button */
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default UserListScreen;
