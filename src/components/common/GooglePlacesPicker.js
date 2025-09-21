import React, { useRef } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/native";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "../../../utils/responsive/metrices";
import textStyles from "../../../theme/styles";
import { colors } from "../../../theme/colors";
import { GOOGLE_MAPS_APIKEY } from "../../../utils/constants";

const GooglePlacesPicker = ({ callback, label, error }) => {
  const ref = useRef();

  return (
    <View style={{ marginBottom: verticalScale(20) }}>
      {label && (
        <Text style={{ ...textStyles.textMedium14, color: colors.darkGray }}>
          {label}
        </Text>
      )}
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={"Search Location"}
        debounce={0}
        fetchDetails={true}
        filterReverseGeocodingByTypes={[
          "locality",
          "administrative_area_level_1",
          "administrative_area_level_3",
        ]}
        currentLocation={false}
        currentLocationLabel=" "
        returnKeyType={"default"}
        textInputProps={{
          multiline: true,
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
        onPress={(data, details = null) => {
          callback(details?.formatted_address, details?.geometry?.location);
        }}
        onFail={(error) => console.error(error)}
        requestUrl={{
          url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
          useOnPlatform: "web",
        }}
        listEmptyComponent={() => (
          <View style={{ flex: 1 }}>
            <Text>No results were found</Text>
          </View>
        )}
        styles={{
          textInputContainer: {
            backgroundColor: colors.lightBg,
            minHeight: moderateScale(50),
            borderRadius: 5,
            paddingHorizontal: horizontalScale(6),
            marginTop: verticalScale(8),
            borderWidth: 1,
            borderColor: error ? "red" : "transparent",
          },
          textInput: {
            ...textStyles.textRegular14,
            height: "100%",
            backgroundColor: "transparent",
          },
        }}
      />
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default GooglePlacesPicker;
