import moment from "moment";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Typography } from "../../../components/atoms";
import { COLORS } from "../../../constants";
import { RootState } from "../../../store/reducers";

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
  const { index, item } = props;
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const { message_from, message, created_at = null } = item;

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
            bottom: -15,
            right: 0,
          }}
        >
          {created_at ? moment(created_at).fromNow() : "Sending..."}
        </Typography>
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
            bottom: -15,
            left: 5,
          }}
        >
          {created_at && convertToCustomTimeFormat(created_at)}
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
