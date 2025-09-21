import {
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { colors } from "../../../../theme/colors";
import textStyles, { flexBetween } from "../../../../theme/styles";
import ErrorMessage from "../ErrorMessage";

const { width } = Dimensions.get("screen");

export default function TextField(props) {
  const { style, label, placeholder, value, onChange, error, ...rest } = props;
  return (
    <View style={{ marginBottom: verticalScale(20), ...style }}>
      {label && (
        <Text style={{ ...textStyles.textMedium14, color: colors.darkGray }}>
          {label}
        </Text>
      )}
      <View
        style={{
          ...styles.inputWrapper,
          borderColor: error ? "red" : "transparent",
        }}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => onChange(text)}
          style={{ ...styles.input }}
          placeholderTextColor={colors.lightGray}
          {...rest}
        />
      </View>
      {error && <ErrorMessage message={error} />}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    height: moderateScale(50),
    borderRadius: moderateScale(5),
    backgroundColor: colors.lightBg,
    paddingHorizontal: horizontalScale(16),
    marginTop: verticalScale(8),
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    color: colors.darkGray,
    ...textStyles.textRegular14,
  },
});
