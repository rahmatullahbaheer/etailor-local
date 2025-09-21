import { StyleSheet, Text, View, Image, TouchableHighlight } from "react-native";
import React, { useEffect } from "react";
import { flexCenter } from "../../../theme/styles";
import { moderateScale, verticalScale } from "../../../utils/responsive/metrices";
import textStyles from "../../../theme/styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import * as ImagePicker from "expo-image-picker";

export default function ProfileImagePicker({ onChangeImage, image }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const imageURL = `data:image/jpg;base64,${result?.assets[0]?.base64}`;
      onChangeImage(imageURL);
    }
  };

  return (
    <View style={styles.imageWrapper}>
      {image ? (
        <Image
          source={{
            uri: image,
          }}
          style={styles.profile}
        />
      ) : (
        <View style={{ ...styles.profile, backgroundColor: colors.primary, ...flexCenter }}>
          <Text style={{ ...textStyles.textMedium24, color: colors.white }}>W</Text>
        </View>
      )}
      <TouchableHighlight style={styles.pin} onPress={pickImage}>
        <Entypo name="pencil" size={14} color={colors.primary} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    position: "relative",
    width: moderateScale(106),
    height: moderateScale(106),
  },
  profile: {
    width: moderateScale(106),
    height: moderateScale(106),
    borderRadius: moderateScale(106),
  },
  pin: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(22),
    backgroundColor: colors.white,
    position: "absolute",
    borderWidth: 0.2,
    bottom: 6,
    right: 6,
    ...flexCenter,
  },
});
