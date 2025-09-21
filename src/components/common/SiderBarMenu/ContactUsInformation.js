import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import textStyles from "../../../../theme/styles";
import { colors } from "../../../../theme/colors";
import { flexRow } from "../../../../theme/styles";

const ContactUsInformation = ({ data }) => {
  return (
    <View
      style={{
        marginTop: verticalScale(15),
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ ...textStyles.textMedium15, color: colors.primary }}>
        Contact US
      </Text>
      <View style={{ marginTop: verticalScale(12) }}>
        {data.map((link, index) => {
          return (
            <TouchableOpacity
              style={{ ...styles.linkRow, height: moderateScale(33) }}
              key={index}
            >
              <View style={{ ...flexRow, gap: 8 }}>
                <Image source={link.icon} resizeMode="contain" />
                <Text
                  style={{
                    ...textStyles.textRegular13,
                    color: colors.darkGray,
                  }}
                >
                  {link.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linkRow: {
    height: moderateScale(38),
    ...flexRow,
    justifyContent: "space-between",
    gap: horizontalScale(8),
  },
});

export default memo(ContactUsInformation);
