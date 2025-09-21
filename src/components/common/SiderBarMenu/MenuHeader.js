import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { memo } from "react";
import { flexBetween } from "../../../../theme/styles";
import { mImages } from "../../../../assets/images";
import { moderateScale } from "../../../../utils/responsive/metrices";

const MenuHeader = ({ onClose }) => {
  return (
    <View
      style={{
        ...flexBetween,
        justifyContent: "space-between",
        marginTop: Platform.OS === "ios" && moderateScale(50),
      }}
    >
      <Image
        source={mImages.logoHorizontal}
        style={{ width: moderateScale(156), height: moderateScale(30) }}
      />
      <TouchableOpacity onPress={onClose}>
        <Image
          source={mImages.crossRed}
          style={{ width: moderateScale(15), height: moderateScale(15) }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default memo(MenuHeader);
