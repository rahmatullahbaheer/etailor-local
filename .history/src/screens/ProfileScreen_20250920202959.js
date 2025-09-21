import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const { width: screenWidth } = Dimensions.get("window");
import ProfileImagePicker from "../components/common/ProfileImagePicker";
import { PageHeader } from "../components";
import { colors } from "../../theme/colors";
import fonts from "../../theme/fonts";
import textStyles, { flexRow, flexCenter, iosShadow } from "../../theme/styles";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "../../utils/responsive/metrices";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const ProfileScreen = () => {
  const [userImage, setUserImage] = useState(null);
  const [userName] = useState("John Doe"); // This would come from user context/state
  const [userEmail] = useState("john.doe@example.com");
  const dispatch = useDispatch();
  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleImageChange = (imageUri) => {
    setUserImage(imageUri);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    // Handle logout logic here
    dispatch(logout());
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText("");
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() === "DELETE") {
      setShowDeleteModal(false);
      setShowDeleteSuccess(true);
      // Handle account deletion logic here
      console.log("Account deleted");
    } else {
      Alert.alert("Error", "Please type 'DELETE' to confirm account deletion.");
    }
  };

  const ProfileMenuItem = ({
    icon,
    title,
    onPress,
    iconColor = colors.mediumGray,
    showArrow = true,
    titleStyle,
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[flexRow, { flex: 1 }]}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={icon}
            size={moderateScale(22)}
            color={iconColor}
          />
        </View>
        <Text style={[styles.menuText, titleStyle]}>{title}</Text>
      </View>
      {showArrow && (
        <MaterialIcons
          name="chevron-right"
          size={moderateScale(24)}
          color={colors.lightGray}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <PageHeader
        title="Profile"
        showBackButton={false}
        onRightIconPress={() => console.log("Search orders")}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <ProfileImagePicker
            image={userImage}
            onChangeImage={handleImageChange}
          />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <MaterialIcons
              name="edit"
              size={moderateScale(16)}
              color={colors.primary}
            />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.menuContainer}>
            <ProfileMenuItem
              icon="dashboard"
              title="Dashboard"
              iconColor={colors.primary}
              onPress={() => console.log("Dashboard pressed")}
            />

            <View style={styles.separator} />

            <ProfileMenuItem
              icon="settings"
              title="Settings"
              iconColor={colors.mediumGray}
              onPress={() => console.log("Settings pressed")}
            />

            <View style={styles.separator} />

            <ProfileMenuItem
              icon="lock"
              title="Change Password"
              iconColor={colors.darkYellow}
              onPress={() => console.log("Change Password pressed")}
            />

            <View style={styles.separator} />

            <ProfileMenuItem
              icon="description"
              title="Terms & Conditions"
              iconColor={colors.secondary}
              onPress={() => console.log("Terms pressed")}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <View style={styles.menuContainer}>
            <ProfileMenuItem
              icon="logout"
              title="Logout"
              iconColor={colors.darkYellow}
              onPress={handleLogout}
            />

            <View style={styles.separator} />

            <ProfileMenuItem
              icon="delete-forever"
              title="Delete Account"
              iconColor="#ff4757"
              titleStyle={{ color: "#ff4757" }}
              onPress={handleDeleteAccount}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>eTailor v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        isVisible={showLogoutModal}
        onBackdropPress={() => setShowLogoutModal(false)}
        style={styles.modal}
        backdropOpacity={0.8}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
      >
        <View style={styles.modalContent}>
          <View style={styles.logoutIcon}>
            <MaterialIcons name="logout" size={60} color="#f39c12" />
          </View>

          <Text style={styles.modalTitle}>Logout Confirmation</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to logout? You'll need to sign in again to
            access your account.
          </Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={confirmLogout}
            >
              <Text style={styles.modalConfirmButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isVisible={showDeleteModal}
        onBackdropPress={() => setShowDeleteModal(false)}
        style={styles.modal}
        backdropOpacity={0.8}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={200}
      >
        <View style={styles.modalContent}>
          <View style={styles.deleteIcon}>
            <MaterialIcons name="delete-forever" size={60} color="#e74c3c" />
          </View>

          <Text style={styles.modalTitle}>Delete Account</Text>
          <Text style={styles.modalMessage}>
            This action cannot be undone. All your data, orders, and
            measurements will be permanently deleted.
          </Text>

          <View style={styles.confirmationInputContainer}>
            <Text style={styles.confirmationLabel}>
              Type "DELETE" to confirm:
            </Text>
            <TextInput
              style={styles.confirmationInput}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="Type DELETE here"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText("");
              }}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalDeleteButton,
                deleteConfirmText.toUpperCase() !== "DELETE" &&
                  styles.modalDeleteButtonDisabled,
              ]}
              onPress={confirmDeleteAccount}
              disabled={deleteConfirmText.toUpperCase() !== "DELETE"}
            >
              <Text
                style={[
                  styles.modalDeleteButtonText,
                  deleteConfirmText.toUpperCase() !== "DELETE" &&
                    styles.modalDeleteButtonTextDisabled,
                ]}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        isVisible={showDeleteSuccess}
        style={styles.modal}
        backdropOpacity={0.9}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={400}
        animationOutTiming={300}
      >
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={80} color="#27ae60" />
          </View>

          <Text style={styles.modalTitle}>Account Deleted</Text>
          <Text style={styles.modalMessage}>
            Your account has been successfully deleted. Thank you for using
            eTailor.
          </Text>

          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={() => {
              setShowDeleteSuccess(false);
              // Navigate to login/welcome screen
              console.log("Navigate to welcome screen");
            }}
          >
            <Text style={styles.modalConfirmButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },

  scrollView: {
    flex: 1,
  },

  // Profile Header Styles
  profileHeader: {
    backgroundColor: colors.white,
    alignItems: "center",
    paddingVertical: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalScale(20),
    ...iosShadow,
    elevation: 2,
  },

  userName: {
    ...textStyles.textSemibold18,
    color: colors.darkGray,
    marginTop: verticalScale(16),
  },

  userEmail: {
    ...textStyles.textRegular14,
    color: colors.lightGray,
    marginTop: verticalScale(4),
  },

  editProfileButton: {
    ...flexRow,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    marginTop: verticalScale(16),
  },

  editProfileText: {
    ...textStyles.textMedium14,
    color: colors.primary,
    marginLeft: horizontalScale(6),
  },

  // Menu Section Styles
  menuSection: {
    marginBottom: verticalScale(24),
  },

  sectionTitle: {
    ...textStyles.textSemibold16,
    color: colors.darkGray,
    marginLeft: horizontalScale(20),
    marginBottom: verticalScale(12),
  },

  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: horizontalScale(16),
    borderRadius: moderateScale(12),
    ...iosShadow,
    elevation: 2,
  },

  menuItem: {
    ...flexRow,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
  },

  separator: {
    height: 1,
    backgroundColor: colors.border + "20", // 20% opacity
    marginLeft: horizontalScale(64), // Align with text, accounting for icon + margin
  },

  iconContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    backgroundColor: colors.lightBg,
    ...flexCenter,
    marginRight: horizontalScale(12),
  },

  menuText: {
    ...textStyles.textMedium15,
    color: colors.darkGray,
    flex: 1,
  },

  // App Info Styles
  appInfo: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(30),
  },

  appVersion: {
    ...textStyles.textRegular12,
    color: colors.lightGray,
  },

  /* Modal Styles */
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },

  modalContent: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(30),
    alignItems: "center",
    width: screenWidth - 40,
    maxWidth: 400,
  },

  logoutIcon: {
    marginBottom: verticalScale(20),
    padding: moderateScale(15),
    borderRadius: moderateScale(50),
    backgroundColor: "#fef9e7",
  },

  deleteIcon: {
    marginBottom: verticalScale(20),
    padding: moderateScale(15),
    borderRadius: moderateScale(50),
    backgroundColor: "#ffeaea",
  },

  successIcon: {
    marginBottom: verticalScale(20),
  },

  modalTitle: {
    ...textStyles.textSemibold20,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: verticalScale(12),
  },

  modalMessage: {
    ...textStyles.textRegular15,
    color: colors.mediumGray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: verticalScale(25),
  },

  confirmationInputContainer: {
    width: "100%",
    marginBottom: verticalScale(25),
  },

  confirmationLabel: {
    ...textStyles.textMedium14,
    color: colors.darkGray,
    marginBottom: verticalScale(8),
  },

  confirmationInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: colors.darkGray,
    backgroundColor: colors.lightBg,
  },

  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: moderateScale(12),
  },

  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.lightBg,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  modalCancelButtonText: {
    ...textStyles.textMedium16,
    color: colors.mediumGray,
  },

  modalConfirmButton: {
    flex: 1,
    backgroundColor: "#f39c12",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    ...iosShadow,
    elevation: 4,
  },

  modalConfirmButtonText: {
    ...textStyles.textMedium16,
    color: colors.white,
  },

  modalDeleteButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    ...iosShadow,
    elevation: 4,
  },

  modalDeleteButtonDisabled: {
    backgroundColor: colors.lightGray,
    elevation: 0,
    shadowOpacity: 0,
  },

  modalDeleteButtonText: {
    ...textStyles.textMedium16,
    color: colors.white,
  },

  modalDeleteButtonTextDisabled: {
    color: colors.mediumGray,
  },
});

export default ProfileScreen;
