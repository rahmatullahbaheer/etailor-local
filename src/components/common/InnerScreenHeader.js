import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import textStyles, { flexBetween } from "../../../theme/styles";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/responsive/metrices";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../theme/colors";
import { flexCenter } from "../../../theme/styles";

export default function InnerScreenHeader({ title }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={18} color="black" />
      </TouchableOpacity>
      <View style={{ flex: 1, paddingRight: horizontalScale(30) }}>
        <Text style={{ ...textStyles.textSemibold15, textAlign: "center" }}>{title}</Text>
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
  backWrapper: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(5),
    backgroundColor: colors.lightBg,
    ...flexCenter,
  },
});
