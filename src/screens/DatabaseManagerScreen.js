import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "../components";
import {
  StorageUtils,
  OrderStorage,
  CustomerStorage,
  DraftStorage,
} from "../utils/orderStorage";

const DatabaseManagerScreen = ({ navigation }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      setLoading(true);
      const info = await StorageUtils.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error("Error loading storage info:", error);
      Alert.alert("Error", "Failed to load database information");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStorageInfo();
    setRefreshing(false);
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all orders, customers, and drafts? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageUtils.clearAllData();
              await loadStorageInfo();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
              console.error("Error clearing data:", error);
            }
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const data = await StorageUtils.exportData();
      if (data) {
        // In a real app, you might want to save this to a file or share it
        console.log("Exported data:", JSON.stringify(data, null, 2));
        Alert.alert(
          "Export Complete",
          "Data has been exported to console. In a production app, this would be saved to a file.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
      console.error("Error exporting data:", error);
    }
  };

  const clearDraft = async () => {
    try {
      await DraftStorage.clearDraft();
      await loadStorageInfo();
      Alert.alert("Success", "Draft cleared successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to clear draft");
      console.error("Error clearing draft:", error);
    }
  };

  const StatCard = ({ title, value, icon, color = "#008080" }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const ActionButton = ({
    title,
    icon,
    onPress,
    color = "#008080",
    destructive = false,
  }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { borderColor: color },
        destructive && styles.destructiveButton,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={destructive ? "#e74c3c" : color} />
      <Text
        style={[
          styles.actionButtonText,
          { color: destructive ? "#e74c3c" : color },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !storageInfo) {
    return (
      <View style={styles.container}>
        <PageHeader title="Database Manager" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <Text>Loading database information...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Database Manager" showBackButton={true} />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Database Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Statistics</Text>

          {storageInfo && (
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Orders"
                value={storageInfo.totalOrders}
                icon="receipt-outline"
                color="#3498db"
              />
              <StatCard
                title="Pending Orders"
                value={storageInfo.pendingOrders}
                icon="time-outline"
                color="#f39c12"
              />
              <StatCard
                title="Completed Orders"
                value={storageInfo.completedOrders}
                icon="checkmark-circle-outline"
                color="#27ae60"
              />
              <StatCard
                title="Total Customers"
                value={storageInfo.totalCustomers}
                icon="people-outline"
                color="#9b59b6"
              />
            </View>
          )}

          {storageInfo?.hasDraft && (
            <View style={styles.draftAlert}>
              <Ionicons name="warning-outline" size={20} color="#f39c12" />
              <Text style={styles.draftText}>
                You have an unsaved draft order
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <ActionButton
              title="View Orders"
              icon="list-outline"
              onPress={() => navigation.navigate("OrderList")}
              color="#3498db"
            />

            <ActionButton
              title="Add Order"
              icon="add-circle-outline"
              onPress={() => navigation.navigate("AddOrder")}
              color="#27ae60"
            />

            <ActionButton
              title="Export Data"
              icon="download-outline"
              onPress={exportData}
              color="#9b59b6"
            />

            {storageInfo?.hasDraft && (
              <ActionButton
                title="Clear Draft"
                icon="trash-outline"
                onPress={clearDraft}
                color="#f39c12"
              />
            )}
          </View>
        </View>

        {/* Database Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Management</Text>

          <View style={styles.managementSection}>
            <Text style={styles.warningText}>
              ⚠️ Danger Zone - These actions cannot be undone
            </Text>

            <ActionButton
              title="Clear All Data"
              icon="nuclear-outline"
              onPress={clearAllData}
              destructive={true}
            />
          </View>
        </View>

        {/* Database Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Information</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Database: SQLite</Text>
            <Text style={styles.infoText}>File: etailor.db</Text>
            <Text style={styles.infoText}>
              Last Updated: {new Date().toLocaleString()}
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statTitle: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  draftAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  draftText: {
    marginLeft: 8,
    color: "#856404",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: "45%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destructiveButton: {
    backgroundColor: "#ffeaea",
    borderColor: "#e74c3c",
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  managementSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  warningText: {
    color: "#e74c3c",
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
});

export default DatabaseManagerScreen;
