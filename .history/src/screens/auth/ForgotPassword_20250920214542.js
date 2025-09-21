import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // ✅ added axios
import { colors } from "../../../theme/colors";
import textStyles from "../../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../../utils/responsive/metrices";
import { mImages } from "../../../assets/images";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/common/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { showInfoToast, showSuccessToast } from "../../utils/toast";

const SignIn = ({ navigation }) => {
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginTop: verticalScale(60) }}>
            <Image source={mImages.App_Icon} style={styles.image} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[textStyles.textMedium24, styles.welcomeText]}>
              Welcome Back!
            </Text>
            <Text style={[textStyles.textRegular16, styles.subtitleText]}>
              Sign in to continue to your account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[textStyles.textMedium14, styles.inputLabel]}>
                Email Address
              </Text>
              <View
                style={[styles.inputWrapper, errors.email && styles.inputError]}
              >
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
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: null }));
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={[textStyles.textRegular12, styles.errorText]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Sign In */}

            {/* <View style={[styles.signInButton]}> */}
            <PrimaryButton
              title={"Sign In..."}
              isLoading={isLoading}
              onPress={handleForgotPassword}
              disabled={isLoading}
            />
            {/* </View> */}
          </View>

          {/* Sign Up */}
          <View style={styles.signUpContainer}>
            <Text style={[textStyles.textRegular16, styles.signUpText]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={[textStyles.textSemibold16, styles.signUpLink]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  keyboardView: { flex: 1 },
  image: { width: 140, height: 140 },
  scrollContent: { flexGrow: 1, paddingHorizontal: horizontalScale(24) },
  header: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(40),
    alignItems: "center",
  },
  welcomeText: { color: colors.darkGray, marginBottom: verticalScale(8) },
  subtitleText: { color: colors.lightGray, textAlign: "center" },
  formContainer: { flex: 1 },
  inputContainer: { marginBottom: verticalScale(20) },
  inputLabel: { color: colors.darkGray, marginBottom: verticalScale(8) },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: colors.white,
  },
  inputError: { borderColor: "#FF6B6B" },
  inputIcon: { marginRight: horizontalScale(12) },
  textInput: { flex: 1, color: colors.darkGray, paddingVertical: 0 },
  eyeIcon: {},
  errorText: { color: "#FF6B6B", marginTop: verticalScale(4) },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: verticalScale(32),
  },
  forgotPasswordText: { color: colors.primary },
  signInButton: {
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  disabledButton: { backgroundColor: colors.lightGray },
  signInButtonText: { color: colors.white },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(102),
  },
  signUpText: { color: colors.lightGray },
  signUpLink: { color: colors.primary },
});

export default SignIn;
