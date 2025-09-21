import { StyleSheet, Text, View } from "react-native";
import React from "react";
import textStyles from "../../../theme/styles";
import { colors } from "../../../theme/colors";

export default function HighlightText({ text, style }) {
  return <Text style={[styles.text, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    ...textStyles.textMedium13,
    color: colors.primary,
  },
});
