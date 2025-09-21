import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale } from "../../../utils/responsive/metrices";
import { colors } from "../../../theme/colors";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { mImages } from "../../../assets/images";

export default function Checkbox({ checked = false, toggleCheckbox }) {
  return (
    <>
      <View
        style={{
          ...styles.container,
          borderColor: checked ? colors.secondary : "#C4C4C4",
          backgroundColor: checked ? colors.secondary : colors.white,
        }}
      >
        {checked && <FontAwesome name="check" size={11} color="white" />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: moderateScale(17),
    height: moderateScale(17),
    borderRadius: moderateScale(4),
    borderWidth: 1.5,
    opacity: 0.7,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
