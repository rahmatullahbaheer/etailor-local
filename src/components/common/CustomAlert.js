import React from "react";
import {
  Alert as RNAlert,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { mImages } from "../../../assets/images"; // Assuming this is the correct import path

const CustomAlert = ({ title, text, onClose, onCancel, onDelete }) => {
  return (
    <View style={styles.alertContainer}>
      <View style={styles.alert}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Image source={mImages.black_cross} style={styles.closeImage} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Text>{text}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: "#EFEFEF" },
            ]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={[
              styles.button,
              styles.deleteButton,
              { backgroundColor: "#FC4141" },
            ]}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomAlert;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background to dim the rest of the screen
    position: "absolute",
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    zIndex: 999, // Ensure it's on top of other elements
  },
  alert: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "start",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    marginRight: 5,
  },
  deleteButton: {
    marginLeft: 5,
  },
  buttonText: {
    color: "#484848",
    fontWeight: "bold",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },
});
