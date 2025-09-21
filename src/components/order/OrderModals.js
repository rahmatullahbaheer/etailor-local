import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const { width: screenWidth } = Dimensions.get("window");

const OrderModals = ({
  showImageModal,
  setShowImageModal,
  showSuccessModal,
  setShowSuccessModal,
  showDeleteModal,
  setShowDeleteModal,
  deleteIndex,
  measurements,
  formData,
  orderDetails,
  savedOrder,
  onImageSelection,
  onDeleteConfirm,
  onDeleteCancel,
  onSuccessClose,
  formatDate,
}) => {
  return (
    <>
      {/* Modern Image Selection Modal */}
      <Modal
        isVisible={showImageModal}
        onBackdropPress={() => setShowImageModal(false)}
        onSwipeComplete={() => setShowImageModal(false)}
        swipeDirection={["down"]}
        style={styles.modal}
        backdropOpacity={0.7}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            <Text style={styles.modalSubtitle}>
              Choose how you'd like to add an image
            </Text>
          </View>

          <View style={styles.modalOptions}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => onImageSelection("camera")}
            >
              <View style={styles.modalOptionIcon}>
                <Ionicons name="camera" size={28} color="#008080" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Camera</Text>
                <Text style={styles.modalOptionDesc}>Take a new photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => onImageSelection("gallery")}
            >
              <View style={styles.modalOptionIcon}>
                <Ionicons name="images" size={28} color="#008080" />
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Gallery</Text>
                <Text style={styles.modalOptionDesc}>Choose from photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
        onBackdropPress={() => setShowSuccessModal(false)}
        style={styles.successModal}
        backdropOpacity={0.8}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={400}
        animationOutTiming={300}
      >
        <View style={styles.successModalContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#27ae60" />
          </View>

          <Text style={styles.successTitle}>Order Saved Successfully!</Text>
          <Text style={styles.successMessage}>
            Your order has been saved to local storage and is ready for
            processing.
          </Text>

          <View style={styles.successDetails}>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Order ID:</Text>
              <Text style={styles.successDetailValue}>
                {savedOrder?.id || "N/A"}
              </Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Customer:</Text>
              <Text style={styles.successDetailValue}>
                {formData.name || "N/A"}
              </Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Delivery:</Text>
              <Text style={styles.successDetailValue}>
                {savedOrder
                  ? formatDate(new Date(savedOrder.order.deliveryDate))
                  : formatDate(orderDetails.deliveryDate)}
              </Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Status:</Text>
              <Text style={styles.successDetailValue}>
                {savedOrder?.status || "Pending"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={onSuccessClose}
          >
            <Text style={styles.successButtonText}>Create New Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successSecondaryButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Text style={styles.successSecondaryButtonText}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={onDeleteCancel}
        style={styles.deleteModal}
        backdropOpacity={0.8}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
      >
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteIcon}>
            <Ionicons name="warning" size={60} color="#e74c3c" />
          </View>

          <Text style={styles.deleteTitle}>Delete Measurement?</Text>
          <Text style={styles.deleteMessage}>
            {deleteIndex !== null && measurements[deleteIndex]
              ? `Are you sure you want to delete "${
                  measurements[deleteIndex].enName || "this measurement"
                }"? This action cannot be undone.`
              : "Are you sure you want to delete this measurement? This action cannot be undone."}
          </Text>

          <View style={styles.deleteButtonContainer}>
            <TouchableOpacity
              style={styles.deleteCancelButton}
              onPress={onDeleteCancel}
            >
              <Text style={styles.deleteCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteConfirmButton}
              onPress={onDeleteConfirm}
            >
              <Text style={styles.deleteConfirmButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  /* Modern Modal Styles */
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

  /* Success Modal Styles */
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
  successDetails: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },
  successDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  successDetailLabel: {
    fontSize: 14,
    color: "#6c757d",
  },
  successDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  successButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
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
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  successSecondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },

  /* Delete Confirmation Modal Styles */
  deleteModal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  deleteModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: screenWidth - 40,
    maxWidth: 380,
  },
  deleteIcon: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#ffeaea",
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 12,
  },
  deleteMessage: {
    fontSize: 15,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  deleteButtonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  deleteCancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  deleteCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteConfirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default OrderModals;
