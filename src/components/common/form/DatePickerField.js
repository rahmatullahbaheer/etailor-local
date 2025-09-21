import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/responsive/metrices";
import { colors } from "../../../../theme/colors";
import textStyles, { flexBetween } from "../../../../theme/styles";
import { mImages } from "../../../../assets/images";
import ErrorMessage from "../ErrorMessage";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("screen");

export default function DatePickerField(props) {
  const { placeholder, error, onSelectDate } = props;
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onSelectDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const formateDate = (date) => {
    if (date) {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } else {
      return;
    }
  };

  return (
    <>
      <View style={{ marginBottom: verticalScale(8) }}>
        <TouchableOpacity
          onPress={() => showDatepicker()}
          style={{
            ...styles.inputWrapper,
            borderColor: error ? colors.danger : "transparent",
          }}
        >
          <Image
            source={date ? mImages.calendarBlack : mImages.calendarGray}
            style={{ width: moderateScale(17), height: moderateScale(17) }}
            resizeMode="contain"
          />
          <Text style={{ ...styles.input, color: date ? colors.textDark : colors.textLightGray }}>
            {date ? formateDate(date) : placeholder}
          </Text>
        </TouchableOpacity>
        {error && <ErrorMessage message={error} />}
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date ? date : new Date()}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    backgroundColor: colors.lightBackground,
    marginBottom: verticalScale(5),
    paddingHorizontal: horizontalScale(16),
    ...flexBetween,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    // height: "100%",
    marginLeft: horizontalScale(10),
    backgroundColor: "transparent",
    ...textStyles.textRegular13,
  },
});
