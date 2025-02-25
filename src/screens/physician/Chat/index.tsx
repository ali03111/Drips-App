import React, { createRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatListProps,
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
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <View style={styles.chatKeyboard}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            autoCapitalize="none"
            blurOnSubmit={true}
            value={value}
            onChangeText={(text) => setValue(text)}
            returnKeyType="done"
            multiline={true}
            placeholder="Type your message...."
            keyboardType="default"
            // onFocus={ () => _scrollToBottom()}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            onSend(value);
            setValue("");
          }}
          activeOpacity={0.8}
          style={{
            paddingVertical: 5,
            alignSelf: "flex-end",
          }}
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
  // const { item } = props.route.params;
  const dispatch = useDispatch();
  const { messages, apointmentItem } = useSelector(
    (state: RootState) => state.ChatReducer
  );
  const [messageItems, newMessages] = useState(messages);
  const { user } = useSelector((state: RootState) => state.UserReducer);
  // const [messages, setMessages] = useState([ ...DEMO ]);

  const _fetchChatDetails = () => {
    dispatch(getChatDetailsAction());
  };

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 1000);
    return () => {
      dispatch(
        updateChatStates({
          messages: [],
        })
      );
    };
  }, [messageItems]);

  const onSend = (message: string) => {
    let _data = {
      message_to: apointmentItem.doctor_id,
      message_from: user.user_id,
      message,
      consultant_id: apointmentItem.id,
    };
    dispatch(sendChatMessage(_data));
    newMessages([...messageItems, { ..._data, created_at: new Date() }]);
    // setInterval(() => {
    //   dispatch(getChatDetailsAction({ id: apointmentItem.id }));
    // }, 1000);
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 4000);
  };
  let listRef = createRef<FlatList>();

  useEffect(() => {
    const interval = setInterval(() => {
      getChatData();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getChatData = async () => {
    const response = await messageApi(apointmentItem.id);

    if (response.code === "200" || response.code === 200) {
      // yield put( resetUnread( id ) );
      newMessages(response.data);
      listRef.current?.scrollToEnd({ animated: true });
      // dispatch(
      //   updateChatStates({
      //     apointmentItem,
      //     appointmentId: apointmentItem.id,
      //     messages: response.data,
      //   })
      // );
    } else {
      errorHandler(response);
    }
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title={"Chat"} backBtn={true} />
        <View style={styles.container}>
          <View style={{ flex: 1 }}></View>
          <FlatList
            ref={listRef}
            style={{ paddingHorizontal: 20 }}
            data={messageItems}
            extraData={messageItems}
            renderItem={(props) => <ChatBubble {...props} />}
            onEndReachedThreshold={0}
            showsVerticalScrollIndicator={false}
            // inverted
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
  msgView: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 12,
    borderRadius: 8,
    maxWidth: "80%",
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
    fontFamily: FONTS.PoppinsRegular,
    borderRadius: 30,
    borderWidth: 0.5,
    textTransform: "capitalize",
    borderColor: "gray",
    backgroundColor: "#F9F9FC",
    justifyContent: "center",
    maxHeight: 150,
  },
  input: {
    fontFamily: FONTS.PoppinsRegular,
    padding: 0,
    color: "black",
  },
});

export default Chat;

const DEMO = [
  {
    id: 1,
    user_id: 2,
    message: "EveryThing is fine",
    type: "text",
    created_at: new Date().getTime(),
  },
  {
    id: 2,
    user_id: 1,
    message: "I am doing great how are you today",
    type: "text",
    created_at: new Date().getTime(),
  },
  {
    id: 3,
    user_id: 1,
    message: "Hello Castro",
    type: "text",
    created_at: new Date().getTime(),
  },
  {
    id: 4,
    user_id: 2,
    message: "Hello",
    type: "text",
    created_at: new Date().getTime(),
  },
];
