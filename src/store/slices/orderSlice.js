import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,
  filterStatus: "all", // all, pending, in-progress, completed, cancelled
  searchQuery: "",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Order CRUD operations
    addOrder: (state, action) => {
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        ...action.payload,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.orders.unshift(newOrder); // Add to beginning for recent orders
      state.loading = false;
      state.error = null;
    },

    updateOrder: (state, action) => {
      const { id, ...updates } = action.payload;
      const orderIndex = state.orders.findIndex((order) => order.id === id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      state.loading = false;
      state.error = null;
    },

    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },

    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Order status management
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();

        // Add status change to history
        if (!order.statusHistory) {
          order.statusHistory = [];
        }
        order.statusHistory.push({
          status,
          timestamp: new Date().toISOString(),
          note: `Status changed to ${status}`,
        });
      }
    },

    // Search and filter
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },

    // Selected order
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },

    // Payment management
    updateOrderPayment: (state, action) => {
      const { id, totalAmount, advanceAmount, remainingAmount } =
        action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) {
        order.totalAmount = totalAmount;
        order.advanceAmount = advanceAmount;
        order.remainingAmount = remainingAmount;
        order.updatedAt = new Date().toISOString();
      }
    },

    // Add measurement to order
    addMeasurementToOrder: (state, action) => {
      const { orderId, measurement } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        if (!order.measurements) {
          order.measurements = [];
        }
        order.measurements.push({
          id: Date.now().toString(),
          ...measurement,
          createdAt: new Date().toISOString(),
        });
        order.updatedAt = new Date().toISOString();
      }
    },

    // Update measurement in order
    updateOrderMeasurement: (state, action) => {
      const { orderId, measurementId, updates } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order && order.measurements) {
        const measurementIndex = order.measurements.findIndex(
          (m) => m.id === measurementId
        );
        if (measurementIndex !== -1) {
          order.measurements[measurementIndex] = {
            ...order.measurements[measurementIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          order.updatedAt = new Date().toISOString();
        }
      }
    },

    // Bulk operations
    deleteMultipleOrders: (state, action) => {
      const idsToDelete = action.payload;
      state.orders = state.orders.filter(
        (order) => !idsToDelete.includes(order.id)
      );
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addOrder,
  updateOrder,
  deleteOrder,
  setOrders,
  updateOrderStatus,
  setSearchQuery,
  setFilterStatus,
  setSelectedOrder,
  updateOrderPayment,
  addMeasurementToOrder,
  updateOrderMeasurement,
  deleteMultipleOrders,
} = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectSearchQuery = (state) => state.orders.searchQuery;
export const selectFilterStatus = (state) => state.orders.filterStatus;

export const selectFilteredOrders = (state) => {
  const { orders, searchQuery, filterStatus } = state.orders;
  let filtered = orders;

  // Filter by status
  if (filterStatus !== "all") {
    filtered = filtered.filter((order) => order.status === filterStatus);
  }

  // Filter by search query
  if (searchQuery) {
    filtered = filtered.filter(
      (order) =>
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.customer?.phone?.includes(searchQuery)
    );
  }

  return filtered;
};

export const selectRecentOrders = (state) => state.orders.orders.slice(0, 5);

export const selectOrdersByStatus = (state, status) =>
  state.orders.orders.filter((order) => order.status === status);

export const selectOrderById = (state, orderId) =>
  state.orders.orders.find((order) => order.id === orderId);

export const selectOrderStats = (state) => {
  const orders = state.orders.orders;
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0),
  };
};

export default orderSlice.reducer;
