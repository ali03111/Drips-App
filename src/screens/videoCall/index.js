import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Daily, { DailyMediaView } from "@daily-co/react-native-daily-js";
import { useDispatch, useSelector } from "react-redux";
import { onBack } from "../../navigation/RootNavigation";
import { showToast } from "../../store/actions/AppActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const VideoCall = ({ route }) => {
  const { item } = route.params; // callType: "audio" or "video"
  const { consultation_id, doctor_id, patient_id, callType, meeting_url } =
    item;
  console.log(
    "meeting_urlmeeting_urlmeeting_urlmeeting_urlmeeting_url",
    meeting_url
  );
  const userType = useSelector((state) => state.AppReducer.userType);
  const id = userType === 1 ? patient_id : doctor_id;
  const callID = `consultation-${consultation_id}`;
  const dispatch = useDispatch();

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

  useEffect(() => {
    let callObject;

    const initCall = async () => {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;
      // "https://c.daily.co/call-machine/versioned/0.75.2/static/call-machine-object-bundle.js"
      callObject = Daily.createCallObject({
        // dailyConfig: {},
        //  "https://c.daily.co/call-machine/versioned/0.75.2/static/call-machine-object-bundle.js",
        videoSource: true,
      });
      callObjectRef.current = callObject;

      // Set up event listeners
      const updateParticipants = () => {
        setParticipants(Object.values(callObject.participants()));
      };

      callObject.on("participant-joined", updateParticipants);
      callObject.on("participant-updated", updateParticipants);
      callObject.on("participant-left", updateParticipants);

      callObject.on("camera-error", (error) => {
        console.error("Camera error:", error);
        dispatch(showToast(`Camera error: ${error.message}`));
      });

      callObject.on("microphone-error", (error) => {
        console.error("Microphone error:", error);
        dispatch(showToast(`Microphone error: ${error.message}`));
      });

      try {
        await callObject.startCamera({
          subscribeToTracksAutomatically: true,
        });

        // Ensure audio/video is set correctly before joining
        await callObject.setLocalAudio(true);
        await callObject.setLocalVideo(callType === "Video");
        await callObject.load();
        await callObject.join({
          url: meeting_url,
          subscribeToTracksAutomatically: true,
        });
      } catch (error) {
        console.error("Error joining call:", error);
        dispatch(showToast(`Error joining call: ${error}`));
      }
    };

    initCall();

    return () => {
      if (callObject) {
        callObject.leave();
        callObject.destroy();
        callObjectRef.current = null;
      }
    };
  }, []);

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

  return (
    <View style={styles.container}>
      {participants.map((participant) => (
        <DailyMediaView
          key={participant.user_id}
          videoTrack={callType === "Video" ? participant.videoTrack : null}
          audioTrack={participant.audioTrack}
          mirror={participant.local}
          zOrder={participant.local ? 1 : 0}
          style={[styles.mediaView, callType === "Audio" && styles.audioView]}
        />
      ))}

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Icon
            name={isMuted ? "microphone-off" : "microphone"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        {callType === "Video" && (
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
        )}
        <TouchableOpacity
          onPress={handleHangUp}
          style={[styles.button, styles.hangupButton]}
        >
          <Icon name="phone-hangup" size={24} color="#fff" />
        </TouchableOpacity>
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
    bottom: 20,
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
});

export default VideoCall;
