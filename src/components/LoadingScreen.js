import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";
import textStyles from "../../theme/styles";
import { moderateScale, verticalScale } from "../../utils/responsive/metrices";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[textStyles.textRegular16, styles.loadingText]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colors.darkGray,
    marginTop: verticalScale(16),
  },
});

export default LoadingScreen;
