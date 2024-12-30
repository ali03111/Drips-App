import React, { useEffect } from "react";
import {
  View,
  Button as RNButton,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  consultFormDateFormat,
  consultFormTimingFormat,
  IMAGES,
} from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  ImageUploader,
  InnerHeader,
  InputDateTime,
  Typography,
} from "../../components/atoms";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from "react";
import {
  createConsultReqAction,
  fetchPatientDetailsAction,
  fetchSymptomsAction,
  updateConsultantData,
  updateDeviceAction,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import { showToast } from "../../store/actions/AppActions";
import moment from "moment";
import messaging from "@react-native-firebase/messaging";
import { getUniqueId } from "react-native-device-info";
import { onUserLogin } from "../../utils/ZegoCloudConfig";
let initialState = {
  bookingType: "On Demand",
  symptoms: [] as {
    selected: boolean;
    name: string;
  }[],
  selectedImage: {
    uri: "",
  } as any,
  date: moment().format(consultFormDateFormat),
  timing: moment().format(consultFormTimingFormat),
  start_date: moment().format(consultFormDateFormat),
};

const Home = (props) => {
  const dispatch = useDispatch();
  const [
    { bookingType, symptoms, selectedImage, start_date, date, timing },
    setState,
  ] = useState(initialState);
  const updateState = (state: {}) =>
    setState((prevState) => ({ ...prevState, ...state }));
  const userData = useSelector((state: RootState) => state.UserReducer.user);
  const symptomsData = useSelector(
    (state: RootState) => state.UserReducer.symptoms
  );
  const _fetchSymptoms = async () => {
    dispatch(fetchSymptomsAction());
    dispatch(fetchPatientDetailsAction());
  };

  useEffect(() => {
    if (symptomsData.length !== symptoms.length) {
      let _symptoms = symptomsData.map((i: any) => {
        return { ...i, selected: false };
      });
      updateState({ symptoms: _symptoms });
    }
  }, [symptomsData]);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      let deviceId = await getUniqueId();
      let body = {
        device_id: deviceId,
        firebase_token: token,
      };
      dispatch(updateDeviceAction(body));
    }
  };

  useEffect(() => {
    onUserLogin({
      userID: userData.user_id,
      userName: userData.name,
      userType: "patient",
    });
    _fetchSymptoms();
    // requestUserPermission();
  }, []);

  const _onSubmit = () => {
    let problem = symptoms
      .filter((i) => i.selected)
      .map((i) => {
        return i.name;
      });
    if (problem.length === 0) {
      dispatch(showToast("Please select atleast one symptom to continue"));
      return;
    } else if (selectedImage.uri === "") {
      dispatch(showToast("Please add image to continue"));
      return;
    }
    let body: any = new FormData();
    if (selectedImage.uri) {
      body.append("images", selectedImage);
    }
    body.append("patient_id", userData.user_id);
    body.append("problem", problem.join(","));
    body.append("start_date", start_date);
    body.append("date", date);
    body.append("timing", timing);
    let _data = {
      patient_id: userData.user_id,
      problem: problem.join(","),
      booking_type: bookingType,
      start_date,
      date,
      timing,
    };
    dispatch(updateConsultantData({ apointmentData: _data }));
    dispatch(createConsultReqAction(body));
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Home" drawerBtn={true} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 20 }}
        >
          {/* <RNButton
            title="Call Me"
            onPress={() => reset("VideoCall" as never)}
          ></RNButton> */}
          <Typography size={20} textType="semiBold">
            Request A Consultation
          </Typography>

          <View style={{ marginTop: 20 }}>
            <Typography>What are your symptoms?</Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {symptoms.map((i, index) => (
                <Pressable
                  onPress={() => {
                    let _symptoms = [...symptoms];
                    _symptoms[index].selected = !_symptoms[index].selected;
                    updateState({
                      symptoms: _symptoms,
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "45%",
                    marginVertical: 8,
                  }}
                >
                  <View style={{ width: 25 }}>
                    <Icon
                      size={i.selected ? 18 : 20}
                      style={{ marginRight: 5 }}
                      color="#4bd1fd"
                      name={i.selected ? "check" : "square"}
                      onValueChange={(newValue) => {}}
                      boxType={"square"}
                    />
                  </View>
                  <Typography style={{ flex: 1 }} textType="light">
                    {i.name}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 30 }}>
            <Typography>Upload Photo (Presenting Complain)</Typography>
            <ImageUploader
              title={"Upload Photo"}
              uri={null}
              onSelect={(e: any) => {
                updateState({ selectedImage: e });
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Typography>Booking Type?</Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {["On Demand", "Scheduled"].map((i) => (
                <Pressable
                  onPress={() => updateState({ bookingType: i })}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "45%",
                    marginTop: 10,
                  }}
                >
                  <View style={{ width: 25 }}>
                    <Icon
                      size={bookingType === i ? 18 : 20}
                      style={{ marginRight: 5 }}
                      color="#4bd1fd"
                      name={bookingType === i ? "check" : "square"}
                      onValueChange={(newValue) => {}}
                      boxType={"square"}
                    />
                  </View>
                  <Typography textType="light">{i}</Typography>
                </Pressable>
              ))}
            </View>
          </View>
          {bookingType === "Scheduled" && (
            <>
              <View style={{ marginTop: 20 }}>
                <Typography>Select Date</Typography>
                <InputDateTime
                  minDate={new Date()}
                  onChange={(text: string) => {
                    updateState({
                      date: moment(text, "MM-DD-YYYY").format("YYYY-MM-DD"),
                    });
                  }}
                  mode={"date"}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <Typography>Select Time</Typography>
                <InputDateTime
                  onChange={(text: string) => {
                    updateState({ time: text });
                  }}
                  mode={"time"}
                />
              </View>
            </>
          )}

          <View style={{ marginTop: 20 }}>
            <Button label={"Update"} onPress={() => _onSubmit()} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 5,
  },
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
});

export default Home;

const SYMPTOMS = [
  "Fever",
  "Nasal Congestion",
  "Tinnitus",
  "Shortness Of Breath",
  "Heart Burn",
  "Missed Period",
];
