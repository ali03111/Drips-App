import React, { createRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS } from "../../../constants";
import SafeAreaContainer from "../../../containers/SafeAreaContainer";
import { InnerHeader } from "../../../components/atoms";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getChatDetailsAction,
  sendChatMessage,
  updateChatStates,
} from "../../../store/actions/ChatActions";
import { RootState } from "../../../store/reducers";
import ChatBubble from "./ChatBubble";
import { errorHandler } from "../../../utils/utils";
import { messageApi } from "../../../store/services/Services";

const ChatConsole = ({ onSend }) => {
  const [value, setValue] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.chatKeyboard}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => setValue(text)}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.darkGray}
            multiline
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (value.trim()) {
              onSend(value);
              setValue("");
            }
          }}
          activeOpacity={0.8}
          style={{ paddingVertical: 5, alignSelf: "flex-end" }}
        >
          <Icon
            name="send"
            size={30}
            color={COLORS.primary}
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const Chat = (props) => {
  const dispatch = useDispatch();
  const { apointmentItem, messages: storedMessages } = useSelector(
    (state: RootState) => state.ChatReducer
  );
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const [messageItems, setMessageItems] = useState(storedMessages || []);
  const listRef = createRef<FlatList>();

  // Sync local state with Redux state
  useEffect(() => {
    setMessageItems(storedMessages);
  }, [storedMessages]);

  // Fetch chat data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to the end when new messages are added
  useEffect(() => {
    if (messageItems.length > 0) {
      // listRef.current?.scrollToEnd({ animated: true });
    }
  }, [messageItems]);

  const fetchChatData = async () => {
    try {
      const response = await messageApi(apointmentItem.id);
      if (response.code === 200 || response.code === "200") {
        // Avoid overwriting the state if the data is the same
        if (JSON.stringify(response.data) !== JSON.stringify(messageItems)) {
          setMessageItems([...response.data]);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const onSend = async (message) => {
    const newMessage = {
      message_to: apointmentItem.doctor_id,
      message_from: user.user_id,
      message,
      consultant_id: apointmentItem.id,
      created_at: new Date(),
    };

    // Optimistically update the UI
    setMessageItems((prevMessages) => [...prevMessages, newMessage]);

    // Send the message to the server
    dispatch(sendChatMessage(newMessage));

    // Fetch updated messages after sending
    await fetchChatData();
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Chat" backBtn={true} />
        <View style={styles.container}>
          <FlatList
            ref={listRef}
            data={messageItems}
            renderItem={(props) => <ChatBubble {...props} />}
            keyExtractor={(item, index) => index.toString()}
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
          />
          <ChatConsole onSend={onSend} />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  chatKeyboard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputView: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "gray",
    backgroundColor: "#F9F9FC",
    justifyContent: "center",
    maxHeight: 150,
  },
  input: {
    fontFamily: FONTS.PoppinsRegular,
    color: "black",
    padding: 0,
  },
});

export default Chat;
