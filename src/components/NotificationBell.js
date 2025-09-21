import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const NotificationBell = ({
  notificationCount = 0,
  onPress,
  iconSize = 28,
  iconColor = "#333",
  badgeColor = "#ff4444",
}) => {
  return (
    <TouchableOpacity style={styles.notificationContainer} onPress={onPress}>
      <MaterialIcons name="notifications" size={iconSize} color={iconColor} />
      {notificationCount > 0 && (
        <View
          style={[styles.notificationBadge, { backgroundColor: badgeColor }]}
        >
          <Text style={styles.notificationCount}>
            {notificationCount > 9 ? "9+" : notificationCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  notificationCount: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default NotificationBell;
