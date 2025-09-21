import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../theme/colors";

export default function Screen({ style, children }) {
  return <SafeAreaView style={{ ...styles.container, ...style }}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: colors.white,
  },
});
