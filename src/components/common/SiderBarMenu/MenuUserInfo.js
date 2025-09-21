import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import PrimaryButton from "../PrimaryButton";
import {
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { flexCenter, flexRow } from "../../../../theme/styles";
import { colors } from "../../../../theme/colors";
import textStyles from "../../../../theme/styles";
import { useNavigation } from "@react-navigation/native";

const MenuUserInfo = ({ onLoginClick, onClose }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state?.auth);
  return (
    <>
      {!user ? (
        <PrimaryButton
          title="Log in or create your account"
          style={{
            height: moderateScale(44),
            marginVertical: verticalScale(32),
            borderRadius: moderateScale(5),
          }}
          onPress={onLoginClick}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            onClose();
            navigation.navigate("NormalStack", {
              screen: "PersonalInformation",
            });
          }}
          style={{ alignSelf: "flex-start" }}
        >
          <View
            style={{
              ...flexRow,
              gap: 12,
              marginVertical: verticalScale(32),
            }}
          >
            {user?.avatar ? (
              <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            ) : (
              <View style={{ ...flexCenter, ...styles.avatar }}>
                <Text>{user.full_name.charAt(0)}</Text>
              </View>
            )}
            <Text style={textStyles.textMedium14}>{user?.full_name}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: moderateScale(37),
    height: moderateScale(37),
    backgroundColor: colors.lightBg,
    borderRadius: moderateScale(37),
  },
});

export default memo(MenuUserInfo);
