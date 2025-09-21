import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import UserProfile from "./UserProfile";

const AppHeader = ({
  userName,
  userImage,
  greeting,
  onNotificationPress,
  notificationCount = 0,
  headerStyle,
  showShadow = true,
}) => {
  return (
    <View style={[styles.header, showShadow && styles.shadow, headerStyle]}>
      <UserProfile
        userName={userName}
        userImage={userImage}
        greeting={greeting}
      />
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <MaterialIcons name="notifications" size={28} color="#333" />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>
              {notificationCount > 99 ? "99+" : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  notificationCount: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AppHeader;
