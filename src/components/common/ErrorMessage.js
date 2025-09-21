import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { verticalScale } from "../../../utils/responsive/metrices";
import textStyles from "../../../theme/styles";

const ErrorMessage = ({ message }) => {
  return (
    <View style={{ marginTop: verticalScale(3) }}>
      <Text
        style={{
          ...textStyles.textRegular12,
          color: "red",
          width: "100%",
          textAlign: "left",
        }}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ErrorMessage;
