import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { mImages } from "../../../assets/images";
import { AntDesign } from "@expo/vector-icons";
import textStyles from "../../../theme/styles";
import { clearToaster } from "../../redux/slices/toast.slice";
import { SUCCESS_TOAST } from "../../../utils/constants";

const { width, height } = Dimensions.get("screen");

const CustomToaster = () => {
  const toastData = useSelector((state) => state.toaster);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastData.length > 0) {
      setTimeout(() => {
        dispatch(clearToaster());
      }, 5000);
    }
  }, [toastData, dispatch]);

  return (
    <View style={styles.container}>
      {toastData.map((message, index) => (
        <Toaster key={index + message.id} data={message} />
      ))}
    </View>
  );
};

const Toaster = ({ data }) => {
  const dispatch = useDispatch();
  let isHorizontalTransaltionTriggered = false;
  const animationValue = useRef(new Animated.Value(0)).current;
  const horizontalTranslationAnimationValue = useRef(new Animated.Value(0)).current;
  const animate = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start(({ finished }) => {
      if (finished) {
        animateHorizontal();
      }
    });
  };

  const animateHorizontal = () => {
    Animated.timing(horizontalTranslationAnimationValue, {
      toValue: 1,
      duration: isHorizontalTransaltionTriggered ? 1000 : 5000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        dispatch({ type: TOASTER_CLEAR });
      }
    });
  };

  const xTransaltion = horizontalTranslationAnimationValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, -2000],
  });

  const yTransalation = animationValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, -20, -120],
  });

  const opacityValue = animationValue.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: [0, 0.7, 1],
  });
  useEffect(() => {
    animate();
  }, []);
  return (
    <Animated.View
      style={[
        styles.taostContainer,
        {
          opacity: opacityValue,
          transform: [
            {
              translateY: yTransalation,
            },
            { translateX: xTransaltion },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.closebtn}
        onPress={() => {
          isHorizontalTransaltionTriggered = true;
          animateHorizontal();
        }}
      >
        <AntDesign name="close" size={18} color="#545454" />
      </TouchableOpacity>
      <View style={styles.toasterContentsWrapper}>
        <View
          style={{
            ...styles.imgWrapper,
            backgroundColor: data?.type === SUCCESS_TOAST ? "#2FBE352B" : "#FFE2E7",
          }}
        >
          <Image
            source={data?.type === SUCCESS_TOAST ? mImages?.smile : mImages?.sad}
            style={{
              height: 24,
              width: 24,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headingText}>
            {data?.type === SUCCESS_TOAST ? "Success message" : "Error message"}
          </Text>
          <Text style={styles.messageText}>{data?.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -100,
    width: width,
    paddingHorizontal: 19,
    display: "flex",
    flexDirection: "column",
  },
  taostContainer: {
    alignSelf: "stretch",
    backgroundColor: "white",
    display: "flex",
    alignItems: "flex-start",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    paddingLeft: 11,
    paddingVertical: 14,
    paddingRight: 17,
  },
  toasterContentsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  imgWrapper: {
    height: 46,
    width: 46,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headingText: {
    ...textStyles?.textMedium15,
    fontSize: 14,
    color: "#0C1137",
  },
  messageText: {
    ...textStyles?.textMedium15,
    color: "#545454",
    fontSize: 13,
  },
  closebtn: {
    position: "absolute",
    right: 12,
    top: 8,
    padding: 5,
  },
});

export default CustomToaster;
