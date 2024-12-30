// App.js
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { RootState } from "../../store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { onBack } from "../../navigation/RootNavigation";
import { showToast } from "../../store/actions/AppActions";
import { ZegoConfig } from "../../utils/ZegoCloudConfig";
const VoiceCall = (props) => {
  const { item }: { item: any } = props.route.params;
  const { id: consultation_id, doctor_id, patient_id } = item;

  const { user } = useSelector((state: RootState) => state.UserReducer);
  const dispatch = useDispatch();
  const { userType } = useSelector((state: any) => state.AppReducer);

  const { apointmentDetails } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  const id = userType === 1 ? patient_id : doctor_id;
  const userId = `user-${id}`;
  const callID = `consultation-${consultation_id}`;
  let otherConfigs: any = ONE_ON_ONE_VOICE_CALL_CONFIG;
  if (item.callType && item.callType.toLowerCase() === "video") {
    otherConfigs = ONE_ON_ONE_VIDEO_CALL_CONFIG;
  }
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={ZegoConfig.APP_ID}
        appSign={ZegoConfig.APP_SIGN}
        userID={userId} // userID can be something like a phone number or the user id on your own user system.
        userName={user.name}
        callID={callID} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...otherConfigs,
          onOnlySelfInRoom: () => {
            onBack();
            dispatch(showToast("Call disconnected!"));
          },
          onHangUp: () => {
            dispatch(showToast("Call disconnected!"));
            onBack();
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});

export default VoiceCall;
