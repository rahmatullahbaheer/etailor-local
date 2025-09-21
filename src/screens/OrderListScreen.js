import React, { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await OrderStorage.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      Alert.alert("Error", "Failed to load orders");
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
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
    ];

    const buttons = statusOptions
      .filter((option) => option.value !== order.status)
      .map((option) => ({
        text: option.label,
        onPress: () => updateOrderStatus(order.id, option.value),
      }));

    buttons.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Update Status", "Choose new status for this order:", buttons);
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
    <View style={styles.orderCard}>
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
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.customer.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Delivery: {formatDate(item.order.deliveryDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Total: ${item.order.totalAmount}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="shirt-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            Suits: {item.order.suitCount || 0}
          </Text>
        </View>
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => showStatusOptions(item)}
        >
          <Ionicons name="refresh-outline" size={18} color="#3498db" />
          <Text style={[styles.actionButtonText, { color: "#3498db" }]}>
            Update Status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteOrder(item.id)}
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
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={80} color="#bdc3c7" />
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptyMessage}>
        Orders you create will appear here. Start by adding your first order.
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddOrder")}
      >
        <Ionicons name="add-circle" size={20} color="#008080" />
        <Text style={styles.addButtonText}>Add First Order</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  orderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    flex: 0.48,
    justifyContent: "center",
  },
  statusButton: {
    borderColor: "#3498db",
    backgroundColor: "#f8f9fa",
  },
  deleteButton: {
    borderColor: "#e74c3c",
    backgroundColor: "#f8f9fa",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  createdDate: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F2F2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#B3D9D9",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#008080",
    marginLeft: 8,
  },
});

export default OrderListScreen;
