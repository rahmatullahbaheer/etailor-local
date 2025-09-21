import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { flexRow } from "../../../../theme/styles";
import textStyles from "../../../../theme/styles";
import { colors } from "../../../../theme/colors";
import { useSelector } from "react-redux";
import MenuLogout from "./MenuLogout";

const AccountRelatedLinks = ({ data, onPress, onLogout }) => {
  const user = useSelector((state) => state?.auth);
  return (
    <View
      style={{
        ...styles.listWrapper,
        marginTop: verticalScale(20),
        borderBottomWidth: 0,
        alignSelf: "flex-start",
      }}
    >
      {data.map((link, index) => {
        return (
          <TouchableOpacity
            style={styles.linkRow}
            key={index}
            onPress={() => {
              onPress(link);
            }}
          >
            <View style={{ ...flexRow, gap: 8 }}>
              <Image source={link.icon} />
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
      {user ? <MenuLogout onLogout={onLogout} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  listWrapper: {
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  linkRow: {
    ...flexRow,
    height: moderateScale(38),
    justifyContent: "space-between",
    gap: horizontalScale(8),
  },
});

export default memo(AccountRelatedLinks);
