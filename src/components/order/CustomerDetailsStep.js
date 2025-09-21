import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../common/PrimaryButton";

const CustomerDetailsStep = ({
  formData,
  setFormData,
  onNext,
  onImagePress,
}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.headingRow}>
        <Ionicons name="person-circle-outline" size={28} color="#008080" />
        <Text style={styles.stepTitle}>Customer Details</Text>
      </View>

      {/* Image Picker */}
      <TouchableOpacity style={styles.imageBox} onPress={onImagePress}>
        {formData.image ? (
          <Image source={{ uri: formData.image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={28} color="#888" />
            <Text style={styles.imageText}>Add Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Inputs with Icons */}
      <View style={styles.inputRow}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons
          name="call-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          returnKeyType="next"
        />
      </View>

      <View style={[styles.inputRow, styles.textAreaRow]}>
        <Ionicons
          name="home-outline"
          size={20}
          color="#888"
          style={[styles.icon, { marginTop: 6 }]}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Address"
          multiline
          numberOfLines={3}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          blurOnSubmit={true}
          returnKeyType="done"
        />
      </View>

      <PrimaryButton title="Next" style={styles.nextButton} onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: { marginTop: 20 },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#008080",
  },
  imageBox: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#888",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
  },
  imagePlaceholder: { alignItems: "center" },
  imageText: { color: "#888", marginTop: 6, fontSize: 14 },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, paddingVertical: 10 },
  textAreaRow: { alignItems: "flex-start" },
  textArea: { height: 80, textAlignVertical: "top" },
  nextButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
});

export default CustomerDetailsStep;
