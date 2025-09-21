import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import textStyles, { flexBetween } from "../../../theme/styles";
import {
  horizontalScale,
  verticalScale,
} from "../../../utils/responsive/metrices";
// import SideBarMenu from "./SiderBarMenu";

export default function ScreenHeader({ title }) {
  return (
    <View style={styles.container}>
      {/* <SideBarMenu /> */}
      <View style={{ flex: 1, paddingRight: horizontalScale(30) }}>
        <Text style={{ ...textStyles.textSemibold15, textAlign: "center" }}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flexBetween,
    justifyContent: "space-between",
    paddingTop: verticalScale(25),
    paddingBottom: verticalScale(32),
    paddingHorizontal: horizontalScale(18),
  },
});
