import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "@reduxjs/toolkit";

// Import slices
import authSlice from "./slices/authSlice";
import customerSlice from "./slices/customerSlice";
import orderSlice from "./slices/orderSlice";
import measurementSlice from "./slices/measurementSlice";
import notificationSlice from "./slices/notificationSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "customers", "orders", "measurements"], // Only persist these slices
  blacklist: ["notifications"], // Don't persist notifications
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  customers: customerSlice,
  orders: orderSlice,
  measurements: measurementSlice,
  notifications: notificationSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/FLUSH",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
