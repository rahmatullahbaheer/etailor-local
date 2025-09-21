import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { OrderStorage, DraftStorage } from "../utils/orderStorage";
import { PageHeader } from "../components";
import CustomerDetailsStep from "../components/order/CustomerDetailsStep";
import MeasurementStep from "../components/order/MeasurementStep";
import OrderDetailsStep from "../components/order/OrderDetailsStep";
import OrderModals from "../components/order/OrderModals";

const AddOrderScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [orderDetails, setOrderDetails] = useState({
    deliveryDate: new Date(),
    totalAmount: "",
    advanceAmount: "",
    suitCount: "",
    description: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [savedOrder, setSavedOrder] = useState(null);

  const [measurements, setMeasurements] = useState([
    { enName: "Chest", urName: "سینہ", value: "", image: null },
    { enName: "Waist", urName: "کمر", value: "", image: null },
    { enName: "Length", urName: "لمبائی", value: "", image: null },
  ]);

  // Storage keys
  const STORAGE_KEYS = {
    ORDERS: "@orders_list",
    DRAFT_ORDER: "@draft_order",
  };

  // Load draft data on component mount
  useEffect(() => {
    loadDraftOrder();
  }, []);

  // Auto-save draft whenever data changes
  useEffect(() => {
    saveDraftOrder();
  }, [formData, orderDetails, measurements, step]);

  // Local storage functions
  const saveDraftOrder = async () => {
    try {
      const draftData = {
        step,
        formData,
        orderDetails: {
          ...orderDetails,
          deliveryDate: orderDetails.deliveryDate.toISOString(),
        },
        measurements,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.DRAFT_ORDER,
        JSON.stringify(draftData)
      );
    } catch (error) {
      console.log("Error saving draft:", error);
    }
  };

  const loadDraftOrder = async () => {
    try {
      const draftData = await AsyncStorage.getItem(STORAGE_KEYS.DRAFT_ORDER);
      if (draftData) {
        const parsed = JSON.parse(draftData);
        setStep(parsed.step || 1);
        setFormData(parsed.formData || formData);
        setOrderDetails({
          ...parsed.orderDetails,
          deliveryDate: new Date(parsed.orderDetails.deliveryDate),
        });
        setMeasurements(parsed.measurements || measurements);
      }
    } catch (error) {
      console.log("Error loading draft:", error);
    }
  };

  const saveOrderToStorage = async (orderData) => {
    try {
      // Get existing orders
      const existingOrders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];

      // Create new order with ID and timestamp
      const newOrder = {
        id: `ORD-${Date.now()}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      // Add to orders list
      orders.unshift(newOrder);

      // Save back to storage
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      return newOrder;
    } catch (error) {
      console.log("Error saving order:", error);
      throw error;
    }
  };

  const clearDraftOrder = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DRAFT_ORDER);
    } catch (error) {
      console.log("Error clearing draft:", error);
    }
  };

  const getAllOrders = async () => {
    try {
      const orders = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.log("Error getting orders:", error);
      return [];
    }
  };

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
      if (currentImageIndex !== null) {
        updateMeasurement(currentImageIndex, "image", result.assets[0].uri);
      } else {
        setFormData((p) => ({ ...p, image: result.assets[0].uri }));
      }
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
      if (currentImageIndex !== null) {
        updateMeasurement(currentImageIndex, "image", result.assets[0].uri);
      } else {
        setFormData((p) => ({ ...p, image: result.assets[0].uri }));
      }
    }
  };

  const updateMeasurement = (index, field, value) => {
    setMeasurements((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeMeasurement = (index) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmDeleteMeasurement = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      removeMeasurement(deleteIndex);
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleImageSelection = async (type) => {
    setShowImageModal(false);
    if (type === "camera") {
      await takePhotoWithCamera();
    } else {
      await pickImageFromLibrary();
    }
    setCurrentImageIndex(null);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSaveOrder = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        Alert.alert("Validation Error", "Customer name is required");
        return;
      }

      if (!formData.phone.trim()) {
        Alert.alert("Validation Error", "Customer phone is required");
        return;
      }

      if (!orderDetails.totalAmount.trim()) {
        Alert.alert("Validation Error", "Total amount is required");
        return;
      }

      const payload = {
        customer: formData,
        measurements,
        order: {
          ...orderDetails,
          deliveryDate: orderDetails.deliveryDate.toISOString(),
        },
      };

      // Save to local storage
      const newSavedOrder = await OrderStorage.saveOrder(payload);

      console.log("Order saved successfully:", newSavedOrder);

      // Store saved order for success modal
      setSavedOrder(newSavedOrder);

      // Clear draft after successful save
      await DraftStorage.clearDraft();

      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to save order. Please try again.");
      console.error("Error saving order:", error);
    }
  };

  const resetForm = async () => {
    setStep(1);
    setFormData({
      image: null,
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setOrderDetails({
      deliveryDate: new Date(),
      totalAmount: "",
      advanceAmount: "",
      suitCount: "",
      description: "",
    });
    setMeasurements([
      { enName: "Chest", urName: "سینہ", value: "", image: null },
      { enName: "Waist", urName: "کمر", value: "", image: null },
      { enName: "Length", urName: "لمبائی", value: "", image: null },
    ]);

    // Clear draft from storage
    await DraftStorage.clearDraft();
  };

  return (
    <>
      <PageHeader title="Add Order" showBackButton={false} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {step === 1 && (
            <CustomerDetailsStep
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
              onImagePress={() => openImageModal(null)}
            />
          )}

          {step === 2 && (
            <MeasurementStep
              measurements={measurements}
              setMeasurements={setMeasurements}
              onNext={() => setStep(3)}
              onPrevious={() => setStep(1)}
              onImagePress={openImageModal}
              onDeleteMeasurement={confirmDeleteMeasurement}
            />
          )}

          {step === 3 && (
            <OrderDetailsStep
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
              formData={formData}
              measurements={measurements}
              onPrevious={() => setStep(2)}
              onSave={handleSaveOrder}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <OrderModals
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteIndex={deleteIndex}
        measurements={measurements}
        formData={formData}
        orderDetails={orderDetails}
        savedOrder={savedOrder}
        onImageSelection={handleImageSelection}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteCancel={handleDeleteCancel}
        onSuccessClose={() => {
          setShowSuccessModal(false);
          setSavedOrder(null);
          resetForm();
        }}
        formatDate={formatDate}
      />
    </>
  );
};

export default AddOrderScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
