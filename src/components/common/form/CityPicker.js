import React, { useState, useEffect, memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { useSelector } from "react-redux";
import { colors } from "../../../../theme/colors";
import { flexBetween, flexRow } from "../../../../theme/styles";
import textStyles from "../../../../theme/styles";
import ErrorMessage from "../ErrorMessage";

const { width, height } = Dimensions.get("screen");

const CityPicker = ({
  heading,
  callBack,
  data,
  value,
  placeholder,
  style,
  wrapperStyle,
  error,
  icon,
  label,
  isMulti,
}) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [itemsList, setItemsList] = useState([]);
  const [searchValue, setSearchValue] = useState();

  const searchItem = (search) => {
    if (Array.isArray(data)) {
      if (search == null || search?.length < 1) {
        setItemsList(data);
      } else {
        const filteredData = data?.filter((item) => {
          let temp = item?.label?.toUpperCase();
          const n = temp?.search(search?.toUpperCase());
          return n !== -1;
        });
        setItemsList(filteredData);
      }
    }
  };

  const handleSelectItem = async (element) => {
    if (isMulti) {
      const exist = value?.find((i) => i?.value == element?.value);
      if (!exist) {
        await callBack([...value, element]);
        setisModalOpen(false);
      } else {
        callBack(value?.filter((i) => i?.value !== element?.value));
      }
    } else {
      callBack([element]);
      setisModalOpen(false);
    }
  };

  useEffect(() => {
    setItemsList(data);
  }, [data]);

  return (
    <View style={{ ...styles.container, ...style }}>
      <>
        <View style={{ width: "100%" }}>
          {label && (
            <Text
              style={{
                ...textStyles.textMedium14,
                color: colors.darkGray,
                marginBottom: 7,
              }}
            >
              {label}
            </Text>
          )}

          <TouchableOpacity
            style={{
              ...styles.btnwrapper,
              ...wrapperStyle,
              borderColor: error ? "red" : "transparent",
            }}
            activeOpacity={0.8}
            onPress={() => setisModalOpen(true)}
          >
            <View style={{ ...flexRow, alignItems: "center" }}>
              {icon && (
                <Image
                  source={icon}
                  style={{
                    width: moderateScale(18),
                    height: moderateScale(18),
                    marginRight: horizontalScale(10),
                  }}
                />
              )}

              {isMulti ? (
                <View
                  style={{
                    ...flexRow,
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {value?.map((item, index) => (
                    <View style={styles.selectedItem} key={index}>
                      <Text
                        style={{ ...styles.valueText, color: colors.black }}
                      >
                        {item?.label}
                      </Text>
                      <TouchableOpacity
                        style={styles.cross}
                        onPress={() => {
                          callBack(
                            value?.filter((i) => i?.value != item?.value)
                          );
                        }}
                      >
                        <MaterialIcons name="cancel" size={16} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text
                  style={{
                    ...styles.valueText,
                    color: value?.label ? "#090909" : "#9B9B9B",
                  }}
                >
                  {value[0]?.label ? value[0]?.label : null}
                </Text>
              )}
              {value?.length == 0 ? (
                <Text
                  style={{
                    ...styles.valueText,
                    color: value?.label ? "#090909" : "#9B9B9B",
                  }}
                >
                  {placeholder}
                </Text>
              ) : null}
            </View>

            <Entypo
              name="chevron-small-down"
              size={moderateScale(24)}
              color={colors.darkGray}
            />
          </TouchableOpacity>
          {error && <ErrorMessage message={error} />}
        </View>
      </>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalOpen}
        onRequestClose={() => {
          setisModalOpen(false);
        }}
      >
        <View style={{ ...styles.modalParrent, backgroundColor: "white" }}>
          {/* Header start */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={() => setisModalOpen(false)}>
              <AntDesign
                name="arrowleft"
                size={moderateScale(20)}
                color={"#131A22"}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Search1"
              style={styles.input}
              placeholderTextColor={"#ABABAB"}
              value={searchValue}
              onChangeText={(text) => {
                setSearchValue(text);
                searchItem(text);
              }}
            />
          </View>
          {/* Header end */}
          <ScrollView
            style={styles.scrollview}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.headingText}>{heading}</Text>
            {Array.isArray(itemsList) &&
              itemsList?.map((element, index) => {
                const active = value?.includes(element);
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectItem(element)}
                    style={styles.itemWrapper}
                    key={index + 1}
                  >
                    <Text
                      style={{
                        ...textStyles.textRegular14,
                        color: active ? colors.primary : "#474747",
                      }}
                    >
                      {element?.label}
                    </Text>

                    {active ? (
                      <Feather
                        name="check-circle"
                        size={18}
                        color={colors.primary}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            <View style={{ height: 200 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  btnwrapper: {
    backgroundColor: colors.lightBg,
    minHeight: verticalScale(50),
    borderRadius: moderateScale(5),
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(15),
    justifyContent: "space-between",
    marginBottom: verticalScale(5),
    borderWidth: 1,
  },
  modalParrent: {
    backgroundColor: "white",
    height: height,
    width: width,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(20),
  },
  valueText: {
    ...textStyles.textRegular13,
    color: colors.textDark,
  },
  headerWrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    gap: horizontalScale(5),
  },
  headingText: {
    ...textStyles.textRegular16,
    marginBottom: verticalScale(5),
    color: "#090909",
  },
  input: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: moderateScale(10),
    paddingHorizontal: horizontalScale(14),
    marginLeft: horizontalScale(10),
    backgroundColor: "#F6F6F6",
    color: "#090909",
    ...textStyles.textRegular13,
  },
  btnContainer: {
    // marginTop: verticalScale(15),
    alignSelf: "stretch",
  },
  scrollview: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  itemWrapper: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: verticalScale(13),
    paddingHorizontal: horizontalScale(2),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedItem: {
    backgroundColor: "lightgray",
    borderRadius: moderateScale(5),
    paddingVertical: 5,
    paddingHorizontal: 9,
    position: "relative",
  },
  cross: {
    position: "absolute",
    top: -6,
    right: -5,
  },
});

export default memo(CityPicker);
