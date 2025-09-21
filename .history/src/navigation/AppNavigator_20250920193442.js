import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import AppTabs from "./AppTabs";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components";
import NotificationScreen from "../screens/NotificationScreen";
import NormalNavigator from "./NormalNavigator";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();
const ONBOARDING_COMPLETED = "onboarding_completed";

const AppNavigator = () => {
  const user = useSelector((state) => state.auth);
  console.log("User from Redux in AppNavigator:", user);

  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED);
      setIsOnboardingCompleted(completed === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || authLoading) {
    return <LoadingScreen message="Loading eTailor..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          // Show onboarding for first-time users
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : isAuthenticated ? (
          // Show auth screens for unauthenticated users
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Show main app for authenticated users
          <>
            <Stack.Screen name="Main" component={AppTabs} />
            {/* <Stack.Screen name="NormalStack" component={NormalNavigator} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
