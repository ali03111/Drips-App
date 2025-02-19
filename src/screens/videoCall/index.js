import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Daily, { DailyMediaView } from "@daily-co/react-native-daily-js";
import { useDispatch, useSelector } from "react-redux";
import { onBack } from "../../navigation/RootNavigation";
import { showToast } from "../../store/actions/AppActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CallScreen = ({ route }) => {
  const { item, callType } = route.params; // callType: "audio" or "video"
  const { id: consultation_id, doctor_id, patient_id } = item;

  const user = useSelector((state) => state.UserReducer.user);
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AppReducer.userType);

  const id = userType === 1 ? patient_id : doctor_id;
  const callID = `consultation-${consultation_id}`;

  const callObjectRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === "video");

  // Request Permissions
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          granted["android.permission.CAMERA"] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted["android.permission.RECORD_AUDIO"] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          dispatch(
            showToast(
              "Permissions denied! Please enable camera and microphone."
            )
          );
          return false;
        }
      } catch (err) {
        console.warn("Permission error:", err);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const initCall = async () => {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      if (!callObjectRef.current) {
        callObjectRef.current = Daily.createCallObject();
      }

      const call = callObjectRef.current;
      call.join({ url: item?.meeting_url });

      const updateParticipants = () => {
        const participantsList = Object.values(call.participants());
        setParticipants(participantsList);
      };

      call.on("participant-joined", updateParticipants);
      call.on("participant-updated", updateParticipants);
      call.on("participant-left", updateParticipants);

      return () => {
        if (callObjectRef.current) {
          callObjectRef.current.leave();
          callObjectRef.current.destroy();
          callObjectRef.current = null;
        }
      };
    };

    initCall();
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    callObjectRef.current?.setLocalAudio(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    callObjectRef.current?.setLocalVideo(!isVideoOn);
  };

  const switchCamera = () => {
    callObjectRef.current?.cycleCamera();
  };

  const handleHangUp = () => {
    if (callObjectRef.current) {
      callObjectRef.current.leave();
      dispatch(showToast("Call disconnected!"));
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      {participants.map((participant) => (
        <DailyMediaView
          key={participant.user_id}
          videoTrack={callType === "video" ? participant.videoTrack : null}
          audioTrack={participant.audioTrack}
          mirror={participant.local}
          zOrder={participant.local ? 1 : 0}
          style={[styles.mediaView, callType === "audio" && styles.audioView]}
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
        {callType === "video" && (
          <TouchableOpacity onPress={toggleVideo} style={styles.button}>
            <Icon
              name={isVideoOn ? "video" : "video-off"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {callType === "video" && (
          <TouchableOpacity onPress={switchCamera} style={styles.button}>
            <Icon name="camera-switch" size={24} color="#fff" />
          </TouchableOpacity>
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

export default CallScreen;
