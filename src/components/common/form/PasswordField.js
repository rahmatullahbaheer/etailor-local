import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { colors } from "../../../../theme/colors";
import textStyles, { flexRow } from "../../../../theme/styles";
import { Feather } from "@expo/vector-icons";
import ErrorMessage from "../ErrorMessage";

export default function PasswordField(props) {
  const { label, placeholder, value, onChange, error, ...rest } = props;
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: verticalScale(20) }}>
      <Text style={{ ...textStyles.textMedium14, color: colors.darkGray }}>{label}</Text>
      <View style={{ ...styles.inputWrapper, borderColor: error ? "red" : "transparent" }}>
        <TextInput
          textContentType="password"
          placeholder={placeholder}
          secureTextEntry={!show}
          value={value}
          onChangeText={(pass) => onChange(pass)}
          style={styles.input}
          placeholderTextColor={colors.lightGray}
          {...rest}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <Feather name="eye" size={17} color={show ? colors.primary : colors.lightGray} />
        </TouchableOpacity>
      </View>
      {error && <ErrorMessage message={error} />}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    height: moderateScale(50),
    borderRadius: moderateScale(5),
    backgroundColor: colors.lightBg,
    marginBottom: verticalScale(5),
    paddingHorizontal: horizontalScale(16),
    marginTop: verticalScale(8),
    borderWidth: 1,
    ...flexRow,
  },
  input: {
    flex: 1,
    height: "100%",
    backgroundColor: "transparent",
    color: colors.darkGray,
    ...textStyles.textRegular14,
  },
});
