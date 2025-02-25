import React, { useEffect, useState } from "react";
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
  InputText,
  Typography,
} from "../../components/atoms";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  createConsultReqAction,
  fetchPatientDetailsAction,
  fetchSymptomsAction,
  updateConsultantData,
  updateDeviceAction,
} from "../../store/actions/UserActions";
import { showToast } from "../../store/actions/AppActions";
import moment from "moment";
import messaging from "@react-native-firebase/messaging";
import { getUniqueId } from "react-native-device-info";
import { onUserLogin } from "../../utils/ZegoCloudConfig";
import { widthPercentageToDP } from "react-native-responsive-screen";

const initialState = {
  bookingType: "On Demand",
  symptoms: [],
  selectedImage: { uri: "" },
  date: moment().format(consultFormDateFormat),
  timing: moment().format(consultFormTimingFormat),
  start_date: moment().format(consultFormDateFormat),
};

const Home = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const { bookingType, symptoms, selectedImage, start_date, date, timing } =
    state;

  const [textBoxText, setTextBoxText] = useState(null);

  const updateState = (newState) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const userData = useSelector((state) => state.UserReducer.user);
  const symptomsData = useSelector((state) => state.UserReducer.symptoms);

  useEffect(() => {
    if (symptomsData.length !== symptoms.length) {
      let updatedSymptoms = symptomsData.map((i) => ({
        ...i,
        selected: false,
      }));
      updateState({ symptoms: updatedSymptoms });
    }
  }, [symptomsData]);

  useEffect(() => {
    onUserLogin({
      userID: userData.user_id,
      userName: userData.name,
      userType: "patient",
    });
    dispatch(fetchSymptomsAction());
    dispatch(fetchPatientDetailsAction());
  }, []);

  const _onSubmit = () => {
    let problem = symptoms.filter((i) => i.selected).map((i) => i.name);

    if (problem.length === 0) {
      dispatch(showToast("Please select at least one symptom to continue"));
      return;
    }
    // else if (selectedImage.uri === "") {
    //   dispatch(showToast("Please add an image to continue"));
    //   return;
    // }

    // console.log("skjvjksdblkvadbklvbsdklvblksdv", problem.join(","));

    let body = new FormData();
    if (selectedImage.uri) {
      body.append("images", selectedImage);
    }
    body.append("patient_id", userData.user_id);
    body.append("problem", [...problem, textBoxText].join(","));
    body.append("start_date", moment(start_date).format(consultFormDateFormat));
    body.append("date", date);
    body.append("timing", timing);

    let _data = {
      patient_id: userData.user_id,
      problem: [...problem, textBoxText].join(","),
      booking_type: bookingType,
      start_date: moment(start_date).format(consultFormDateFormat),
      date,
      timing: moment(timing).format(consultFormTimingFormat),
    };
    console.log("bodybodybodybodybodybodybodybodybodybody", body, start_date);
    dispatch(updateConsultantData({ appointmentData: _data }));
    dispatch(createConsultReqAction(body));
  };

  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase() // Convert to lowercase first to ensure proper formatting
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join back into a single string
  }

  console.log("symptomssymptomssymptomssymptomssymptomssymptoms", symptoms);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Home" drawerBtn={true} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 20 }}
        >
          <Typography size={20} textType="semiBold">
            Request A Consultation
          </Typography>

          <View style={{ marginTop: 20 }}>
            <Typography>Symptoms</Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {symptoms.map((i, index) => (
                <Pressable
                  key={i.id}
                  onPress={() => {
                    let updatedSymptoms = symptoms.map((symptom, idx) =>
                      idx === index
                        ? { ...symptom, selected: !symptom.selected }
                        : symptom
                    );
                    updateState({ symptoms: updatedSymptoms });
                  }}
                  style={{
                    flexDirection: "row",
                    // alignItems: "center",
                    width: "47%",
                    marginVertical: 8,
                    // backgroundColor: "red",
                    marginRight: widthPercentageToDP("2.5"),
                  }}
                >
                  <View style={{ width: 25 }}>
                    <Icon
                      size={i.selected ? 18 : 20}
                      style={{ marginRight: 5 }}
                      color="#4bd1fd"
                      name={i.selected ? "check" : "square"}
                    />
                  </View>
                  <Typography style={{ width: "86%" }} textType="light">
                    {capitalizeFirstLetter(i.name)}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>
          {symptoms.find((res) => res.name == "Other")?.selected == true && (
            <InputText
              onChangeText={(text) => setTextBoxText(text)}
              value={textBoxText}
              //  error={errors.email}
              autoCapitalize={"none"}
              //  keyboardType={"email-address"}
              returnKeyType={"done"}
              // inputRef={textBoxText}
              //  onSubmitEditing={() =>
              //    PasswordInput.current && PasswordInput.current.focus()
              //  }
              //  allowSpacing={false}
            />
          )}
          <View style={{ marginTop: 30 }}>
            <Typography>Upload Photo (Presenting Complaint)</Typography>
            <ImageUploader
              title={"Upload Photo"}
              uri={null}
              onSelect={(e) => updateState({ selectedImage: e })}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Typography>Booking Type?</Typography>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {["On Demand", "Scheduled"].map((i) => (
                <Pressable
                  key={i}
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
                    />
                  </View>
                  <Typography textType="light">{i}</Typography>
                </Pressable>
              ))}
            </View>
          </View>
          {bookingType == "Scheduled" && (
            <InputDateTime
              label={"Please select date"}
              style={{ marginVertical: 10, padding: 15 }}
              onChange={(text) => {
                updateState({ start_date: text });
              }}
            />
          )}
          <InputDateTime
            label={"Please select time"}
            mode={"time"}
            style={{ marginVertical: 10, padding: 15 }}
            onChange={(text) => {
              console.log(
                "texttexttexttexttexttexttexttexttexttexttexttext",
                text
              );
              updateState({ timing: text });
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Button label={"Update"} onPress={() => _onSubmit()} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.primary },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

export default Home;
