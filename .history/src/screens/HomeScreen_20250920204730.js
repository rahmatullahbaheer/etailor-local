import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components";
import { showInfoToast } from "../utils/toast";
import { colors } from "../../theme/colors";
import textStyles from "../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../utils/responsive/metrices";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth);
  console.log("user in home screen", user);

  const userName = "John Doe";
  const [stats] = useState({
    totalOrders: 156,
    pendingOrders: 12,
    completedOrders: 144,
    totalRevenue: 45600,
  });

  const [recentOrders] = useState([
    {
      id: 1,
      customer: "Alice Johnson",
      item: "Wedding Dress",
      status: "In Progress",
      amount: 850,
    },
    {
      id: 2,
      customer: "Bob Smith",
      item: "Business Suit",
      status: "Completed",
      amount: 450,
    },
    {
      id: 3,
      customer: "Carol Davis",
      item: "Evening Gown",
      status: "Pending",
      amount: 720,
    },
    {
      id: 4,
      customer: "David Wilson",
      item: "Casual Shirt",
      status: "In Progress",
      amount: 120,
    },
  ]);

  const handleNotificationPress = () => {
    showInfoToast("Notifications", "Notification panel opened");
  };

  const handleUserListPress = () => {
    navigation.navigate("UserList");
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statContent}>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
          <MaterialIcons name={icon} size={moderateScale(24)} color={color} />
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + "20" }]}>
        <MaterialIcons name={icon} size={moderateScale(28)} color={color} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const OrderItem = ({ order }) => (
    <TouchableOpacity style={styles.orderItem}>
      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{order.customer}</Text>
        <Text style={styles.orderDescription}>{order.item}</Text>
        <View style={styles.orderMeta}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  order.status === "Completed"
                    ? colors.secondary + "20"
                    : order.status === "In Progress"
                    ? colors.darkYellow + "20"
                    : colors.primary + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    order.status === "Completed"
                      ? colors.secondary
                      : order.status === "In Progress"
                      ? colors.darkYellow
                      : colors.primary,
                },
              ]}
            >
              {order.status}
            </Text>
          </View>
          <Text style={styles.orderAmount}>${order.amount}</Text>
        </View>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={moderateScale(24)}
        color={colors.lightGray}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        userName={userName}
        onNotificationPress={handleNotificationPress}
        greeting="Assalam o Alaikum 👋"
        notificationCount={5} // Shows red badge with "5"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="assignment"
            color={colors.primary}
            onPress={() =>
              showInfoToast("Stats", "Total Orders: " + stats.totalOrders)
            }
          />
          <StatCard
            title="Pending"
            value={stats.pendingOrders}
            icon="pending"
            color={colors.darkYellow}
            onPress={() =>
              showInfoToast("Stats", "Pending Orders: " + stats.pendingOrders)
            }
          />
          <StatCard
            title="Completed"
            value={stats.completedOrders}
            icon="check-circle"
            color={colors.secondary}
            onPress={() =>
              showInfoToast(
                "Stats",
                "Completed Orders: " + stats.completedOrders
              )
            }
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon="attach-money"
            color="#FF6B6B"
            onPress={() =>
              showInfoToast(
                "Stats",
                "Total Revenue: $" + stats.totalRevenue.toLocaleString()
              )
            }
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickAction
              title="New Order"
              icon="add-circle"
              color={colors.primary}
              onPress={() => showInfoToast("Action", "Navigate to New Order")}
            />
            <QuickAction
              title="Measurements"
              icon="straighten"
              color={colors.secondary}
              onPress={() =>
                showInfoToast("Action", "Navigate to Measurements")
              }
            />
            <QuickAction
              title="Customers"
              icon="people"
              color={colors.darkYellow}
              onPress={handleUserListPress}
            />
            <QuickAction
              title="Reports"
              icon="bar-chart"
              color="#FF6B6B"
              onPress={() => showInfoToast("Action", "Navigate to Reports")}
            />
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity
              onPress={() => showInfoToast("Navigation", "View All Orders")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ordersContainer}>
            {recentOrders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>10:00 AM</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Fitting - Sarah Wilson</Text>
                <Text style={styles.scheduleDescription}>
                  Wedding dress final fitting
                </Text>
              </View>
            </View>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={styles.timeText}>2:30 PM</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>
                  Consultation - Mike Brown
                </Text>
                <Text style={styles.scheduleDescription}>
                  Business suit measurements
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(20),
    gap: horizontalScale(12),
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    width: (width - horizontalScale(44)) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
  },
  statTitle: {
    ...textStyles.textRegular12,
    color: colors.lightGray,
    marginTop: verticalScale(4),
  },
  statIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: verticalScale(24),
    paddingHorizontal: horizontalScale(16),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
  },
  viewAllText: {
    ...textStyles.textMedium14,
    color: colors.primary,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(16),
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  quickActionText: {
    ...textStyles.textMedium12,
    color: colors.darkGray,
    textAlign: "center",
  },
  ordersContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "30",
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    ...textStyles.textSemibold15,
    color: colors.darkGray,
  },
  orderDescription: {
    ...textStyles.textRegular13,
    color: colors.lightGray,
    marginTop: verticalScale(4),
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(8),
  },
  statusBadge: {
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    ...textStyles.textMedium11,
  },
  orderAmount: {
    ...textStyles.textSemibold14,
    color: colors.darkGray,
  },
  scheduleContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    marginTop: verticalScale(16),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleItem: {
    flexDirection: "row",
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "30",
  },
  scheduleTime: {
    width: moderateScale(80),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: moderateScale(8),
    marginRight: horizontalScale(16),
    paddingVertical: verticalScale(8),
  },
  timeText: {
    ...textStyles.textSemibold12,
    color: colors.primary,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    ...textStyles.textSemibold15,
    color: colors.darkGray,
  },
  scheduleDescription: {
    ...textStyles.textRegular13,
    color: colors.lightGray,
    marginTop: verticalScale(4),
  },
});

export default HomeScreen;
