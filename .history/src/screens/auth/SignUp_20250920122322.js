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
import { colors } from "../../../theme/colors";
import textStyles from "../../../theme/styles";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "../../../utils/responsive/metrices";
import { useAuth } from "../../context/AuthContext";
import { mImages } from "../../../assets/images";
import { SafeAreaView } from "react-native-safe-area-context";
const SignUp = ({ navigation }) => {
  const { signUp, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSignUp = async () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await signUp(formData);
        if (result.success) {
          // Navigation will be handled automatically by the auth state change
          Alert.alert("Success", "Account created successfully!");
        } else {
          Alert.alert(
            "Error",
            result.error || "Sign up failed. Please try again."
          );
        }
      } catch (error) {
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(24)}
            color={colors.white}
          />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <View
              style={{
                alignItems: "center",
                backgroundColor: colors.white,
              }}
            >
              <Image source={mImages.App_Icon} style={styles.image} />
            </View>
            <Text style={[textStyles.textMedium24, styles.titleText]}>
              Create Account
            </Text>
            <Text style={[textStyles.textRegular16, styles.subtitleText]}>
              Join us and start your tailoring journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}

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
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
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

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[textStyles.textMedium14, styles.inputLabel]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={moderateScale(20)}
                  color={colors.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[textStyles.textRegular16, styles.textInput]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.lightGray}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={moderateScale(20)}
                    color={colors.lightGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[textStyles.textRegular12, styles.errorText]}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[textStyles.textMedium14, styles.inputLabel]}>
                Confirm Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={moderateScale(20)}
                  color={colors.lightGray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[textStyles.textRegular16, styles.textInput]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.lightGray}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={moderateScale(20)}
                    color={colors.lightGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={[textStyles.textRegular12, styles.errorText]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxChecked,
                  ]}
                >
                  {acceptTerms && (
                    <Ionicons
                      name="checkmark"
                      size={moderateScale(16)}
                      color={colors.white}
                    />
                  )}
                </View>
                <Text style={[textStyles.textRegular14, styles.termsText]}>
                  I agree to the{" "}
                  <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms && (
                <Text style={[textStyles.textRegular12, styles.errorText]}>
                  {errors.terms}
                </Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text
                style={[textStyles.textSemibold16, styles.signUpButtonText]}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[textStyles.textRegular16, styles.signInText]}>
              Already have an account?{" "}
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
    // paddingTop: verticalScale(20),
    paddingBottom: verticalScale(50),
  },
  image: {
    width: 140,
    height: 140,
  },
  header: {
    marginBottom: verticalScale(0),
  },
  backButton: {
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
    marginTop: verticalScale(35),
    marginLeft: horizontalScale(14),
    position: "absolute",
  },
  titleText: {
    color: colors.darkGray,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(10),
  },
  subtitleText: {
    color: colors.lightGray,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(15),
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
  eyeIcon: {
    padding: moderateScale(4),
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: verticalScale(4),
  },
  termsContainer: {
    marginBottom: verticalScale(32),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: moderateScale(4),
    marginRight: horizontalScale(12),
    marginTop: verticalScale(2),
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    color: colors.darkGray,
    lineHeight: moderateScale(20),
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  signUpButtonText: {
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
});

export default SignUp;
