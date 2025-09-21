import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, interpolate } from "react-native-reanimated";
import { verticalScale } from "../../../utils/responsive/metrices";

const { width, height } = Dimensions.get("screen");

const ExpoCamera = ({ visibility, onCLose, callBack }) => {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashmode, setflashmode] = useState(Camera.Constants.FlashMode.off);
  const [isPictureTaken, setIsPictureTaken] = useState(false);
  const [capturePicture, setCapturePicture] = useState("");

  const r = useSharedValue(63);

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: r.value,
      height: r.value,
    };
  }, [r]);

  const innerCircleAnimatedStyle = useAnimatedStyle(() => {
    let scale = interpolate(r.value, [63, 100], [0, 1]);
    return {
      opacity: scale,
    };
  }, [r]);

  const flipCam = () => {
    if (type == Camera.Constants.Type.back) {
      setType(Camera.Constants.Type.front);
    } else {
      setType(Camera.Constants.Type.back);
    }
  };

  const toggleFlash = () => {
    if (flashmode == Camera.Constants.FlashMode.off) {
      setflashmode(Camera.Constants.FlashMode.torch);
    } else {
      setflashmode(Camera.Constants.FlashMode.off);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    try {
      const data = await camera.takePictureAsync({
        quality: 0.2,
        base64: true,
      });
      // const compressedUri = await ImageCompress(data?.uri, {
      //   width: data?.width,
      //   height: data?.height,
      // });
      setCapturePicture(data?.base64);
      setTimeout(() => {
        setIsPictureTaken(true);
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasAudioPermission === false) {
    return <Text>No access to Audio</Text>;
  }

  return (
    visibility && (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: width,
          height: height,
          backgroundColor: "white",
          zIndex: 9,
        }}
      >
        <View style={{ flex: 1 }}>
          {!isPictureTaken ? (
            <>
              <View style={styles.cameraContainer}>
                <Camera
                  ref={(ref) => setCamera(ref)}
                  style={styles.fixedRatio}
                  type={type}
                  ratio={"4:3"}
                  flashMode={flashmode}
                  onCameraReady={() => setIsCameraReady(true)}
                />

                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: height - 200,
                    alignSelf: "center",
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    isCameraReady ? takePicture() : null;
                  }}
                >
                  <Animated.View style={[styles.startButton, circleAnimatedStyle]}>
                    <Animated.View style={[styles.startButtonChild, innerCircleAnimatedStyle]} />
                  </Animated.View>
                </TouchableOpacity>
                <View style={styles.camTopRow}>
                  <TouchableOpacity style={styles.closeButtonContainer} onPress={() => onCLose()}>
                    <AntDesign name="close" size={24} color="white" />
                  </TouchableOpacity>
                  <View style={styles.splashtoggleWrapper}>
                    <TouchableOpacity style={styles.camControls} onPress={() => flipCam()}>
                      <MaterialIcons name="flip-camera-android" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.camControls} onPress={() => toggleFlash()}>
                      {flashmode == Camera.Constants.FlashMode.torch ? (
                        <Ionicons name="flash-off-outline" size={24} color="white" />
                      ) : (
                        <Ionicons name="flash-outline" size={24} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  position: "relative",
                  width: width,
                  height: height,
                }}
              >
                <Image
                  style={{ width: width, height: height }}
                  source={{
                    uri: capturePicture,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.camTopRow}>
                <TouchableOpacity
                  style={styles.closeButtonContainer}
                  onPress={() => {
                    onCLose();
                    setIsPictureTaken(false);
                  }}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButtonContainer}
                  onPress={() => {
                    callBack(capturePicture);
                    setIsPictureTaken(false);
                  }}
                >
                  <AntDesign name="check" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    height: height,
    width: width,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  video: {
    alignSelf: "center",
    height: height - 100,
    width: width,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 500,
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  startButtonChild: {
    backgroundColor: "#F93030",
    borderRadius: 500,
    width: "90%",
    height: "90%",
  },
  camTopRow: {
    width: width,
    top: verticalScale(80),
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  closeButtonContainer: {
    height: 46,
    width: 46,
    backgroundColor: "#00000099",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  splashtoggleWrapper: {
    backgroundColor: "#00000099",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 10,
  },
  camControls: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

export default ExpoCamera;
