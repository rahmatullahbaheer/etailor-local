import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import OrdersScreen from "../screens/OrdersScreen";
import AddOrderScreen from "../screens/AddOrderScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserListScreen from "../screens/UserListScreen";
import AddCustomerScreen from "../screens/AddCustomerScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator to handle UserList navigation
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="UserList" component={UserListScreen} />
  </Stack.Navigator>
);

// Customer Stack Navigator to handle AddCustomer navigation
const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerMain" component={UserListScreen} />
    <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size, focused }) => {
        if (route.name === "Home") {
          return <MaterialIcons name="home" size={28} color={color} />;
        } else if (route.name === "Orders") {
          return <MaterialIcons name="list-alt" size={28} color={color} />;
        } else if (route.name === "AddOrder") {
          return (
            <MaterialIcons
              name="add-circle"
              size={30}
              color={focused ? "#6A0DAD" : "#ccc"}
            />
          );
        } else if (route.name === "Customers") {
          return <MaterialIcons name="people" size={28} color={color} />;
        } else if (route.name === "Profile") {
          return <FontAwesome name="user" size={28} color={color} />;
        }
        return null;
      },
      tabBarActiveTintColor: "#6A0DAD",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{ tabBarLabel: "Home", headerShown: false }}
    />
    <Tab.Screen
      name="Orders"
      component={OrdersScreen}
      options={{ tabBarLabel: "Orders", headerShown: false }}
    />

    <Tab.Screen
      name="AddOrder"
      component={AddOrderScreen}
      options={{ tabBarLabel: "", headerShown: false }}
    />
    <Tab.Screen
      name="Customers"
      component={CustomerStack}
      options={{ tabBarLabel: "Customers", headerShown: false }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: "Profile", headerShown: false }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({});

export default AppTabs;
