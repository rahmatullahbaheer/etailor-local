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
import { SafeAreaView } from "react-native-safe-area-context";
const MeasurementStep = ({
  measurements,
  setMeasurements,
  onNext,
  onPrevious,
  onImagePress,
  onDeleteMeasurement,
}) => {
  const updateMeasurement = (index, field, value) => {
    setMeasurements((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addMeasurement = () => {
    setMeasurements((prev) => [
      ...prev,
      { enName: "", urName: "", value: "", image: null },
    ]);
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      <View style={styles.headingRow}>
        <Ionicons name="ribbon-outline" size={26} color="#008080" />
        <Text style={styles.stepTitle}>Measurement</Text>
      </View>

      {/* Add Button */}
      <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
        <TouchableOpacity style={styles.addBtn} onPress={addMeasurement}>
          <Ionicons name="add-circle-outline" size={18} color="#008080" />
          <Text style={styles.addBtnText}>Add Measurement</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      {measurements.length > 0 ? (
        measurements.map((m, idx) => (
          <View key={idx} style={styles.measurementCard}>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDeleteMeasurement(idx)}
            >
              <Ionicons name="close" size={16} color="#c0392b" />
            </TouchableOpacity>

            {/* Clothing Image */}
            <View style={styles.clothingImageContainer}>
              <TouchableOpacity
                style={styles.clothingImage}
                onPress={() => onImagePress(idx)}
              >
                {m.image ? (
                  <Image
                    source={{ uri: m.image }}
                    style={styles.measurementImagePreview}
                  />
                ) : (
                  <View style={styles.imagePlaceholderSmall}>
                    <Ionicons name="camera-outline" size={24} color="#008080" />
                    <Text style={styles.imageTextSmall}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Image Action Buttons */}
              <View style={styles.imageActionButtons}>
                <TouchableOpacity
                  style={styles.smallActionBtn}
                  onPress={() => onImagePress(idx)}
                >
                  <Ionicons name="add" size={12} color="#008080" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Measurement Names */}
            <View style={styles.measurementInfo}>
              <TextInput
                style={styles.measurementNameEn}
                placeholder="Measurement Name"
                value={m.enName}
                onChangeText={(t) => updateMeasurement(idx, "enName", t)}
              />
              <TextInput
                style={styles.measurementNameUr}
                placeholder="پیمائش کا نام"
                value={m.urName}
                onChangeText={(t) => updateMeasurement(idx, "urName", t)}
              />
            </View>

            {/* Value Input */}
            <View style={styles.valueContainer}>
              <TextInput
                style={styles.valueInput}
                placeholder="0.0"
                keyboardType="numeric"
                value={m.value}
                onChangeText={(t) => updateMeasurement(idx, "value", t)}
              />
            </View>
          </View>
        ))
      ) : (
        /* Empty State */
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="resize-outline" size={60} color="#bdc3c7" />
          </View>
          <Text style={styles.emptyStateTitle}>No Measurements Found</Text>
          <Text style={styles.emptyStateMessage}>
            Start by adding your first measurement using the button above.
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={addMeasurement}
          >
            <Ionicons name="add-circle" size={20} color="#008080" />
            <Text style={styles.emptyStateButtonText}>
              Add First Measurement
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Nav Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, styles.prevBtn]}
          onPress={onPrevious}
        >
          <Ionicons name="arrow-back" size={18} color="#008080" />
          <Text style={[styles.navBtnText, { color: "#008080" }]}>
            Previous
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Next"
            style={[styles.nextButton]}
            onPress={onNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepContainer: { marginTop: 1 },
  headingRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#008080",
  },
  measurementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  clothingImageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  clothingImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f8f8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0f0f0",
  },
  measurementInfo: {
    flex: 1,
    marginRight: 16,
  },
  measurementNameEn: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
    borderWidth: 0,
    padding: 0,
  },
  measurementNameUr: {
    fontSize: 14,
    color: "#7f8c8d",
    borderWidth: 0,
    padding: 0,
    textAlign: "left",
  },
  valueContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 80,
  },
  valueInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    borderWidth: 0,
    padding: 0,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#E6F2F2",
    borderWidth: 1,
    borderColor: "#B3D9D9",
  },
  addBtnText: { color: "#008080", fontWeight: "600" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  prevBtn: {
    backgroundColor: "#E6F2F2",
    borderColor: "#B3D9D9",
  },
  navBtnText: { fontWeight: "600" },
  nextButton: {
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  measurementImagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholderSmall: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  imageTextSmall: {
    color: "#008080",
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
  imageActionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -12,
    paddingHorizontal: 4,
  },
  smallActionBtn: {
    backgroundColor: "#E6F2F2",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B3D9D9",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
    maxWidth: 250,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F2F2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#B3D9D9",
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#008080",
  },
});

export default MeasurementStep;
