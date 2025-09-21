import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import PrimaryButton from "../common/PrimaryButton";

const OrderDetailsStep = ({
  orderDetails,
  setOrderDetails,
  formData,
  measurements,
  onPrevious,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || orderDetails.deliveryDate;
    setShowDatePicker(Platform.OS === "ios");
    setOrderDetails({ ...orderDetails, deliveryDate: currentDate });
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.headingRow}>
        <Ionicons name="reader-outline" size={26} color="#008080" />
        <Text style={styles.stepTitle}>Order Details</Text>
      </View>

      {/* Delivery & Timing Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#008080" />
          <Text style={styles.sectionTitle}>Delivery & Timing</Text>
        </View>

        <TouchableOpacity
          style={styles.datePickerCard}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateIconContainer}>
            <Ionicons name="calendar" size={24} color="#008080" />
          </View>
          <View style={styles.dateInfoContainer}>
            <Text style={styles.dateLabel}>Delivery Date</Text>
            <Text style={styles.dateValue}>
              {formatDate(orderDetails.deliveryDate)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={orderDetails.deliveryDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Financial Details Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="wallet-outline" size={20} color="#008080" />
          <Text style={styles.sectionTitle}>Financial Details</Text>
        </View>

        <View style={styles.amountRow}>
          <View style={styles.amountCard}>
            <View style={styles.amountIconContainer}>
              <Ionicons name="cash" size={20} color="#27ae60" />
            </View>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={orderDetails.totalAmount}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, totalAmount: text })
              }
              returnKeyType="next"
            />
          </View>

          <View style={styles.amountCard}>
            <View style={styles.amountIconContainer}>
              <Ionicons name="card" size={20} color="#3498db" />
            </View>
            <Text style={styles.amountLabel}>Advance</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={orderDetails.advanceAmount}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, advanceAmount: text })
              }
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Remaining Amount Display */}
        {orderDetails.totalAmount && orderDetails.advanceAmount && (
          <View style={styles.remainingAmountCard}>
            <Text style={styles.remainingLabel}>Remaining Amount</Text>
            <Text style={styles.remainingValue}>
              {(
                parseFloat(orderDetails.totalAmount || 0) -
                parseFloat(orderDetails.advanceAmount || 0)
              ).toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Order Specifications Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shirt-outline" size={20} color="#008080" />
          <Text style={styles.sectionTitle}>Order Specifications</Text>
        </View>

        <View style={styles.specificationRow}>
          <View style={styles.specIconContainer}>
            <Ionicons name="layers-outline" size={24} color="#008080" />
          </View>
          <View style={styles.specInputContainer}>
            <Text style={styles.specLabel}>Number of Suits</Text>
            <TextInput
              style={styles.specInput}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={orderDetails.suitCount}
              onChangeText={(text) =>
                setOrderDetails({ ...orderDetails, suitCount: text })
              }
              returnKeyType="next"
            />
          </View>
        </View>
      </View>

      {/* Additional Notes Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={20} color="#008080" />
          <Text style={styles.sectionTitle}>Additional Notes</Text>
        </View>

        <View style={styles.notesContainer}>
          <TextInput
            style={styles.notesInput}
            placeholder="Add special instructions, fabric preferences, or any other details..."
            multiline
            numberOfLines={4}
            value={orderDetails.description}
            onChangeText={(text) =>
              setOrderDetails({ ...orderDetails, description: text })
            }
            textAlignVertical="top"
            blurOnSubmit={true}
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Order Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Customer:</Text>
          <Text style={styles.summaryValue}>
            {formData.name || "Not specified"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Measurements:</Text>
          <Text style={styles.summaryValue}>{measurements.length} items</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Suits:</Text>
          <Text style={styles.summaryValue}>
            {orderDetails.suitCount || "0"}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery:</Text>
          <Text style={styles.summaryValue}>
            {formatDate(orderDetails.deliveryDate)}
          </Text>
        </View>
      </View>

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
            title="Save Order"
            style={[styles.nextButton, styles.saveButton]}
            onPress={onSave}
          />
        </View>
      </View>
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
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 8,
  },
  datePickerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dateInfoContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
  },
  amountCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  amountIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
    textAlign: "center",
  },
  amountInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    borderWidth: 0,
    padding: 0,
    minWidth: 60,
  },
  remainingAmountCard: {
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3e6c3",
  },
  remainingLabel: {
    fontSize: 14,
    color: "#27ae60",
    fontWeight: "500",
  },
  remainingValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
  },
  specificationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  specIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  specInputContainer: {
    flex: 1,
  },
  specLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
  },
  specInput: {
    fontSize: 16,
    color: "#2c3e50",
    borderBottomWidth: 2,
    borderBottomColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  notesContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  notesInput: {
    fontSize: 15,
    color: "#2c3e50",
    lineHeight: 22,
    minHeight: 80,
    borderWidth: 0,
    padding: 0,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
  },
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
  saveButton: {
    backgroundColor: "#27ae60",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default OrderDetailsStep;
