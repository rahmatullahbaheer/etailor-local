import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import textStyles, {
  flexRow,
  flexCenter,
  flexBetween,
} from "../../../../theme/styles";
import { colors } from "../../../../theme/colors";
import { Ionicons, Octicons } from "@expo/vector-icons";
import PrimaryButton from "../PrimaryButton";
import { mImages } from "../../../../assets/images";
import ModalWrapper from "../Modal/ModalWrapper";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/auth.slice";
import API from "../../../../utils/api";
import ContactUsInformation from "./ContactUsInformation";
import AccountRelatedLinks from "./AccountRelatedLinks";
import MenuHeader from "./MenuHeader";
import MenuUserInfo from "./MenuUserInfo";

const { width, height } = Dimensions.get("screen");

export default function SideBarMenu() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [themeData, setThemeData] = useState({});
  const [contactInformations, setContactInformations] = useState([]);
  const [otherLinks, setOtherLinks] = useState([]);

  // Show links based on user role
  useEffect(() => {
    const sellerLinks = [
      {
        label: "Saved ads",
        icon: mImages.heartSmall,
        tab: "NormalStack",
        screen: "SavedAds",
        checkAuth: true,
      },
      {
        label: "Add property",
        icon: mImages.plusSmall,
        tab: "NormalStack",
        screen: "AddPost",
        checkAuth: true,
      },
      {
        label: "My Properties",
        icon: mImages.messageSmall,
        tab: "NormalStack",
        screen: "MyProperties",
      },
    ];

    const serviceProviderLinks = [
      {
        label: "Saved ads",
        icon: mImages.heartSmall,
        tab: "NormalStack",
        screen: "SavedAds",
        checkAuth: true,
      },
      {
        label: "Service provider profile",
        icon: mImages.avatarSmall,
        tab: "NormalStack",
        screen: "ServiceProviderProfile",
      },
      {
        label: "Reviews",
        icon: mImages.messageSmall,
        tab: "NormalStack",
        screen: "ServiceProviderReviews",
      },
    ];

    const authenticatedLinks = [
      {
        label: "Personal information",
        icon: mImages.avatarSmall,
        tab: "NormalStack",
        screen: "PersonalInformation",
      },
      {
        label: "Public profile",
        icon: mImages.avatarSmall,
        tab: "NormalStack",
        screen: "PublicProfile",
      },
      {
        label: "Delete my account",
        icon: mImages.trash,
        tab: "NormalStack",
        screen: "DeleteAccount",
      },
      {
        label: "Change password",
        icon: mImages.avatarSmall,
        tab: "NormalStack",
        screen: "ChangePassword",
      },
    ];
    const unAuthLinks = [
      {
        label: "Saved ads",
        icon: mImages.heartSmall,
        tab: "NormalStack",
        screen: "SavedAds",
        checkAuth: true,
      },
      {
        label: "Add property",
        icon: mImages.plusSmall,
        tab: "NormalStack",
        screen: "AddPost",
        checkAuth: true,
      },
      {
        label: "Sign in",
        icon: mImages.avatarSmall,
        tab: "Auth",
        screen: "Login",
        checkAuth: true,
      },
    ];

    if (user && user?.type == "seller") {
      setOtherLinks([...sellerLinks, ...authenticatedLinks]);
    } else if (user && user?.type == "service-provider") {
      setOtherLinks([...serviceProviderLinks, ...authenticatedLinks]);
    } else {
      setOtherLinks([...unAuthLinks]);
    }
  }, [user]);

  useEffect(() => {
    const loadThemeData = async () => {
      try {
        const { data } = await API.get("/get-theme");
        setContactInformations([
          { label: data?.theme_contact, icon: mImages.callSmall, path: null },
          { label: data?.theme_email, icon: mImages.emailSmall, path: null },
          { label: data?.theme_address, icon: mImages.locSmall, path: null },
        ]);
        setThemeData(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadThemeData();
  }, []);

  // Logout handler
  const logoutHandler = () => {
    dispatch(logout());
    setOtherLinks([]);
    setisModalOpen(false);
  };

  const links = [
    {
      label: "Home",
      value: "home",
      navigate: () => {
        navigation.navigate("Tabs", {
          screen: "Home",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "Buy",
      value: "buy",
      navigate: () => {
        navigation.navigate("Tabs", {
          screen: "Buy",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "Rent",
      value: "Rent",
      navigate: () => {
        navigation.navigate("Tabs", {
          screen: "Rent",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "Projects",
      value: "projects",
      navigate: () => {
        navigation.navigate("NormalStack", {
          screen: "OurProjects",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "Interior designers",
      value: "interior-designers",
      navigate: () => {
        navigation.navigate("Tabs", {
          screen: "InteriorDesigners",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "Architects",
      value: "architects",
      navigate: () => {
        navigation.navigate("Tabs", {
          screen: "OurArchitects",
        });
        setisModalOpen(false);
      },
    },
    {
      label: "News",
      value: "blogs",
      navigate: () => {
        navigation.navigate("NormalStack", {
          screen: "OurBlogs",
        });
        setisModalOpen(false);
      },
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => setisModalOpen(true)}
      >
        <Octicons name="three-bars" size={16} color={colors.primary} />
      </TouchableOpacity>

      {/* Modal */}
      {/* <TouchableOpacity onPress={() => setisModalOpen(true)}> */}
      {/* <TouchableOpacity onPress={() => setisModalOpen(false)}> */}
      <ModalWrapper
        animationType="fade"
        visibility={isModalOpen}
        callBack={() => setisModalOpen(false)}
      >
        <ScrollView
          style={{
            ...styles.modalParrent,
            backgroundColor: colors.white,
          }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => setisModalOpen(false)}>
            <View style={styles.modalContainer}>
              <MenuHeader onClose={() => setisModalOpen(false)} />
              <MenuUserInfo
                onLoginClick={() => {
                  setisModalOpen(false);
                  navigation.navigate("Auth", {
                    screen: "Login",
                  });
                }}
                onClose={() => setisModalOpen(false)}
              />

              {/* Links start */}
              <TouchableOpacity onPress={() => setisModalOpen(false)}>
                <View style={styles.listWrapper}>
                  {links.map((link, index) => {
                    return (
                      <TouchableOpacity
                        style={{
                          height: moderateScale(38),
                          // borderWidth: 2,
                        }}
                        key={index}
                        onPress={link.navigate ? link.navigate : null}
                      >
                        <Text
                          style={{
                            ...textStyles.textRegular13,
                            color: colors.darkGray,
                          }}
                        >
                          {link.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
              {/* Links end */}
              <View
                style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }}
              ></View>
              {/* Account related links */}
              <TouchableOpacity onPress={() => setisModalOpen(false)}>
                <AccountRelatedLinks
                  data={otherLinks}
                  onPress={(link) => {
                    setisModalOpen(false);
                    link?.checkAuth && !user
                      ? navigation.navigate("Auth", {
                          screen: "Login",
                        })
                      : navigation.navigate("NormalStack", {
                          screen: link.screen,
                        });
                  }}
                  onLogout={() => logoutHandler()}
                />
              </TouchableOpacity>

              {/* Contact information */}
              <ContactUsInformation data={contactInformations} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </ModalWrapper>
      {/* </TouchableOpacity> */}
      {/* </TouchableOpacity> */}
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(5),
    backgroundColor: colors.lightBg,
    ...flexCenter,
  },

  modalParrent: {
    backgroundColor: "white",
    height: height,
    width: width - horizontalScale(30),
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(18),
    paddingVertical: verticalScale(20),
  },
  listWrapper: {
    paddingBottom: verticalScale(8),

    alignSelf: "flex-start",
  },

  msgCount: {
    width: moderateScale(19),
    height: moderateScale(19),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
    ...flexCenter,
  },

  linkRow: {
    height: moderateScale(38),
    ...flexRow,
    justifyContent: "space-between",
    gap: horizontalScale(8),
  },
});
