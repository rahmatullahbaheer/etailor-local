import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale } from "../../utils/responsive/metrices";
import { colors } from "../../theme/colors";
import { Octicons } from "@expo/vector-icons";

export default function RadioButton({ checked = false, callback }) {
  return (
    <>
      <TouchableOpacity
        style={{
          ...styles.container,
          borderColor: checked ? colors.primary : colors.dark,
        }}
        onPress={() => callback()}
      >
        {checked && <View style={styles.checked}></View>}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(17),
    borderWidth: 2,
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: moderateScale(6),
    height: moderateScale(6),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
  },
});
