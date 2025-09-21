import Toast from "react-native-toast-message";

export const showSuccessToast = (title, message) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};

export const showErrorToast = (title, message) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};

export const showInfoToast = (title, message) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};

export const showWarningToast = (title, message) => {
  Toast.show({
    type: "error", // Using error style for warning
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};
