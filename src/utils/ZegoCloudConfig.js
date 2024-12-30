import React from "react";
import * as ZIM from "zego-zim-react-native";
import * as ZPNs from "zego-zpns-react-native";
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoSendCallInvitationButton,
  ZegoMenuBarButtonName,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
  ZegoCountdownLabel,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { navigationRef } from "../navigation/RootNavigation";
import { string } from "yup";
export const ZegoConfig = {
  APP_ID: 948570941, //,1999767418,
  APP_SIGN: "ea8c98871e8e25967f22776259907f966df131dd2be8f08a939d968293c90ce0", //"9e851c5ecfe7370daf0321c0a191ebad7268ab90f04d80d8fbff0312f5a26dfa",
  appID: 948570941, //,1999767418,
  appSign: "ea8c98871e8e25967f22776259907f966df131dd2be8f08a939d968293c90ce0", //"9e851c5ecfe7370daf0321c0a191ebad7268ab90f04d80d8fbff0312f5a26dfa",
};

export const initZegoCallConfig = ({ userID, userName, callType }) => {
  // LoginScreen
  ZegoUIKitPrebuiltCallService.init(
    ZegoConfig.APP_ID,
    ZegoConfig.APP_SIGN,
    userID.toString(),
    userName,
    [ZIM, ZPNs],
    {
      //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
      ringtoneConfig: {
        incomingCallFileName: "zego_incoming.mp3",
        outgoingCallFileName: "zego_outgoing.mp3",
      },
      ///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
      requireConfig: (data) => {
        const callConfig =
          callType === data.type
            ? ONE_ON_ONE_VIDEO_CALL_CONFIG
            : ONE_ON_ONE_VOICE_CALL_CONFIG;
        return callConfig;
      },
      notifyWhenAppRunningInBackgroundOrQuit: true,
      isIOSSandboxEnvironment: true,
      androidNotificationConfig: {
        channelID: "ZegoUIKit",
        channelName: "ZegoUIKit",
      },
    }
  );
};

export const onUserLogout = async () => {
  return ZegoUIKitPrebuiltCallService.uninit();
};
export const onUserLogin = async ({ userID, userName, userType }) => {
  console.log("ZegoUIKitPrebuiltCallService ===> ", userName);
  return ZegoUIKitPrebuiltCallService.init(
    ZegoConfig.APP_ID,
    ZegoConfig.APP_SIGN,
    userID.toString(),
    userName.toString(),
    [ZIM, ZPNs],
    {
      ringtoneConfig: {
        incomingCallFileName: "zego_incoming.mp3",
        outgoingCallFileName: "zego_outgoing.mp3",
      },
      notifyWhenAppRunningInBackgroundOrQuit: true,
      isIOSSandboxEnvironment: true,
      androidNotificationConfig: {
        channelID: "DripsCallInvitation",
        channelName: "DripsCallInvitation",
      },
      requireConfig: (data) => {
        return {
          onHangUp: (duration) => {
            alert("Call Disconnected");
            console.log("########CallWithInvitation onHangUp", duration);
            console.log("########CallWithInvitation onHangUp", navigationRef);
            if (navigationRef) {
              navigationRef.goBack();
            }
          },
          foregroundBuilder: () => (
            <ZegoCountdownLabel
              maxDuration={60}
              onCountdownFinished={() => {
                console.log("Countdown finished!!");
                ZegoUIKitPrebuiltCallService.hangUp(true);
              }}
            />
          ),
          timingConfig: {
            enableTiming: true,
            onDurationUpdate: (duration) => {
              /* console.log(
                "########CallWithInvitation onDurationUpdate",
                duration
              ); */
              if (duration === 10 * 60) {
                ZegoUIKitPrebuiltCallService.hangUp(true);
              }
            },
          },
          topMenuBarConfig: {
            buttons: [ZegoMenuBarButtonName.minimizingButton],
          },
          onWindowMinimized: () => {
            console.log("[Demo]CallInvitation onWindowMinimized");
            navigationRef && navigationRef.goBack();
          },
          onWindowMaximized: () => {
            console.log("[Demo]CallInvitation onWindowMaximized");
            navigationRef &&
              navigationRef.navigate("ZegoUIKitPrebuiltCallInCallScreen");
          },
        };
      },
    }
  );
};
