import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { colors } from "../../../../theme/colors";
import textStyles, { flexCenter, flexCol, flexRow } from "../../../../theme/styles";
import * as DocumentPicker from "expo-document-picker";
import { Entypo } from "@expo/vector-icons";
import { mImages } from "../../../../assets/images";
import ErrorMessage from "../ErrorMessage";
import useToaster from "../../../hooks/useToaster";

export default function AttachementsPicker({ onSelectAttachement, error }) {
  const [attachments, setAttachements] = useState([]);
  const { toastAlert } = useToaster();

  // Handle pick image
  const pickAttachment = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result?.canceled) {
      if (result?.assets[0].size > 2097152) {
        toastAlert("The file limit is exceeded!", false);
      } else {
        setAttachements((prev) => [...prev, ...result?.assets]);
        onSelectAttachement([...attachments, ...result?.assets]);
      }
    }
  };

  const removeItem = (att) => {
    const filterAttachements = attachments?.filter((e) => e?.uri !== att?.uri);
    setAttachements(filterAttachements);
    onSelectAttachement(filterAttachements);
  };

  return (
    <>
      <TouchableOpacity
        style={{ ...styles.container, borderColor: error ? colors.danger : colors.sky }}
        onPress={pickAttachment}
      >
        <Text style={{ ...textStyles.textRegular12, color: colors.primary }}>
          Add attachments
        </Text>
        <Text style={styles.info}>Max file upload limit is 2 MB</Text>
      </TouchableOpacity>
      {error && <ErrorMessage message={error} />}
      <View style={{ ...flexCol, marginVertical: verticalScale(13) }}>
        {attachments?.length > 0 &&
          attachments?.map((att, index) => (
            <View style={styles.prevWrapper} key={index}>
              <View style={{ ...flexRow, alignItems: "center" }}>
                <View style={styles.iconWrapper}>
                  {/* <Image
                    source={mImages.jpgWhite}
                    style={{ width: moderateScale(16), height: moderateScale(16) }}
                  /> */}

                  <Text style={{ color: colors.white, ...textStyles.textRegular12 }}>
                    {att?.name?.split(".").pop()}
                  </Text>
                </View>
                <Text style={styles.preveiw}>{att?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(att)}>
                <Entypo name="cross" size={20} color="#FC5A5A" />
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: moderateScale(100),
    borderRadius: moderateScale(8),
    backgroundColor: "#F1F9FF",
    borderWidth: 1,
    borderStyle: "dashed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    ...textStyles.textRegular11,
    color: colors.textLightGray,
    marginTop: verticalScale(6),
  },
  prevWrapper: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(7),
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primaryLight,
    paddingHorizontal: horizontalScale(12),
    overflow: "hidden",
  },
  preveiw: {
    flex: 1,
    flexWrap: "wrap",
    marginRight: horizontalScale(6),
    ...textStyles.textRegular12,
    maxWidth: moderateScale(230),
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(8),
    backgroundColor: colors.primary,
    marginRight: horizontalScale(9),
  },
});
