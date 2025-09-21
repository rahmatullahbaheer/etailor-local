import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import { OrderStorage } from "../utils/orderStorage";

const CustomerDetailsScreen = ({ navigation, route }) => {
  const { customer } = route.params;
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerOrders();
  }, []);

  const loadCustomerOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await OrderStorage.getAllOrders();
      const orders = allOrders.filter(
        (order) => order.customer.phone === customer.phone
      );
      setCustomerOrders(orders);
    } catch (error) {
      console.error("Error loading customer orders:", error);
    } finally {
      setLoading(false);
    }
  };

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
      case "completed":
        return "#2ecc71";
      case "pending":
        return "#f39c12";
      case "cancelled":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const handleEditCustomer = () => {
    navigation.navigate("AddCustomer", {
      editMode: true,
      customer: customer,
    });
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => {
        // Navigate to order details if you have that screen
        console.log("Order selected:", item.id);
      }}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.orderRow}>
          <MaterialIcons name="event" size={16} color="#7f8c8d" />
          <Text style={styles.orderLabel}>Delivery Date:</Text>
          <Text style={styles.orderValue}>
            {formatDate(item.order.deliveryDate)}
          </Text>
        </View>

        <View style={styles.orderRow}>
          <MaterialIcons name="attach-money" size={16} color="#7f8c8d" />
          <Text style={styles.orderLabel}>Total Amount:</Text>
          <Text style={styles.orderValue}>₹{item.order.totalAmount}</Text>
        </View>

        <View style={styles.orderRow}>
          <MaterialIcons name="checkroom" size={16} color="#7f8c8d" />
          <Text style={styles.orderLabel}>Suits:</Text>
          <Text style={styles.orderValue}>{item.order.suitCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyOrdersContainer}>
      <MaterialIcons name="shopping-bag" size={60} color="#bdc3c7" />
      <Text style={styles.emptyOrdersTitle}>No Orders Yet</Text>
      <Text style={styles.emptyOrdersSubtitle}>
        This customer hasn't placed any orders yet.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <PageHeader title="Customer Details" showBackButton={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.customerImageContainer}>
              {customer.image ? (
                <Image
                  source={{ uri: customer.image }}
                  style={styles.customerImage}
                />
              ) : (
                <View
                  style={[
                    styles.avatarContainer,
                    { backgroundColor: getAvatarColor(customer.name) },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {getInitials(customer.name)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
              {customer.email && (
                <Text style={styles.customerEmail}>{customer.email}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditCustomer}
            >
              <MaterialIcons name="edit" size={24} color="#3498db" />
            </TouchableOpacity>
          </View>

          {customer.address && (
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={16} color="#7f8c8d" />
              <Text style={styles.addressText}>{customer.address}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{customerOrders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {customerOrders.filter((o) => o.status === "completed").length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                ₹
                {customerOrders
                  .reduce(
                    (sum, order) => sum + parseFloat(order.order.totalAmount),
                    0
                  )
                  .toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </View>
          </View>
        </View>

        {/* Orders Section */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order History</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddOrder", { customer: customer })
              }
            >
              <MaterialIcons name="add" size={24} color="#3498db" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : (
            <FlatList
              data={customerOrders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyOrders}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.orderSeparator} />
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  content: {
    flex: 1,
    padding: 16,
  },

  customerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  customerImageContainer: {
    marginRight: 16,
  },

  customerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },

  customerPhone: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 2,
  },

  customerEmail: {
    fontSize: 14,
    color: "#95a5a6",
  },

  editButton: {
    padding: 8,
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },

  addressText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  ordersSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },

  orderCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },

  orderDetails: {
    gap: 8,
  },

  orderRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  orderLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 8,
    marginRight: 8,
  },

  orderValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
  },

  orderSeparator: {
    height: 12,
  },

  emptyOrdersContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyOrdersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    marginBottom: 8,
  },

  emptyOrdersSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  loadingText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
});

export default CustomerDetailsScreen;
