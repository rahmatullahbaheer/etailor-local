import { Dimensions, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { colors } from "../../../../theme/colors";
import textStyles, { flexBetween } from "../../../../theme/styles";
import { mImages } from "../../../../assets/images";
import ErrorMessage from "../ErrorMessage";

const { width } = Dimensions.get("screen");

export default function DescriptionField(props) {
  const { style, label, placeholder, value, onChange, error, rows, ...rest } = props;

  return (
    <View style={{ marginBottom: verticalScale(20), ...style }}>
      <Text style={{ ...textStyles.textMedium14, color: colors.darkGray }}>{label}</Text>
      <View
        style={{
          ...styles.inputWrapper,
        }}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => onChange(text)}
          style={{ ...styles.input }}
          placeholderTextColor="#ABABAB"
          multiline={true}
          numberOfLines={rows ? rows : 5}
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
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    backgroundColor: colors.lightBg,
    marginBottom: verticalScale(5),
    paddingHorizontal: horizontalScale(16),
    marginTop: verticalScale(8),
    ...flexBetween,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    color: colors.textDark,
    ...textStyles.textRegular13,
    textAlignVertical: "top",
  },
});
