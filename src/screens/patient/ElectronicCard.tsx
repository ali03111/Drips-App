import React, { useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  IMAGES,
  IMAGE_URL,
  screenHeight,
  screenWidth,
} from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  ImageUploader,
  InnerHeader,
  InputDateTime,
  Typography,
} from "../../components/atoms";
import CheckBox from "@react-native-community/checkbox";
import { commonStyles } from "../../style";
import { RootState } from "../../store/reducers";
import {
  fetchPatientDetailsAction,
  getConsultantDetailAction,
} from "../../store/actions/UserActions";
import { getChatDetailsAction } from "../../store/actions/ChatActions";
import { navigate } from "../../navigation/RootNavigation";
import { startCase } from "lodash";
import { initZegoCallConfig } from "../../utils/ZegoCloudConfig";
import { ZegoSendCallInvitationButton } from "@zegocloud/zego-uikit-prebuilt-call-rn";
import { MedicalHistoryModel } from "../../store/models/MedicalHistory";
const ElectronicCard = (props) => {
  const dispatch = useDispatch();
  const { userType } = useSelector((state: RootState) => state.UserReducer);
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const medicalDetails: MedicalHistoryModel = useSelector(
    (state: RootState) => state.UserReducer.medicalHistory
  );
  const { patientDetails, apointmentDetails } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  const item = props?.route?.params?.item || undefined;
  /* const _fetchDoctorDetails = () => {
    const physicianId = item.doctor_id;
    let data = {
      id: physicianId,
    };
    dispatch(fetchDoctorDetailsAction(data));
  }; */
  const _fetchAppointmentDetails = () => {
    const id = item.id;
    let data = {
      id,
    };
    dispatch(getConsultantDetailAction(data));
  };
  const _fetchPatientDetails = () => {
    let data = {
      id: userType === 1 ? user.user_id : item.patient_id,
    };
    dispatch(fetchPatientDetailsAction(data));
  };

  const _initCallConfig = async (callType: string) => {
    navigate(
      "VideoCall" as never,
      {
        item: {
          ...item,
          callType,
        },
      } as never
    );
  };
  useEffect(() => {
    if (userType === 1) {
      _fetchPatientDetails();
    }
  }, []);

  useEffect(() => {
    if (props?.route?.params?.item) {
      _fetchPatientDetails();
      _fetchAppointmentDetails();
    }
  }, [props?.route?.params?.item]);

  const getInfoValue = (item: { type: string }) => {
    switch (item.type) {
      case "name":
        return `${patientDetails.fname} ${patientDetails.lname}`;
      case "dob":
        return `${patientDetails.dob || "N/A"} `;
      case "gender":
        return `${patientDetails.gender || "N/A"}`;
      case "marital":
        return `${patientDetails.marital_status || "N/A"}`;
      case "job":
        return `${patientDetails.job_title}`;
      case "height":
        return `${patientDetails.height}`;
      case "weight":
        return `${patientDetails.Weight}`;
      case "bmi":
        return `${patientDetails.Bmi}`;
      default:
        return "";
    }
  };

  const splitStringToArray = (dataString: string[] = []) => {
    // console.log("dataString ===> ", dataString);
    if (dataString.length > 0) {
      return dataString;
      // if (typeof dataString === "string" && dataString !== "") {
      // return dataString.split(",").map((item) => item.replace(/"/g, ""));
    }
    return ["N/A"];
  };

  const renderOtherInfo = (item: { type: number }) => {
    // console.log(patientDetails.allergies);

    // return <></>;
    //past_medical_history
    //Surgeries1
    //social_history
    //Current_medication1
    let data: any = [];
    switch (item.type) {
      case 1:
        if (medicalDetails.allergies) {
          const _data = splitStringToArray(medicalDetails.allergies);

          _data.map((i) => {
            data.push(
              <Typography align="center" size={12}>
                {startCase(i)}
              </Typography>
            );
          });
          break;
        }
        return (
          <Typography align="center" size={12}>
            N/A
          </Typography>
        );
      case 2:
        if (medicalDetails.past_medical_history) {
          const _data = splitStringToArray(medicalDetails.past_medical_history);
          _data.map((i) => {
            data.push(
              <Typography align="center" size={12}>
                {startCase(i)}
              </Typography>
            );
          });
          break;
        }
        return (
          <Typography align="center" size={12}>
            N/A
          </Typography>
        );
      case 3:
        if (medicalDetails.Surgeries1) {
          const _data = splitStringToArray(medicalDetails.Surgeries1);
          _data.map((i) => {
            data.push(
              <Typography align="center" size={12}>
                {startCase(i)}
              </Typography>
            );
          });
          break;
        }
        return (
          <Typography align="center" size={12}>
            N/A
          </Typography>
        );
      default:
        return (
          <Typography align="center" size={12}>
            N/A
          </Typography>
        );
    }
    return data;
  };

  let userImageUrl =
    (user.pic && { uri: IMAGE_URL + user.pic }) || IMAGES.avatar_placeholder;

  const voiceCallStatus =
    ["accepted", "Accepted"].includes(apointmentDetails.consultation_status) &&
    apointmentDetails.type === "Audio";
  const videoCallStatus =
    ["accepted", "Accepted"].includes(apointmentDetails.consultation_status) &&
    apointmentDetails.type === "Video";

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader
          title="Electronic Complaint Card"
          drawerBtn={false}
          backBtn={true}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 20 }}
        >
          <View style={styles.card}>
            <View style={styles.innerCard}>
              <Typography color="#fff" style={styles.ribbon} align="center">
                Electronic Complaint Card
              </Typography>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                <View style={{ paddingVertical: 10 }}>
                  <Image
                    source={userImageUrl}
                    style={styles.profileImg}
                    resizeMode={"cover"}
                  />
                </View>

                <View style={{ paddingVertical: 10, marginLeft: 20 }}>
                  {INFO.map((i) => (
                    <View style={{ flexDirection: "row" }}>
                      <Typography
                        size={12}
                        style={{ width: 70 }}
                        textType="light"
                      >
                        {i.title}:{" "}
                      </Typography>
                      <Typography size={12} textType="light">
                        {getInfoValue(i)}
                      </Typography>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}
          >
            {HISTORY.map((i: any) => (
              <View
                style={{
                  width: "50%",
                }}
              >
                <Typography
                  color="#fff"
                  style={{
                    backgroundColor: i.color,
                    padding: 5,
                    borderRadius: 10,
                    marginTop: 20,
                    margin: 10,
                  }}
                  align="center"
                  size={12}
                >
                  {i.title}
                </Typography>
                {renderOtherInfo(i)}
              </View>
            ))}
          </View>
          {userType === 2 && item.payment_status === "success" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: 20,
              }}
            >
              <Button
                btnStyle={styles.actionButton}
                label={"Chat"}
                onPress={() => {
                  dispatch(getChatDetailsAction(item));
                }}
              />

              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: `${item.patient_id}`,
                    userName: `${item.name}`,
                  },
                ]}
                isVideoCall={false}
                resourceID={"drips_call_kit"}
              />
              <ZegoSendCallInvitationButton
                invitees={[
                  {
                    userID: `${item.patient_id}`,
                    userName: `${item.name}`,
                  },
                ]}
                isVideoCall={true}
                resourceID={"drips_call_kit"}
              />

              {voiceCallStatus && (
                <Button
                  btnStyle={styles.actionButton}
                  label={`Start Audio Call`}
                  onPress={() => {
                    _initCallConfig("Audio");
                  }}
                />
              )}

              {videoCallStatus && (
                <Button
                  btnStyle={styles.actionButton}
                  label={`Start Video Call`}
                  onPress={() => {
                    _initCallConfig("Video");
                  }}
                />
              )}
            </View>
          )}
          {userType === 1 && (
            <View style={{ marginTop: 20 }}>
              <Button
                label={"Edit"}
                onPress={() => navigate("MyMedicalHistory" as never)}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: screenWidth(2),
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
  ribbon: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  innerCard: {
    paddingBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  card: {
    ...commonStyles.boxShadow,
    // backgroundColor: "#fff",
    marginTop: 20,
  },
  profileImg: {
    backgroundColor: COLORS.border,
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    resizeMode: "cover",
  },
});

export default ElectronicCard;

const INFO = [
  {
    title: "Name",
    type: "name",
    value: "Jason Moama",
  },
  {
    title: "DOB",
    type: "dob",
    value: "10 June 1996",
  },
  {
    title: "Gender",
    type: "gender",
    value: "Male",
  },
  {
    title: "Job Title",
    type: "job",
    value: "Excutive",
  },
  {
    title: "Marital Status",
    type: "marital",
    value: "Excutive",
  },
  {
    title: "Height",
    type: "height",
    value: "155 cm",
  },
  {
    title: "Weight",
    type: "weight",
    value: "80 kg",
  },
  {
    title: "BMI",
    type: "bmi",
    value: "99",
  },
];

const HISTORY = [
  {
    title: "Alergies",
    type: 1,
    color: "#ff0100",
    value: "N/A",
  },
  {
    title: "Post Medical History",
    type: 2,
    color: "#00397f",
    value: "N/A",
  },
  {
    title: "Past Surgical History",
    type: 3,
    color: "#00397f",
    value: "N/A",
  },
  {
    title: "Social History",
    type: 4,
    color: "#f48148",
    value: "N/A",
  },
  {
    title: "Current Medications",
    type: 5,
    color: "#008000",
    value: "N/A",
  },
  {
    title: "Family History",
    type: 6,
    color: "#f48148",
    value: "N/A",
  },
];
