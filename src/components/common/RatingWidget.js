import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StarRating from "react-native-star-rating-widget";
import { AntDesign } from "@expo/vector-icons";

export default function RatingWidget({ rating }) {
  return (
    <StarRating
      rating={rating}
      StarIconComponent={() => <AntDesign name="star" size={11} color="#FFE01D" />}
      maxStars={5}
      starStyle={{ marginHorizontal: 0 }}
    />
  );
}

const styles = StyleSheet.create({});
