import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NotificationScreen from "../screens/NotificationScreen";

const Stack = createStackNavigator();

const NormalNavigator = () => {
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
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default NormalNavigator;
