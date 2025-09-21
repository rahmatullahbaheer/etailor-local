import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import textStyles from "../../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../../utils/responsive/metrices";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = ({ navigation }) => {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await resetPassword(email);
        if (result.success) {
          setIsEmailSent(true);
        } else {
          Alert.alert(
            "Error",
            result.error || "Failed to send reset email. Please try again."
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to send reset email. Please try again.");
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      const result = await resetPassword(email);
      if (result.success) {
        Alert.alert("Success", "Reset email sent again!");
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to resend email. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend email. Please try again.");
    }
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(24)}
                color={colors.darkGray}
              />
            </TouchableOpacity>
          </View>

          {/* Success Content */}
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons
                name="mail-outline"
                size={moderateScale(64)}
                color={colors.primary}
              />
            </View>

            <Text style={[textStyles.textMedium24, styles.successTitle]}>
              Check Your Email
            </Text>

            <Text style={[textStyles.textRegular16, styles.successMessage]}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <Text style={[textStyles.textRegular14, styles.instructionText]}>
              Click the link in the email to reset your password. If you don't
              see the email, check your spam folder.
            </Text>

            {/* Resend Button */}
            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.disabledButton]}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              <Text
                style={[textStyles.textSemibold16, styles.resendButtonText]}
              >
                {isLoading ? "Sending..." : "Resend Email"}
              </Text>
            </TouchableOpacity>

            {/* Back to Sign In */}
            <TouchableOpacity
              style={styles.backToSignInButton}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={[textStyles.textMedium16, styles.backToSignInText]}>
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={moderateScale(24)}
                color={colors.darkGray}
              />
            </TouchableOpacity>
            <Text style={[textStyles.textMedium24, styles.titleText]}>
              Forgot Password?
            </Text>
            <Text style={[textStyles.textRegular16, styles.subtitleText]}>
              Don't worry! Enter your email and we'll send you a reset link
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Ionicons
                name="lock-closed-outline"
                size={moderateScale(80)}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
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

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={[textStyles.textSemibold16, styles.resetButtonText]}>
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[textStyles.textRegular16, styles.signInText]}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={[textStyles.textSemibold16, styles.signInLink]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(24),
  },
  header: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.lightBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  titleText: {
    color: colors.darkGray,
    marginBottom: verticalScale(8),
  },
  subtitleText: {
    color: colors.lightGray,
    lineHeight: moderateScale(24),
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: verticalScale(40),
  },
  illustration: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(32),
  },
  inputLabel: {
    color: colors.darkGray,
    marginBottom: verticalScale(8),
  },
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
  inputError: {
    borderColor: "#FF6B6B",
  },
  inputIcon: {
    marginRight: horizontalScale(12),
  },
  textInput: {
    flex: 1,
    color: colors.darkGray,
    paddingVertical: 0,
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: verticalScale(4),
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  resetButtonText: {
    color: colors.white,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(32),
  },
  signInText: {
    color: colors.lightGray,
  },
  signInLink: {
    color: colors.primary,
  },
  // Success screen styles
  successContainer: {
    flex: 1,
  },
  successContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: horizontalScale(24),
  },
  successIcon: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  successTitle: {
    color: colors.darkGray,
    marginBottom: verticalScale(16),
    textAlign: "center",
  },
  successMessage: {
    color: colors.lightGray,
    textAlign: "center",
    marginBottom: verticalScale(8),
    lineHeight: moderateScale(24),
  },
  emailText: {
    color: colors.primary,
    fontWeight: "600",
  },
  instructionText: {
    color: colors.lightGray,
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(40),
  },
  resendButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(32),
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  resendButtonText: {
    color: colors.white,
  },
  backToSignInButton: {
    paddingVertical: verticalScale(12),
  },
  backToSignInText: {
    color: colors.primary,
  },
});

export default ForgotPassword;
