import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../../theme/colors";

const { width, height } = Dimensions.get("window");
const ONBOARDING_COMPLETED = "onboarding_completed";

const OnboardingScreen2 = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingScreen3");
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED, "true");
      navigation.navigate("Auth");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      navigation.navigate("Auth");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/onboarding/second.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Professional Tailoring</Text>
          <Text style={styles.description}>
            Our skilled tailors provide high-quality alterations and custom
            tailoring services. From simple hemming to complete garment
            creation.
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  skipContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: colors.lightGray,
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    tintColor: colors.secondary,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.mediumGray,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
    borderRadius: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flex: 0.4,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  nextButton: {
    flex: 0.55,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OnboardingScreen2;
