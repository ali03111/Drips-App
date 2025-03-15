import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  FlatList,
  PermissionsAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGE_URL, IMAGES } from "../../../constants";
import SafeAreaContainer from "../../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../../components/atoms";
import { hp, wp } from "../../../utils/responsive";
import { onUserLogin } from "../../../utils/ZegoCloudConfig";
import {
  fetchPatientDetailsAction,
  getConsultantDetailAction,
} from "../../../store/actions/UserActions";
import { post, get } from "../../../store/services/Http";
import {
  disableLoader,
  enableLoader,
  showToast,
} from "../../../store/actions/AppActions";
import { errorHandler } from "../../../utils/utils";
import Accordion from "react-native-collapsible/Accordion";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import { fetchPhysicianPatients } from "../../../store/actions/PhysicianActions";

const MeetingDetail = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.UserReducer.user);

  const { title } = useSelector((state) => state.ScreenReducer);
  const { userType } = useSelector((state) => state.UserReducer);
  const { user } = useSelector((state) => state.UserReducer);

  const [orderText, setOrderText] = useState(null);
  const [orderNote, setOrderNote] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  const [allPrescription, setAllPrescription] = useState([]);
  const [medName, setMedName] = useState(null);
  const [medDose, setMedDose] = useState(null);
  const [duration, setDuration] = useState(null);

  const [updateData, setUpdateData] = useState(null);

  //   const [orderText, setOrderText] = useState(null);
  //   const [orderNote, setOrderNote] = useState(null);

  const { patientDetails, apointmentDetails } = useSelector(
    (state) => state.ConsultantReducer
  );
  const item = route?.params || undefined;

  console.log(
    "patientDetailspatientDetailspatientDetailspatientDetails",

    title
  );

  const fetchOrders = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/orders-list?consultation_id=${apointmentDetails.id}`
    );
    if (response.status && response.code === "200") {
      console.log;
      setAllOrders(response.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };
  const fetchPrescription = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/prescriptions-list?consultation_id=${apointmentDetails.id}`
    );
    if (response.status && response.code === "200") {
      console.log;
      setAllPrescription(response.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };
  const endConsultation = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/end-consultation?consultation_id=${apointmentDetails.id}`
    );
    if (response.status && response.code === "200") {
      console.log;
      dispatch(showToast(response.message));
      dispatch(disableLoader());
      dispatch(
        fetchPhysicianPatients({
          payload: title ?? "Scheduled Consultations",
        })
      );
      navigation.goBack();
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  const _fetchAppointmentDetails = () => {
    const id = item?.id;
    let data = {
      id,
    };
    dispatch(getConsultantDetailAction(data));
  };

  const _fetchPatientDetails = () => {
    let data = {
      id: userType === 1 ? user.user_id : item?.patient_id,
    };
    dispatch(fetchPatientDetailsAction(data));
  };

  useEffect(() => {
    _fetchPatientDetails();
  }, []);

  useEffect(() => {
    _fetchPatientDetails();
    _fetchAppointmentDetails();
    fetchOrders();
    fetchPrescription();
  }, []);

  const postData = async (url, body) => {
    dispatch(enableLoader());
    const response = await post(url, JSON.stringify(body));
    console.log("responseresponseresponseresponse", response, url, body);
    if (response.status && response.code === "200") {
      dispatch(showToast(response.message));
      setOrderNote(null);
      setOrderText(null);
      setMedDose(null);
      setMedName(null);
      setDuration(null);
      dispatch(disableLoader());
      fetchOrders();
      fetchPrescription();
      setUpdateData(null);
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log("Permission Error:", err);
        return false;
      }
    }
    return true;
  };

  const BASE_URL = "https://webvortech.com/drips/custom-portal/api"; // 🔹 Replace with your API's base URL

  const downloadOrdersApi = async (id, patient_id, doctor_id) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to allow storage permission to download files."
      );
      return;
    }

    dispatch(enableLoader());

    try {
      // Ensure full API URL
      const fileUrl = `${BASE_URL}/orderpdfview?id=${id}&download=pdf&patient_id=${patient_id}&doctor_id=${doctor_id}`;

      dispatch(showToast("Downloading Started..."));
      dispatch(disableLoader());
      // Define file path
      const { dirs } = RNFetchBlob.fs;
      const filePath =
        Platform.OS === "android"
          ? `${dirs.DownloadDir}/order_${id}.pdf`
          : `${dirs.DocumentDir}/order_${id}.pdf`; // iOS uses DocumentDir

      // Start the download
      const res = await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
        appendExt: "pdf",
        IOSBackgroundTask: true,
        indicator: true,
        addAndroidDownloads: { notification: true, useDownloadManager: true },
      }).fetch("GET", fileUrl);

      dispatch(disableLoader());
      dispatch(showToast(`File saved to: ${res.path()}`));

      console.log("File saved to:", res.path());

      // Open the PDF after download
      // if (Platform.OS === "android") {
      //   RNFetchBlob.android.actionViewIntent(res.path(), "application/pdf");
      // } else {
      //   RNFetchBlob.ios.openDocument(res.path());
      // }
    } catch (error) {
      dispatch(disableLoader());
      console.error("Download Error:", error);
      dispatch(
        showToast(`Downloading completed please check your download folder`)
      );
      // dispatch(showToast(`Download Failed ${error}`));
    }
  };

  const downloadPrescriptiopnApi = async (id, patient_id, doctor_id) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to allow storage permission to download files."
      );
      return;
    }

    dispatch(enableLoader());

    try {
      // Ensure full API URL
      const fileUrl = `${BASE_URL}/pdfview?id=${id}&download=pdf&patient_id=${patient_id}&doctor_id=${doctor_id}`;

      dispatch(showToast("Downloading Started..."));
      dispatch(disableLoader());
      // Define file path
      const { dirs } = RNFetchBlob.fs;
      const filePath =
        Platform.OS === "android"
          ? `${dirs.DownloadDir}/order_${id}.pdf`
          : `${dirs.DocumentDir}/order_${id}.pdf`; // iOS uses DocumentDir

      // Start the download
      const res = await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
        appendExt: "pdf",
        IOSBackgroundTask: true,
        indicator: true,
        addAndroidDownloads: { notification: true, useDownloadManager: true },
      }).fetch("GET", fileUrl);

      dispatch(disableLoader());
      dispatch(showToast(`File saved to: ${res.path()}`));

      console.log("File saved to:", res.path());

      // Open the PDF after download
      // if (Platform.OS === "android") {
      //   RNFetchBlob.android.actionViewIntent(res.path(), "application/pdf");
      // } else {
      //   RNFetchBlob.ios.openDocument(res.path());
      // }
    } catch (error) {
      dispatch(disableLoader());
      console.error("Download Error:", error);
      // dispatch(showToast("Download Failed"));
      dispatch(
        showToast(`Downloading completed please check your download folder`)
      );
    }
  };

  let userImageUrl =
    (patientDetails.pic && { uri: IMAGE_URL + patientDetails.pic }) ||
    IMAGES.avatar_placeholder;

  const getInfoValue = (item) => {
    switch (item.type) {
      case "name":
        return `${patientDetails.fname} ${patientDetails.lname}`;
      case "dob":
        return `${patientDetails.dob || "N/A"}`;
      case "gender":
        return `${patientDetails.gender || "N/A"}`;
      case "marital":
        return `${patientDetails.marital_status || "N/A"}`;
      case "job":
        return `${patientDetails.job_title}`;
      case "height":
        return `${patientDetails.height} cm`;
      case "weight":
        return `${patientDetails.Weight} kg`;
      case "bmi":
        return `${patientDetails.Bmi}`;
      case "bloodType":
        return `${patientDetails.blood_type ?? "Not availabe"}`;
      case "problems":
        return `${apointmentDetails.problem ?? "Not availabe"}`;
      default:
        return "";
    }
  };

  const deleteFunc = async (url, body) => {
    dispatch(enableLoader());
    const response = await post(url, JSON.stringify(body));
    console.log("responseresponseresponseresponse", response, url, body);
    if (response.status && response.code === "200") {
      dispatch(showToast(response.message));
      setOrderNote(null);
      setOrderText(null);
      setMedDose(null);
      setMedName(null);
      setDuration(null);
      dispatch(disableLoader());
      fetchOrders();
      fetchPrescription();
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase() // Convert to lowercase first to ensure proper formatting
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join back into a single string
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={[styles.cell, styles.center]}>
        <Text style={styles.text}>{item?.text}</Text>
      </View>
      <View style={[styles.cell, styles.center]}>
        <Text style={styles.text}>{item?.ordernote}</Text>
      </View>
      <View style={[styles.cell, styles.center, { flexDirection: "row" }]}>
        {/* <TouchableOpacity style={styles.iconButton}> */}
        <Icon
          size={hp("2")}
          color={COLORS.primary}
          name="trash"
          style={{ marginRight: wp("3"), marginLeft: wp("3") }}
          onPress={() => deleteFunc("/delete-order", { id: item.id })}
        />
        <Icon
          size={hp("2")}
          color={COLORS.primary}
          name="edit"
          onPress={() => {
            setUpdateData(item.id);
            setOrderNote(item?.ordernote);
            setOrderText(item?.text);
          }}
        />
      </View>
    </View>
  );
  const renderPrescriptionItem = ({ item }) => (
    <View style={styles.row}>
      <View style={[styles.cell, styles.center]}>
        <Text style={styles.text}>{item?.medication_name}</Text>
      </View>
      <View style={[styles.cell, styles.center]}>
        <Text style={styles.text}>{item?.medication_name2}</Text>
      </View>
      <View style={[styles.cell, styles.center]}>
        <Text style={styles.text}>{item?.duration}</Text>
      </View>
      <View style={[styles.cell, styles.center, { flexDirection: "row" }]}>
        <Icon
          size={hp("2")}
          color={COLORS.primary}
          name="trash"
          style={{ marginRight: wp("3"), marginLeft: wp("3") }}
          onPress={() => deleteFunc("/delete-prescription", { id: item.id })}
        />
        <Icon
          size={hp("2")}
          color={COLORS.primary}
          name="edit"
          onPress={() => {
            setUpdateData(item.id);
            setMedDose(item?.medication_name2);
            setMedName(item?.medication_name);
            setDuration(item?.duration);
          }}
        />
      </View>
    </View>
  );
  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title={"Consultation Type"} backBtn />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.contentContainer}
            contentContainerStyle={{ paddingBottom: hp("10") }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.profileContainer}>
              <Image
                source={userImageUrl}
                style={styles.profileImage}
                resizeMode={"cover"}
                defaultSource={IMAGES.avatar_placeholder}
              />
              <View>
                {INFO.map((i) => (
                  <View style={{ flexDirection: "row" }}>
                    <Typography
                      size={12}
                      style={{ width: 70 }}
                      textType="light"
                    >
                      {i.title}:{" "}
                    </Typography>
                    <Typography size={12} textType="light" numberOfLines={2}>
                      {getInfoValue(i)}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.timerContainer}>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={{ color: "white" }}>Hour</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={{ color: "white" }}>Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.timerButton}>
                <Text style={{ color: "white" }}>Seconds</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                console.log(
                  "lkbsdvlkbsdlkbvklsdbvksdbklvbsdklvblbsdlkvblsdbvl",
                  apointmentDetails
                );
                navigation.navigate("VideoCall", {
                  item: {
                    ...apointmentDetails,
                    callType: capitalizeFirstLetter(
                      apointmentDetails.appointment_type
                    ),
                  },
                });
              }}
            >
              <Text style={styles.startButtonText}>START MEETING</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: Platform.OS == "ios" ? wp("90") : wp("88"),
                  alignSelf: "center",
                }}
              >
                <Text style={styles.sectionTitle}>Add Prescription</Text>
                <FontAwesome
                  size={hp("2")}
                  color={COLORS.primary}
                  name="remove"
                  onPress={() => {
                    setMedDose(null);
                    setMedName(null);
                    setDuration(null);
                  }}
                />
              </View>
              <TextInput
                placeholder="Medication Name"
                style={styles.input}
                placeholderTextColor={COLORS.darkGray}
                value={medName}
                onChangeText={(e) => setMedName(e)}
              />
              <TextInput
                placeholder="Medication Dose"
                style={styles.input}
                placeholderTextColor={COLORS.darkGray}
                value={medDose}
                onChangeText={(e) => setMedDose(e)}
              />
              <TextInput
                placeholder="Duration"
                style={styles.input}
                placeholderTextColor={COLORS.darkGray}
                value={duration}
                onChangeText={(e) => setDuration(e)}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  postData(
                    updateData ? "/update-prescription" : "/add-prescription",
                    {
                      doctor_id: apointmentDetails.doctor_id,
                      patient_id: patientDetails.user_id,
                      consultation_id: apointmentDetails.id,
                      medication_name: medName,
                      medication_name2: medDose,
                      duration,
                      id: updateData,
                    }
                  );
                }}
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: Platform.OS == "ios" ? wp("90") : wp("88"),
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                marginBottom: hp("4"),
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...styles.sectionTitle, marginBottom: 0 }}>
                Prescription by doctor
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.addButton,
                  paddingHorizontal: wp("2"),
                  height: hp("3"),
                }}
                onPress={() => {
                  downloadOrdersApi(
                    1,
                    patientDetails.user_id,
                    apointmentDetails.doctor_id
                  );
                }}
                disabled={Boolean(allPrescription.length == 0)}
              >
                <Text style={{ color: "white", fontSize: hp("1.5") }}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              {allPrescription.length > 0 ? (
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.header}>
                    <Text style={[styles.headerText, styles.flex1]}>
                      Order Name
                    </Text>
                    <Text style={[styles.headerText, styles.flex1]}>
                      Order Note
                    </Text>
                    <Text style={[styles.headerText, styles.flex1]}>
                      Duration
                    </Text>
                    <Text style={[styles.headerText, styles.flex1]}>
                      Action
                    </Text>
                  </View>

                  {/* Table Data */}
                  <FlatList
                    data={allPrescription}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPrescriptionItem}
                  />
                </View>
              ) : (
                <Typography
                  style={{ textAlign: "center", marginVertical: hp("2") }}
                >
                  No Prescription Found
                </Typography>
              )}
            </View>

            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: Platform.OS == "ios" ? wp("90") : wp("88"),
                  alignSelf: "center",
                }}
              >
                <Text style={styles.sectionTitle}>Add Order</Text>
                <FontAwesome
                  size={hp("2")}
                  color={COLORS.primary}
                  name="remove"
                  onPress={() => {
                    setOrderNote(null);
                    setOrderText(null);
                  }}
                />
              </View>
              <TextInput
                placeholder="Enter Text"
                style={styles.input}
                placeholderTextColor={COLORS.darkGray}
                value={orderText}
                onChangeText={(e) => setOrderText(e)}
              />
              <TextInput
                placeholder="Enter Order Note"
                style={styles.input}
                placeholderTextColor={COLORS.darkGray}
                value={orderNote}
                onChangeText={(e) => setOrderNote(e)}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  postData(updateData ? "/update-order" : "/add-order", {
                    doctor_id: apointmentDetails.doctor_id,
                    patient_id: patientDetails.user_id,
                    consultation_id: apointmentDetails.id,
                    text: orderText,
                    ordernote: orderNote,
                    id: updateData,
                  })
                }
              >
                <Text style={{ color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: Platform.OS == "ios" ? wp("90") : wp("88"),
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                // marginBottom: hp("4"),
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...styles.sectionTitle, marginBottom: 0 }}>
                Order by doctor
              </Text>
              <TouchableOpacity
                style={{
                  ...styles.addButton,
                  paddingHorizontal: wp("2"),
                  height: hp("3"),
                }}
                onPress={() =>
                  downloadPrescriptiopnApi(
                    1,
                    patientDetails.user_id,
                    apointmentDetails.doctor_id
                  )
                }
                disabled={Boolean(allOrders.length == 0)}
              >
                <Text style={{ color: "white", fontSize: hp("1.5") }}>
                  Download
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.container}>
                {allOrders.length > 0 ? (
                  <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.header}>
                      <Text style={[styles.headerText, styles.flex1]}>
                        Order Name
                      </Text>
                      <Text style={[styles.headerText, styles.flex1]}>
                        Order Note
                      </Text>
                      <Text style={[styles.headerText, styles.flex1]}>
                        Action
                      </Text>
                    </View>

                    {/* Table Data */}
                    <FlatList
                      data={allOrders}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItem}
                    />
                  </View>
                ) : (
                  <Typography
                    style={{ textAlign: "center", marginVertical: hp("2") }}
                  >
                    No Order Found
                  </Typography>
                )}
              </View>

              {/* {allOrders.length> 0 ? allOrders.map(res=>{
                return(
                    <View style={{flexDirection:"row",width:wp('90'),alignSelf:"center",alignItems:"center"}} >

                    </View>
                )
            }) :null} */}
            </View>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() =>
                  navigation.navigate("ConsultationNotes", apointmentDetails)
                }
              >
                <Text style={{ color: "white" }}>Consultation Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() =>
                  navigation.navigate("MedicalHistoryPhysician", patientDetails)
                }
              >
                <Text style={{ color: "white" }}>Medical History</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.footerButton}>
                <Text style={{ color: "white" }}>Attachments</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{ ...styles.footerButton, width: wp("90") }}
                onPress={() =>
                  navigation.navigate("GeneralTestResults", {
                    ...patientDetails,
                    ...apointmentDetails,
                  })
                }
              >
                <Text style={{ color: "white" }}>General Test Results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.footerButton, width: wp("90") }}
                onPress={() => endConsultation()}
              >
                <Text style={{ color: "white" }}>End Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.footerButton, width: wp("90") }}
                onPress={() =>
                  navigation.navigate("Attachments", {
                    ...patientDetails,
                    ...apointmentDetails,
                  })
                }
              >
                <Text style={{ color: "white" }}>Attachments</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: "#fff",
  //     borderTopRightRadius: 20,
  //     borderTopLeftRadius: 20,
  //   },
  mainContainer: { flexGrow: 1, backgroundColor: COLORS.primary },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: hp("50"),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: wp("35"),
    height: hp("23"),
    marginRight: 15,
    borderRadius: 10,
  },
  profileDetails: { flex: 1 },
  profileText: { fontSize: 14, marginBottom: hp("0.5") },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  timerButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    width: wp("25"),
    alignItems: "center",
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
  },
  startButtonText: { color: "#fff", fontWeight: "bold" },
  inputContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: "black",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    // padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp("4"),
    justifyContent: "center",
  },
  footerButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  footerButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },

  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: COLORS.background || "#F5F5F5",
  },
  table: {
    // backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
    width: wp("90"),
    marginBottom: hp("2"),
    marginTop: hp("2"),
    // backgroundColor: "red",
  },
  header: {
    flexDirection: "row",
    // backgroundColor: COLORS.primary || "#007BFF",
    // padding: 10,
  },
  headerText: {
    color: COLORS.primary,
    fontWeight: "bold",
    // textAlign: "center",
    fontSize: hp("1.5"),
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
  },
  text: {
    fontSize: hp("1"),
    color: "#333",
  },
  iconButton: {
    marginHorizontal: 5,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary || "#007BFF",
  },
  flex1: {
    flex: 1,
    textAlign: "center",
  },
});

export default MeetingDetail;

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
    title: "Marital",
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
  {
    title: "B-type",
    type: "bloodType",
    value: "99",
  },
  {
    title: "Symptoms",
    type: "problems",
    value: "99",
  },
];
