import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  FONTSIZE,
  IMAGES,
  IMAGE_URL,
  PAYMENT_URL,
} from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import { renderStars } from "../../utils/utils";
import { ConsultantItem } from "../../store/models";
import { WebView } from "react-native-webview";
import {
  createBookingReqAction,
  fetchDoctorDetailsAction,
  getConsultantDetailAction,
  requestDoctorAction,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import { getChatDetailsAction } from "../../store/actions/ChatActions";
import { navigate, reset } from "../../navigation/RootNavigation";
import { hp, wp } from "../../utils/responsive";

const ConsultantDetails = (props) => {
  const dispatch = useDispatch();
  const { doctorDetails, apointmentDetails } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  const [showPayment, setPayment] = useState<any>(undefined);
  const [paymentUrl, setPaymentUrl] = useState("");
  const { item }: { item: any } = props.route.params;
  console.log("ConsultantDetails item ==> ", item);

  let imagePath =
    (item.doctorimage && { uri: IMAGE_URL + item.doctorimage }) ||
    IMAGES.avatar_placeholder;
  const updatePaymentUrl = (type: string) => {
    //https://portal.dripsmedical.com/paynow/573?type=chat
    let url = `${PAYMENT_URL}/${item.id}?type=${type}`;
    console.log("payment URL:", url);

    setPaymentUrl(url);
    setPayment(true);
  };
  console.log(
    "jklsdbvklsbdklvsdklvbsdklvbskdlbv",
    item,
    IMAGE_URL + item.doctorimage
  );
  const _fetchDoctorDetails = () => {
    const physicianId = item.doctor_id;
    let data = {
      id: physicianId,
    };
    dispatch(fetchDoctorDetailsAction(data));
  };
  const _fetchAppointmentDetails = () => {
    const id = item.id;
    let data = {
      id,
    };
    dispatch(getConsultantDetailAction(data));
  };

  const [callButtonState, setCallButtonState] = useState("");
  const requestCallByType = (type: string) => {
    const { id: consultation_id, doctor_id, patient_id } = item;
    let data = {
      status: "Requested",
      session_date: "2023-08-10", //YYYY-MM-DD
      start_time: "12:00",
      duration_in_minutes: 15,
      patient_id,
      doctor_id,
      type,
      consultation_id,
    };
    dispatch(requestDoctorAction(data));
    _fetchAppointmentDetails();
    // setCallButtonState(type);
  };

  useEffect(() => {
    _fetchAppointmentDetails();
    _fetchDoctorDetails();
  }, []);

  const _onBookNow = () => {
    updatePaymentUrl("chat");
  };
  const _onChatPress = async () => {
    console.log("itemitemitemitemitemitemitemitemitemitemitemitemitem", item);

    await dispatch(getChatDetailsAction(item));
    // updatePaymentUrl('chat',{item})
  };
  console.log(
    "apointmentDetailsapointmentDetailsapointmentDetailsapointmentDetails",
    doctorDetails
  );

  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader
          title="Appointment Detail"
          drawerBtn={false}
          backBtn={true}
        />
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row" }}>
              <Image
                defaultSource={IMAGES.avatar_placeholder}
                source={imagePath}
                style={styles.profileImg}
              />

              <View style={styles.cardDetail}>
                <Typography size={16} textType="semiBold">
                  {doctorDetails.name}
                </Typography>
                <Typography size={12} color={COLORS.placeholderColor}>
                  Medical School: {doctorDetails.medical_school || "N/A"}
                </Typography>
                <Typography size={12} color={COLORS.placeholderColor}>
                  Specialities: {doctorDetails?.speciality_name || "N/A"}
                </Typography>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {apointmentDetails.payment_status === "success" && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#4cd2fd" }]}
                      // onPress={ () => props.navigation.navigate('Pricing') }
                      onPress={_onChatPress}
                    >
                      <Typography color="#fff" size={12} style={{ padding: 0 }}>
                        Chat
                      </Typography>
                    </TouchableOpacity>
                  )}
                </View>
                {/* <Typography>{item.customer_status}</Typography> */}
                {/* {apointmentDetails.payment_status === "success" && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {apointmentDetails.payment_status === "success" && (
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          { backgroundColor: "#4cd2fd" },
                        ]}
                        // onPress={ () => props.navigation.navigate('Pricing') }
                        onPress={_onChatPress}
                      >
                        <Typography
                          color="#fff"
                          size={12}
                          style={{ padding: 0 }}
                        >
                          Chat
                        </Typography>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#ff2076" }]}
                      onPress={() => requestCallByType("Audio")}
                    >
                      <Typography color="#fff" size={12} style={{ padding: 0 }}>
                        {voiceCallStatus
                          ? "Voice Call Request Pending"
                          : "Request Voice Call"}
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#feb524" }]}
                      onPress={() => requestCallByType("Video")}
                    >
                      <Typography color="#fff" size={12} style={{ padding: 0 }}>
                        {videoCallStatus
                          ? "Voice Call Request Pending"
                          : "Requst Video Call"}
                      </Typography>
                    </TouchableOpacity>
                  </View>
                )} */}
              </View>
            </View>

            <Typography
              color={COLORS.placeholderColor}
              style={{ marginTop: 20 }}
            >
              Residency: {doctorDetails.residency || "N/A"}
            </Typography>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography size={12} color={COLORS.rating}>
                {" "}
                {doctorDetails.customer_status || 1} (100){" "}
              </Typography>
              {renderStars(doctorDetails.customer_status || 1)}
            </View>

            <View style={commonStyles.separator} />
            {apointmentDetails.payment_status === "success" &&
            apointmentDetails.appointment_type != null ? (
              <>
                {apointmentDetails.appointment_type == "audio" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/call.png")}
                      resizeMode="contain"
                      style={{ width: wp("5"), height: hp("2") }}
                    />
                    <Typography>₦50</Typography>
                  </View>
                )}
                {apointmentDetails.appointment_type == "video" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/video.png")}
                      resizeMode="contain"
                      style={{ width: wp("5"), height: hp("2") }}
                    />
                    <Typography>₦80</Typography>
                  </View>
                )}
              </>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../assets/images/call.png")}
                    resizeMode="contain"
                    style={{ width: wp("5"), height: hp("2") }}
                  />
                  <Typography>₦50</Typography>
                </View>
                <View style={commonStyles.separator} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={require("../../assets/images/video.png")}
                    resizeMode="contain"
                    style={{ width: wp("5"), height: hp("2") }}
                  />
                  <Typography>₦80</Typography>
                </View>
              </>
            )}
            <View style={commonStyles.separator} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography>Mon-Wed</Typography>
              <Typography>10:00 AM - 12:00 PM</Typography>
            </View>
          </View>

          {/* <Button
            label={`Join Video Call`}
            onPress={() => {
              navigate(
                "VideoCall" as never,
                {
                  item: {
                    ...item,
                    callType: "Video",
                  },
                } as never
              );
            }}
          />

          <Button
            label={`Join Audio Call`}
            onPress={() => {
              navigate(
                "VideoCall" as never,
                {
                  item: {
                    ...item,
                    callType: "Audio",
                  },
                } as never
              );
            }}
          /> */}

          {apointmentDetails.payment_status === "success" &&
            apointmentDetails.appointment_type != null && (
              <View style={{ margin: 20 }}>
                <Button
                  label={`Join ${capitalizeFirstLetter(
                    apointmentDetails.appointment_type
                  )} Call`}
                  onPress={() => {
                    navigate(
                      "VideoCall" as never,
                      {
                        item: {
                          ...apointmentDetails,
                          callType: capitalizeFirstLetter(
                            apointmentDetails.appointment_type
                          ),
                        },
                      } as never
                    );
                  }}
                />
                {/* {apointmentDetails.consultation_status.toLowerCase() ===
                  "video" && (
                  <Button
                    label={`Join Video Call`}
                    onPress={() => {
                      navigate(
                        "VideoCall" as never,
                        {
                          item: {
                            ...item,
                            callType: "Video",
                          },
                        } as never
                      );
                    }}
                  />
                )} */}
              </View>
            )}
          <View style={{ margin: 20 }}>
            {!["success", "pending"].includes(
              apointmentDetails.payment_status
            ) && (
              <Typography
                textType="bold"
                align="center"
                style={styles.disclaimer}
              >
                Please pay appointment fee to continue using service.
              </Typography>
            )}
            {!["success", "pending"].includes(
              apointmentDetails.payment_status
            ) && <Button label={`Pay Now`} onPress={_onBookNow} />}
          </View>
        </View>
      </View>
      {showPayment && (
        <Modal
          onRequestClose={_fetchAppointmentDetails}
          transparent
          animationType="slide"
        >
          <SafeAreaContainer style={styles.paymentContainer}>
            <InnerHeader
              onBackPress={() => {
                setPayment(false);
                _fetchAppointmentDetails();
              }}
              backBtn
              title="Payment"
            />
            <View style={{ flex: 1 }}>
              <WebView source={{ uri: paymentUrl }} />
            </View>
          </SafeAreaContainer>
        </Modal>
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  disclaimer: {
    color: "red",
    fontSize: 12,
    fontFamily: undefined,
  },
  paymentContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
    marginHorizontal: -20,
  },
  card: {
    ...commonStyles.boxShadow,
    backgroundColor: "#fff",
    marginVertical: 15,
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  profileImg: {
    width: 110,
    height: 145,
    borderRadius: 10,
  },
  cardDetail: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
  },
  actionBtn: {
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConsultantDetails;
