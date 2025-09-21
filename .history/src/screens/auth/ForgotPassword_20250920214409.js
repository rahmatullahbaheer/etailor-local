import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/common/PrimaryButton";
import { colors } from "../../../theme/colors";
import textStyles from "../../../theme/styles";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from "../../../utils/responsive/metrices";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://etailerbackend.etailer.site/api/v1/forgot-password",
        {
          email: email,
        }
      );

      console.log("Forgot Password Response:", response.data);

      if (response?.data?.success) {
        Alert.alert(
          "Success",
          "OTP has been sent to your email. Please check your inbox."
        );
        // ✅ Redirect to OTP Verification Screen (you will build next)
        navigation.navigate("VerifyOtp", { email });
      } else {
        Alert.alert(
          "Error",
          response?.data?.message || "Something went wrong."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[textStyles.textMedium24, styles.title]}>
        Forgot Password
      </Text>
      <Text style={[textStyles.textRegular16, styles.subtitle]}>
        Enter your email and we'll send you an OTP to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={moderateScale(20)}
          color={colors.lightGray}
          style={styles.inputIcon}
        />
        <TextInput
          style={[textStyles.textRegular16, styles.textInput]}
          placeholder="Enter your email"
          placeholderTextColor={colors.lightGray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <PrimaryButton
        title="Send OTP"
        onPress={handleForgotPassword}
        isLoading={isLoading}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: horizontalScale(20),
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: verticalScale(10),
    color: colors.darkGray,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: verticalScale(30),
    color: colors.lightGray,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(20),
  },
  inputIcon: { marginRight: horizontalScale(10) },
  textInput: { flex: 1, color: colors.darkGray },
});

export default ForgotPasswordScreen;
