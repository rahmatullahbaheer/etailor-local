import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { store, persistor } from "./src/store";
import LoadingScreen from "./src/components/LoadingScreen";
import { StorageUtils } from "./src/utils/orderStorage";

export default function App() {
  const [dbInitialized, setDbInitialized] = React.useState(false);

  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize SQLite database
      await StorageUtils.initializeDatabase();
      console.log("Database initialized successfully");
      setDbInitialized(true);
    } catch (error) {
      console.error("Failed to initialize database:", error);
      // You might want to show an error screen here
      setDbInitialized(true); // Continue anyway for now
    }
  };

  if (!dbInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AuthProvider>
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
