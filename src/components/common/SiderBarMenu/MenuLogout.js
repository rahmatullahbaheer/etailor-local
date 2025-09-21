import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { horizontalScale, moderateScale } from "../../../../utils/responsive/metrices";
import { flexRow } from "../../../../theme/styles";
import { colors } from "../../../../theme/colors";
import { mImages } from "../../../../assets/images";
import textStyles from "../../../../theme/styles";

const MenuLogout = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.linkRow} onPress={onLogout}>
      <View style={{ ...flexRow, gap: 8 }}>
        <Image source={mImages.avatarSmall} />
        <Text
          style={{
            ...textStyles.textRegular13,
            color: colors.darkGray,
          }}
        >
          Log Out
        </Text>
      </View>
    </TouchableOpacity>
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

export default memo(MenuLogout);
