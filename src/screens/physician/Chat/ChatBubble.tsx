import moment, { invalid } from "moment";
import * as React from "react";
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "../../../components/atoms";
import { COLORS } from "../../../constants";
import { RootState } from "../../../store/reducers";
// import { logger } from "react-native-logs";
// import { format, utcToZonedTime } from "date-fns-tz";

interface ChatBubbleProps {
  item: any;
  index: number;
}

//For Time Format Convert Function
function convertToCustomTimeFormat(isoDate: Date) {
  const date = new Date(isoDate);

  // Subtract 5 hours
  date.setUTCHours(date.getUTCHours() - 7);

  // Extract hours and minutes
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Determine if it's A.M. or P.M.
  const amOrPm = hours < 12 ? "P.M." : "A.M.";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Ensure that both hours and minutes have two digits
  const formattedTime = `${formattedHours}:${String(minutes).padStart(
    2,
    "0"
  )} ${amOrPm}`;

  return formattedTime;
}

const ChatBubble = (props: ChatBubbleProps) => {
  function convertToLocalTimeAndroid(utcDateStr) {
    console.log("Input date string:", utcDateStr);

    try {
      // Convert the input string to a format that Date can parse
      const formattedDateStr = utcDateStr.replace(" ", "T") + "Z"; // Convert to ISO 8601 format
      const utcDate = new Date(formattedDateStr);
      console.log("Parsed UTC date:", utcDate);

      if (isNaN(utcDate.getTime())) {
        console.log("Parsed date is invalid:", utcDate);
        return "Invalid Date";
      }

      // Convert UTC time to local time zone
      const localDate = new Date(
        utcDate.toLocaleString("en-US", { timeZone: "UTC" })
      );
      console.log("Local date:", localDate);

      // Manually format the time without seconds
      const hours = localDate.getHours(); // Use getHours() for local time
      const minutes = localDate.getMinutes(); // Use getMinutes() for local time
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const localTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

      console.log("Formatted local time:", localTime);

      return localTime;
    } catch (error) {
      console.log("Error in convertToLocalTime:", error);
      return "Invalid Date";
    }
  }

  const { index, item } = props;
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const { message_from, message, created_at = null } = item;
  console.log(
    "slkvbklsblvkbsklvbksdbvsd",
    convertToLocalTimeAndroid(created_at.toString()),
    created_at
  );
  if (message_from === user.user_id) {
    return (
      <View
        key={index}
        style={[
          styles.msgView,
          {
            borderBottomRightRadius: 0,
            backgroundColor: COLORS.primary,
            alignSelf: "flex-end",
          },
        ]}
      >
        <Typography color="#fff">{message}</Typography>
        <Typography
          textType="light"
          size={10}
          color={COLORS.darkGray}
          style={{
            position: "absolute",
            bottom: -16,
            right: 0,
          }}
        >
          {convertToLocalTimeAndroid(created_at) != "Invalid Date"
            ? convertToLocalTimeAndroid(created_at)
            : "Sending..."}
        </Typography>
        {/* <Typography
          textType="light"
          size={10}
          color={COLORS.darkGray}
          style={{
            position: "absolute",
            bottom: -15,
            right: 0,
          }}
        >
          {(Platform.OS == "ios"
            ? convertToLocalTime(created_at)
            : convertToLocalTimeAndroid(created_at)) != "Invalid Date"
            ? Platform.OS == "ios"
              ? convertToLocalTime(created_at)
              : convertToLocalTimeAndroid(created_at)
            : "Sending..."}
        </Typography> */}
      </View>
    );
  } else {
    return (
      <View
        key={index}
        style={[
          styles.msgView,
          {
            borderBottomLeftRadius: 0,
            backgroundColor: "#F9F9FC",
            alignSelf: "flex-start",
          },
        ]}
      >
        <Typography color="#1D2733">{message}</Typography>
        <Typography
          textType="light"
          size={10}
          color={COLORS.darkGray}
          style={{
            position: "absolute",
            bottom: -16,
            left: 5,
          }}
        >
          {convertToLocalTimeAndroid(created_at) != "Invalid Date"
            ? convertToLocalTimeAndroid(created_at)
            : "Sending..."}
        </Typography>
      </View>
    );
  }
};

export default ChatBubble;

const styles = StyleSheet.create({
  container: {},
  msgView: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 12,
    borderRadius: 8,
    maxWidth: "80%",
  },
});
