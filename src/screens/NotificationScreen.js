import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import fonts from "../../theme/fonts";
import { mImages } from "../../assets/images";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being processed.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    icon: "check-circle",
  },
  {
    id: 2,
    type: "system",
    title: "Welcome to eTailor!",
    message:
      "Thank you for joining us. Explore our latest collections and exclusive offers.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    icon: "celebration",
  },
  {
    id: 3,
    type: "promotion",
    title: "Special Offer!",
    message: "25% off on all summer collection. Limited time offer. Shop now!",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    icon: "local-offer",
  },
  {
    id: 4,
    type: "order",
    title: "Order Delivered",
    message:
      "Your order #12340 has been delivered successfully. Rate your experience!",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    icon: "local-shipping",
  },
  {
    id: 5,
    type: "system",
    title: "Profile Updated",
    message: "Your profile information has been updated successfully.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    icon: "person",
  },
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "system":
        return notifications.filter((n) => n.type === "system");
      default:
        return notifications;
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) {
      return hours === 0 ? "Just now" : `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    Alert.alert(
      "Mark All as Read",
      "Are you sure you want to mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark All",
          onPress: () => {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, isRead: true }))
            );
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getUnreadCount = () => notifications.filter((n) => !n.isRead).length;

  const NotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={
            item.type === "order"
              ? colors.secondary
              : item.type === "promotion"
              ? colors.darkYellow
              : colors.primary
          }
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              !item.isRead && styles.unreadTitle,
            ]}
          >
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <Text style={styles.notificationTime}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image source={mImages.emptyListIndicator} style={styles.emptyImage} />
      <Text style={styles.emptyTitle}>
        {activeTab === "unread"
          ? "No unread notifications"
          : activeTab === "system"
          ? "No system notifications"
          : "No notifications yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "unread"
          ? "You're all caught up!"
          : "New notifications will appear here"}
      </Text>
    </View>
  );

  const TabButton = ({ title, tabKey, count }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabKey && styles.activeTabButton]}
      onPress={() => setActiveTab(tabKey)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tabKey && styles.activeTabButtonText,
        ]}
      >
        {title}
        {count > 0 && tabKey === "unread" && (
          <Text style={styles.tabBadge}> ({count})</Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <PageHeader title="Notifications" showBackButton={false} />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton title="All" tabKey="all" />
        <TabButton title="Unread" tabKey="unread" count={getUnreadCount()} />
        <TabButton title="System" tabKey="system" />
      </View>

      {/* Notifications List */}
      {getFilteredNotifications().length > 0 ? (
        <FlatList
          data={getFilteredNotifications()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NotificationItem item={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <EmptyState />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },

  // Tab Styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeTabButton: {
    backgroundColor: colors.primaryLight,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: fonts.PoppinsMedium,
    color: colors.mediumGray,
  },
  activeTabButtonText: {
    color: colors.primary,
    fontFamily: fonts.PoppinsSemiBold,
  },
  tabBadge: {
    fontSize: 12,
    fontFamily: fonts.PoppinsBold,
    color: colors.secondary,
  },

  // List Styles
  listContent: {
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Notification Item Styles
  notificationItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    backgroundColor: "#f8fff8",
  },

  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  notificationContent: {
    flex: 1,
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  notificationTitle: {
    fontSize: 16,
    fontFamily: fonts.PoppinsMedium,
    color: colors.darkGray,
    flex: 1,
  },
  unreadTitle: {
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.black,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginLeft: 8,
  },

  notificationMessage: {
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
    color: colors.mediumGray,
    lineHeight: 20,
    marginBottom: 8,
  },

  notificationTime: {
    fontSize: 12,
    fontFamily: fonts.PoppinsLight,
    color: colors.lightGray,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.PoppinsSemiBold,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.PoppinsRegular,
    color: colors.lightGray,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationScreen;
