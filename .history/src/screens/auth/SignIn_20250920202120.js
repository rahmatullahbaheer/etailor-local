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

const SignIn = ({ navigation }) => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    const newErrors = {};
    console.log("Testing  Response:");

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://etailerbackend.etailer.site/api/v1/login",
          {
            email: email,
            password: password,
            fcm: "test-fcm-token", // ✅ static FCM for now
            type: "user", // ✅ static type
          }
        );

        console.log("Login Response:", response.data?.data);
        console.log("Login Token:", response.data?.token);
        if (!response?.error) {
          // Dispatch login success action to Redux store

          dispatch(
            loginSuccess({
              user: response?.data,
              token: response?.token,
            })
          );

          // Navigate to the main app screen
          // navigation.navigate("Main", {
          //   screen: "Home",
          // });
          console.log("User from Redux:", user?.user?.user);
        } else {
          Alert.alert("Error", response?.msg || "Sign in failed.");
        }
      } catch (error) {
        console.error("Sign in error:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message || "Sign in failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
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

            {/* Password */}
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

            {/* Sign In */}

            {/* <View style={[styles.signInButton]}> */}
            <PrimaryButton
              title={"Sign In..."}
              isLoading={isLoading}
              onPress={handleSignIn}
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
