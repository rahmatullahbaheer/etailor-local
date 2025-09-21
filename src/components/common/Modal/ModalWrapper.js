import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width, height } = Dimensions.get("window");

const ModalWrapper = ({
  callBack,
  children,
  visibility,
  animationType,
  close,
}) => {
  return (
    <>
      {visibility && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            width: width,
            height: height,
            zIndex: 99,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        ></View>
      )}

      <Modal
        animationType={animationType ? animationType : "slide"}
        transparent={true}
        visible={visibility}
        onRequestClose={() => callBack()}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalWrapper;
