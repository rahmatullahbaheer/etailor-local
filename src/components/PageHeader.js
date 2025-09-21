import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PageHeader = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  rightIcon,
  onRightIconPress,
  backgroundColor = "#6A0DAD",
  textColor = "#ffffff",
  style,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.content}>
        {/* Left side - Back button */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={onBackPress}
          >
            <View style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={20} color="#000000ff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Center - Title and subtitle */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor, opacity: 0.8 }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side - Optional icon */}
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightIconPress}
          >
            <MaterialIcons name={rightIcon} size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButtonContainer: {
    marginRight: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  rightButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default PageHeader;
