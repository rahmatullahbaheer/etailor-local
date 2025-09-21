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
const SignIn = ({ navigation }) => {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    const newErrors = {};

    // For testing purposes, allow any email/password combination
    // Remove this in production and add proper validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await signIn(email, password);
        if (result.success) {
          // Show success message briefly
          Alert.alert("Success", "Welcome back!", [
            {
              text: "OK",
              onPress: () => {
                // Navigation will be handled automatically by the auth state change
                console.log("Sign in successful, navigating to home...");
              },
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            result.error || "Sign in failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Sign in error:", error);
        Alert.alert("Error", "Sign in failed. Please try again.");
      }
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Coming Soon", `${provider} login will be available soon!`);
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
          <View
            style={{
              alignItems: "center",
              marginTop: verticalScale(60),
            }}
          >
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
                  {" "}
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
                  placeholder="Enter your password"
                  placeholderTextColor={colors.lightGray}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text
                style={[textStyles.textMedium14, styles.forgotPasswordText]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text
                style={[textStyles.textSemibold16, styles.signInButtonText]}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Quick Test Sign In Button - Remove in production */}
            <TouchableOpacity
              style={[styles.testSignInButton]}
              onPress={() => {
                setEmail("test@example.com");
                setPassword("123456");
                // Auto sign in after setting credentials
                setTimeout(() => handleSignIn(), 100);
              }}
              disabled={isLoading}
            >
              <Text style={[textStyles.textRegular14, styles.testSignInText]}>
                Quick Test Sign In
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={[textStyles.textRegular14, styles.dividerText]}>
                Or continue with
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            {/* <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
              >
                <Ionicons
                  name="logo-google"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Apple")}
              >
                <Ionicons
                  name="logo-apple"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Facebook")}
              >
                <Ionicons
                  name="logo-facebook"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Sign Up Link */}
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
  container: {
    width: "100%",
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  image: {
    width: 140,
    height: 140,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(24),
  },
  header: {
    marginTop: verticalScale(40),
    marginBottom: verticalScale(40),
    alignItems: "center",
  },
  welcomeText: {
    color: colors.darkGray,
    marginBottom: verticalScale(8),
  },
  subtitleText: {
    color: colors.lightGray,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: verticalScale(20),
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
    // padding: moderateScale(4),
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: verticalScale(4),
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: verticalScale(32),
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
  },
  signInButtonText: {
    color: colors.white,
  },
  testSignInButton: {
    backgroundColor: colors.secondary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  testSignInText: {
    color: colors.white,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.lightGray,
    marginHorizontal: horizontalScale(16),
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: horizontalScale(16),
    marginBottom: verticalScale(40),
  },
  socialButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(102),
  },
  signUpText: {
    color: colors.lightGray,
  },
  signUpLink: {
    color: colors.primary,
  },
});

export default SignIn;
