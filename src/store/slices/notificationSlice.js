import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
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

    // Notification CRUD operations
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        ...action.payload,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(newNotification); // Add to beginning
      state.unreadCount += 1;
      state.loading = false;
      state.error = null;
    },

    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAsUnread: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && notification.isRead) {
        notification.isRead = false;
        notification.readAt = null;
        state.unreadCount += 1;
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },

    deleteNotification: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(
        (n) => n.id !== notificationId
      );
    },

    deleteAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      state.loading = false;
      state.error = null;
    },

    // Bulk operations
    deleteMultipleNotifications: (state, action) => {
      const idsToDelete = action.payload;
      const deletedUnreadCount = state.notifications.filter(
        (n) => idsToDelete.includes(n.id) && !n.isRead
      ).length;

      state.notifications = state.notifications.filter(
        (n) => !idsToDelete.includes(n.id)
      );
      state.unreadCount = Math.max(0, state.unreadCount - deletedUnreadCount);
    },

    markMultipleAsRead: (state, action) => {
      const idsToMark = action.payload;
      let markedCount = 0;

      state.notifications.forEach((notification) => {
        if (idsToMark.includes(notification.id) && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date().toISOString();
          markedCount += 1;
        }
      });

      state.unreadCount = Math.max(0, state.unreadCount - markedCount);
    },

    // Auto-generate notifications for app events
    addOrderNotification: (state, action) => {
      const { type, orderId, orderNumber, customerName } = action.payload;
      let title,
        message,
        priority = "medium";

      switch (type) {
        case "new_order":
          title = "New Order Received";
          message = `Order ${orderNumber} from ${customerName}`;
          priority = "high";
          break;
        case "order_completed":
          title = "Order Completed";
          message = `Order ${orderNumber} has been completed`;
          priority = "medium";
          break;
        case "delivery_due":
          title = "Delivery Due";
          message = `Order ${orderNumber} delivery is due today`;
          priority = "high";
          break;
        default:
          title = "Order Update";
          message = `Order ${orderNumber} has been updated`;
      }

      const notification = {
        id: Date.now().toString(),
        title,
        message,
        type: "order",
        priority,
        data: { orderId, orderNumber, customerName },
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },

    addCustomerNotification: (state, action) => {
      const { type, customerId, customerName } = action.payload;
      let title, message;

      switch (type) {
        case "new_customer":
          title = "New Customer Added";
          message = `${customerName} has been added to your customer list`;
          break;
        case "customer_updated":
          title = "Customer Updated";
          message = `${customerName}'s information has been updated`;
          break;
        default:
          title = "Customer Update";
          message = `Customer ${customerName} has been updated`;
      }

      const notification = {
        id: Date.now().toString(),
        title,
        message,
        type: "customer",
        priority: "low",
        data: { customerId, customerName },
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addNotification,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  setNotifications,
  deleteMultipleNotifications,
  markMultipleAsRead,
  addOrderNotification,
  addCustomerNotification,
} = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state) =>
  state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) =>
  state.notifications.loading;
export const selectNotificationsError = (state) => state.notifications.error;

export const selectUnreadNotifications = (state) =>
  state.notifications.notifications.filter((n) => !n.isRead);

export const selectNotificationsByType = (state, type) =>
  state.notifications.notifications.filter((n) => n.type === type);

export const selectRecentNotifications = (state, limit = 5) =>
  state.notifications.notifications.slice(0, limit);

export const selectNotificationById = (state, notificationId) =>
  state.notifications.notifications.find((n) => n.id === notificationId);

export default notificationSlice.reducer;
