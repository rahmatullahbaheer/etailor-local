import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen1 from "../screens/onboarding/OnboardingScreen1";
import OnboardingScreen2 from "../screens/onboarding/OnboardingScreen2";
import OnboardingScreen3 from "../screens/onboarding/OnboardingScreen3";
import AuthNavigator from "./AuthNavigator";

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
      <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
