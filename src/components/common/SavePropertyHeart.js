import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import API from "../../../utils/api";
import useToaster from "../../hooks/useToaster";

export default function SavePropertyHeart({ isFav, id, onRefresh }) {
  const { toastAlert } = useToaster();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth);
  const addToFav = async () => {
    const payload = {
      post_id: id,
      user_id: user?.primary,
      type: "post",
    };
    try {
      setLoading(true);
      const data = await API.post("/customer_post_saved", payload);
      onRefresh();
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 422) {
        toastAlert("Login is required to save this property", false);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableOpacity
      style={{ marginRight: 8, marginTop: 3, marginLeft: "auto" }}
      onPress={addToFav}
    >
      {loading ? (
        <ActivityIndicator size={18} color="white" />
      ) : (
        <AntDesign
          name="heart"
          size={18}
          color={isFav ? "red" : colors.lightGray}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
