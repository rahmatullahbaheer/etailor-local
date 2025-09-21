import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import textStyles from "../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../utils/responsive/metrices";

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [orders] = useState([
    {
      id: 1,
      customer: "Alice Johnson",
      item: "Wedding Dress",
      status: "In Progress",
      amount: 850,
      date: "2024-03-15",
      dueDate: "2024-03-25",
      priority: "high",
    },
    {
      id: 2,
      customer: "Bob Smith",
      item: "Business Suit",
      status: "Completed",
      amount: 450,
      date: "2024-03-10",
      dueDate: "2024-03-20",
      priority: "medium",
    },
    {
      id: 3,
      customer: "Carol Davis",
      item: "Evening Gown",
      status: "Pending",
      amount: 720,
      date: "2024-03-18",
      dueDate: "2024-03-30",
      priority: "low",
    },
    {
      id: 4,
      customer: "David Wilson",
      item: "Casual Shirt",
      status: "In Progress",
      amount: 120,
      date: "2024-03-12",
      dueDate: "2024-03-22",
      priority: "medium",
    },
    {
      id: 5,
      customer: "Emma Brown",
      item: "Cocktail Dress",
      status: "Pending",
      amount: 380,
      date: "2024-03-20",
      dueDate: "2024-04-05",
      priority: "low",
    },
  ]);

  const tabs = [
    { key: "all", label: "All Orders", count: orders.length },
    {
      key: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "Pending").length,
    },
    {
      key: "progress",
      label: "In Progress",
      count: orders.filter((o) => o.status === "In Progress").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status === "Completed").length,
    },
  ];

  const getFilteredOrders = () => {
    let filtered = orders;

    if (activeTab !== "all") {
      const statusMap = {
        pending: "Pending",
        progress: "In Progress",
        completed: "Completed",
      };
      filtered = orders.filter(
        (order) => order.status === statusMap[activeTab]
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return colors.secondary;
      case "In Progress":
        return colors.darkYellow;
      case "Pending":
        return colors.primary;
      default:
        return colors.lightGray;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#FF6B6B";
      case "medium":
        return colors.darkYellow;
      case "low":
        return colors.secondary;
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

  const OrderCard = ({ order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderTitleContainer}>
          <Text style={styles.customerName}>{order.customer}</Text>
          <View style={styles.priorityIndicator}>
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor(order.priority) },
              ]}
            />
            <Text style={styles.priorityText}>{order.priority} priority</Text>
          </View>
        </View>
        <View style={styles.orderAmount}>
          <Text style={styles.amountText}>${order.amount}</Text>
        </View>
      </View>

      <Text style={styles.orderItem}>{order.item}</Text>

      <View style={styles.orderFooter}>
        <View style={styles.orderDates}>
          <Text style={styles.dateLabel}>Due: {order.dueDate}</Text>
          <Text style={styles.orderDate}>Ordered: {order.date}</Text>
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
            {order.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <PageHeader
        title="Orders"
        showBackButton={false}
        rightIcon="add"
        onRightIconPress={() => console.log("Add new order")}
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />
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
  },
});

export default OrdersScreen;
