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

const OnboardingScreen1 = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingScreen2");
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
            source={require("../../../assets/images/onboarding/first.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to eTailor</Text>
          <Text style={styles.description}>
            Discover the best tailoring services in your area. Get your clothes
            tailored with precision and delivered right to your doorstep.
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
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
  nextButton: {
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

export default OnboardingScreen1;
