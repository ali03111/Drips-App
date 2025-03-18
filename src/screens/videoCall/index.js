import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
  Alert,
} from "react-native";
import Daily, { DailyMediaView } from "@daily-co/react-native-daily-js";
import { useDispatch, useSelector } from "react-redux";
import { onBack } from "../../navigation/RootNavigation";
import { showToast } from "../../store/actions/AppActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import { COLORS } from "../../constants";
import { hp, wp } from "../../utils/responsive";

const VideoCall = ({ route }) => {
  const { item } = route.params; // callType: "audio" or "video"
  const { consultation_id, doctor_id, patient_id, callType, meeting_url } =
    item;
  console.log("meeting_urlmeeting_urlmeeting_urlmeeting_urlmeeting_url", item);
  const userType = useSelector((state) => state.AppReducer.userType);
  const id = userType === 1 ? patient_id : doctor_id;
  const callID = `consultation-${consultation_id}`;
  const dispatch = useDispatch();

  console.log("userTypeuserTypeuserTypeuserTypeuserTypeuserType", userType);

  const callObjectRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === "Video");

  // Request Permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        const hasPermissions =
          granted["android.permission.CAMERA"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED;

        if (!hasPermissions) {
          dispatch(
            showToast(
              "Permissions denied! Please enable camera and microphone."
            )
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true;
  };

  // useEffect(() => {
  //   let callObject;

  //   const initCall = async () => {
  //     const hasPermissions = await requestPermissions();
  //     if (!hasPermissions) return;
  //     // "https://c.daily.co/call-machine/versioned/0.75.2/static/call-machine-object-bundle.js"

  //     console.log(
  //       "Loading Daily.co bundle from:",
  //       "https://c.daily.co/call-machine/versioned/0.75.2/static/call-machine-object-bundle.js"
  //     );

  //     callObject = Daily.createCallObject({
  //       // dailyConfig: {},
  //       //  "https://c.daily.co/call-machine/versioned/0.75.2/static/call-machine-object-bundle.js",
  //       videoSource: true,
  //     });
  //     callObjectRef.current = callObject;

  //     // Set up event listeners
  //     const updateParticipants = () => {
  //       setParticipants(Object.values(callObject.participants()));
  //     };

  //     callObject.on("participant-joined", updateParticipants);
  //     callObject.on("participant-updated", updateParticipants);
  //     callObject.on("participant-left", updateParticipants);

  //     callObject.on("camera-error", (error) => {
  //       console.error("Camera error:", error);
  //       // dispatch(showToast(`Camera error: ${error.message}`));
  //     });

  //     callObject.on("microphone-error", (error) => {
  //       console.error("Microphone error:", error);
  //       // dispatch(showToast(`Microphone error: ${error.message}`));
  //     });

  //     try {
  //       await callObject.startCamera({
  //         subscribeToTracksAutomatically: true,
  //       });

  //       // Ensure audio/video is set correctly before joining
  //       await callObject.setLocalAudio(true);
  //       await callObject.setLocalVideo(callType === "Video");
  //       await callObject.load();
  //       await callObject.join({
  //         url: meeting_url,
  //         subscribeToTracksAutomatically: true,
  //       });
  //     } catch (error) {
  //       console.error("Error joining call:", error);
  //       // dispatch(showToast(`Error joining call: ${error}`));
  //     }
  //   };

  //   initCall();

  //   return () => {
  //     if (callObject) {
  //       callObject.leave();
  //       callObject.destroy();
  //       callObjectRef.current = null;
  //     }
  //   };
  // }, []);

  const toggleMute = () => {
    if (callObjectRef.current) {
      const newState = !isMuted;
      setIsMuted(newState);
      callObjectRef.current.setLocalAudio(!newState);
    }
  };

  const toggleVideo = () => {
    if (callObjectRef.current) {
      const newState = !isVideoOn;
      setIsVideoOn(newState);
      callObjectRef.current.setLocalVideo(newState);
    }
  };

  const switchCamera = () => {
    callObjectRef.current?.cycleCamera();
  };

  const handleHangUp = () => {
    if (callObjectRef.current) {
      callObjectRef.current.leave();
      callObjectRef.current.destroy();
      dispatch(showToast("Call disconnected!"));
      onBack();
    }
  };

  const webviewRef = useRef(null);

  console.log(
    "sdlkbvlkasdbl;vbsdlvbdsbvo;wdb;vldsbl;ewnds",
    `https://webvortech.com/drips/custom-portal/api/patient/meeting/${item?.id}`
  );

  const injectedJS = `
  (function() {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream)
=> {
          window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, message: "Microphone access granted" }));
      })
      .catch((error) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, message: error.message }));
      });
  })();
`;
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{
          uri:
            // userType == 1
            //   ? `https://webvortech.com/drips/custom-portal/api/patient/meeting/1005`
            //   : `https://webvortech.com/drips/custom-portal/api/physician/meeting/1005`,
            userType == 1
              ? `https://webvortech.com/drips/custom-portal/api/patient/meeting/${item?.id}`
              : `https://webvortech.com/drips/custom-portal/api/physician/meeting/${item?.id}`,
        }}
        // javaScriptEnabled={true}
        // domStorageEnabled={true}
        // originWhitelist={["*"]} // Allow all URLs
        // injectedJavaScript={injectedJS}
        // // injectedJavaScript={`
        // //   (function() {
        // //     window.postMessage = function(data) {
        // //       window.ReactNativeWebView.postMessage(data);
        // //     };
        // //   })();
        // // `}
        // style={styles.webview}
        // onMessage={(event) => {
        //   console.log("Received message:", event);
        // }}
        // onLoadStart={() => webviewRef.current?.clearCache(true)}
        // mediaPlaybackRequiresUserAction={true} // Important for auto-playing media
        // allowsInlineMediaPlayback={true} // Required for iOS
        // onError={(syntheticEvent) => {
        //   console.log("WebView error:", syntheticEvent);
        //   // const { nativeEvent } = syntheticEvent;
        // }}

        javaScriptEnabled={true} // Ensure JavaScript is enabled
        mediaPlaybackRequiresUserAction={false} // Allow automatic mic access (some browsers require interaction)
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          Alert.alert("Mic Permission", data.message);
          // console.log("Mic Permission Response:", data);
        }}
      />
      {/* {participants.length > 0 && (
        <DailyMediaView
          key={participants[0].user_id}
          videoTrack={callType === "Video" ? participants[0].videoTrack : null}
          audioTrack={participants[0].audioTrack}
          mirror={participants[0].local}
          zOrder={participants[0].local ? 1 : 0}
          style={[styles.mediaView, callType === "Audio" && styles.audioView]}
        />
      )} */}
      {/* {participants.map((participant) => (
      <DailyMediaView
        key={participants[0].user_id}
        videoTrack={callType === "Video" ? participants[0].videoTrack : null}
        audioTrack={participants[0].audioTrack}
        mirror={participants[0].local}
        zOrder={participants[0].local ? 1 : 0}
        style={[styles.mediaView, callType === "Audio" && styles.audioView]}
      />
      ))} */}

      <View style={styles.controls}>
        {/* <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Icon
            name={isMuted ? "microphone-off" : "microphone"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity> */}
        {/* {callType === "Video" && (
          <>
            <TouchableOpacity onPress={toggleVideo} style={styles.button}>
              <Icon
                name={isVideoOn ? "video" : "video-off"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={switchCamera} style={styles.button}>
              <Icon name="camera-switch" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )} */}
        {/* <TouchableOpacity
          style={{
            ...styles.footerButton,
            width: wp("90"),
            marginTop: hp("5"),
          }}
          onPress={() => handleHangUp()}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          onPress={handleHangUp}
          style={[styles.button, styles.hangupButton]}
        >
          <Icon name="phone-hangup" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mediaView: {
    flex: 1,
    backgroundColor: "#333",
  },
  audioView: {
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 50,
  },
  hangupButton: {
    backgroundColor: "#ff0000",
  },
  webview: {
    flex: 1,
  },
  footerButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },
});

export default VideoCall;
