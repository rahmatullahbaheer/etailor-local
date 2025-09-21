import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { PageHeader } from "../components";
import PrimaryButton from "../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import { useCustomers } from "../hooks/useRedux";
import {
  addCustomer,
  addCustomerNotification,
} from "../store/slices/customerSlice";
import { addCustomerNotification as addNotification } from "../store/slices/notificationSlice";

const { width: screenWidth } = Dimensions.get("window");

const AddCustomerScreen = ({ navigation }) => {
  const { loading, dispatch } = useCustomers();

  const [customerData, setCustomerData] = useState({
    image: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Image picker functions
  const pickImageFromLibrary = async () => {
    const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPerm.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCustomerData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const takePhotoWithCamera = async () => {
    const camPerm = await ImagePicker.requestCameraPermissionsAsync();
    if (!camPerm.granted) {
      Alert.alert("Permission required", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCustomerData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleImageSelection = async (type) => {
    setShowImageModal(false);
    if (type === "camera") {
      await takePhotoWithCamera();
    } else {
      await pickImageFromLibrary();
    }
  };

  const handleSaveCustomer = () => {
    // Basic validation
    if (!customerData.firstName.trim() || !customerData.lastName.trim()) {
      Alert.alert("Error", "Please enter first name and last name.");
      return;
    }

    if (!customerData.phone.trim()) {
      Alert.alert("Error", "Please enter phone number.");
      return;
    }

    // Save customer to Redux store
    dispatch(addCustomer(customerData));

    // Add notification
    dispatch(
      addNotification({
        type: "new_customer",
        customerId: Date.now().toString(),
        customerName: `${customerData.firstName} ${customerData.lastName}`,
      })
    );

    setShowSuccessModal(true);
  };

  const resetForm = () => {
    setCustomerData({
      image: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      notes: "",
    });
  };

  const getInitials = () => {
    const first = customerData.firstName.charAt(0).toUpperCase();
    const last = customerData.lastName.charAt(0).toUpperCase();
    return first + last;
  };

  return (
    <View style={styles.container}>
      <PageHeader title="Add Customer" showBackButton={true} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => setShowImageModal(true)}
          >
            {customerData.image ? (
              <Image
                source={{ uri: customerData.image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                {customerData.firstName || customerData.lastName ? (
                  <Text style={styles.initialsText}>{getInitials()}</Text>
                ) : (
                  <>
                    <MaterialIcons
                      name="person-add"
                      size={40}
                      color="#bdc3c7"
                    />
                    <Text style={styles.imageText}>Add Photo</Text>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to add customer photo</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={customerData.firstName}
                onChangeText={(text) =>
                  setCustomerData((prev) => ({ ...prev, firstName: text }))
                }
              />
            </View>
            <View style={styles.nameInput}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={customerData.lastName}
                onChangeText={(text) =>
                  setCustomerData((prev) => ({ ...prev, lastName: text }))
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={customerData.email}
              onChangeText={(text) =>
                setCustomerData((prev) => ({ ...prev, email: text }))
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={customerData.phone}
              onChangeText={(text) =>
                setCustomerData((prev) => ({ ...prev, phone: text }))
              }
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={customerData.address}
              onChangeText={(text) =>
                setCustomerData((prev) => ({ ...prev, address: text }))
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              value={customerData.city}
              onChangeText={(text) =>
                setCustomerData((prev) => ({ ...prev, city: text }))
              }
            />
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any special notes about the customer..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={customerData.notes}
              onChangeText={(text) =>
                setCustomerData((prev) => ({ ...prev, notes: text }))
              }
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <MaterialIcons name="refresh" size={20} color="#6c757d" />
            <Text style={styles.resetButtonText}>Reset Form</Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Save Customer"
            style={styles.saveButton}
            onPress={handleSaveCustomer}
          />
        </View>
      </ScrollView>

      {/* Image Selection Modal */}
      <Modal
        isVisible={showImageModal}
        onBackdropPress={() => setShowImageModal(false)}
        onSwipeComplete={() => setShowImageModal(false)}
        swipeDirection={["down"]}
        style={styles.modal}
        backdropOpacity={0.7}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            <Text style={styles.modalSubtitle}>
              Choose how you'd like to add a photo
            </Text>
          </View>

          <View style={styles.modalOptions}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImageSelection("camera")}
            >
              <View style={styles.modalOptionIcon}>
                <MaterialIcons name="camera-alt" size={28} color="#008080" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Camera</Text>
                <Text style={styles.modalOptionDesc}>Take a new photo</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleImageSelection("gallery")}
            >
              <View style={styles.modalOptionIcon}>
                <MaterialIcons name="photo-library" size={28} color="#008080" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Gallery</Text>
                <Text style={styles.modalOptionDesc}>Choose from photos</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => setShowImageModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        isVisible={showSuccessModal}
        style={styles.successModal}
        backdropOpacity={0.8}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.successModalContent}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={80} color="#27ae60" />
          </View>

          <Text style={styles.successTitle}>Customer Added Successfully!</Text>
          <Text style={styles.successMessage}>
            {customerData.firstName} {customerData.lastName} has been added to
            your customer list.
          </Text>

          <View style={styles.successButtons}>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                resetForm();
              }}
            >
              <Text style={styles.successButtonText}>Add Another Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successSecondaryButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successSecondaryButtonText}>
                View Customers
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  scrollView: {
    flex: 1,
  },

  imageSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
  },

  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },

  initialsText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6c757d",
  },

  imageText: {
    color: "#bdc3c7",
    fontSize: 12,
    marginTop: 4,
  },

  imageHint: {
    color: "#6c757d",
    fontSize: 14,
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 20,
  },

  nameRow: {
    flexDirection: "row",
    gap: 12,
  },

  nameInput: {
    flex: 1,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2c3e50",
    backgroundColor: "#fff",
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 12,
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 8,
  },

  resetButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "500",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#27ae60",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Modal Styles
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
    minHeight: 280,
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },

  modalHeader: {
    alignItems: "center",
    marginBottom: 30,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },

  modalOptions: {
    marginBottom: 20,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  modalOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  modalOptionText: {
    flex: 1,
  },

  modalOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },

  modalOptionDesc: {
    fontSize: 13,
    color: "#6c757d",
  },

  modalCancelBtn: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },

  // Success Modal
  successModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },

  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: screenWidth - 40,
    maxWidth: 400,
  },

  successIcon: {
    marginBottom: 20,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 12,
  },

  successMessage: {
    fontSize: 15,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },

  successButtons: {
    width: "100%",
    gap: 12,
  },

  successButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  successButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  successSecondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  successSecondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
});

export default AddCustomerScreen;
