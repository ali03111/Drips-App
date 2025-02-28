import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  Alert,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import ErrorListView from "../../components/atoms/ErrorListView";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { reset } from "../../navigation/RootNavigation";
import moment from "moment";
import { RootState } from "../../store/reducers";
import {
  fetchOrders,
  fetchPrescription,
  fetchResults,
} from "../../store/actions/UserActions";
import { get, post } from "../../store/services/Http";
import {
  disableLoader,
  enableLoader,
  showToast,
} from "../../store/actions/AppActions";
import { errorHandler } from "../../utils/utils";
import RNFetchBlob from "rn-fetch-blob";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { hp, wp } from "../../utils/responsive";

const ConsultationNotes = (props) => {
  const item = props.route.params;

  const [complain, setComplain] = useState(null);
  const [notes, setNotes] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const [objectiveData, setObjective] = useState({
    ABDOMEN: null,
    Appearance: null,
    CARDIOVASCULAR: null,
    GENERAL_APPEARANCE: null,
    GENITOURINARY: null,
    HEAD_AND_NECK: null,
    HEME_LYMPH: null,
    MUSCULOSKELETAL: null,
    NEURO: null,
    PSYCH: null,
    RESPIRATORY_CHEST: null,
    SKIN_INTEGUMENARY: null,
    objective: null,
  });
  const updateState = (data) => setObjective((prev) => ({ ...prev, ...data }));

  const {
    ABDOMEN,
    Appearance,
    CARDIOVASCULAR,
    GENERAL_APPEARANCE,
    GENITOURINARY,
    HEAD_AND_NECK,
    HEME_LYMPH,
    MUSCULOSKELETAL,
    NEURO,
    PSYCH,
    RESPIRATORY_CHEST,
    SKIN_INTEGUMENARY,
    objective,
  } = objectiveData;

  const dispatch = useDispatch();
  const _fetchMedicalHistory = () => {
    fetchOrders();
  };
  const fetchOrders = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/consulation-notes-lists?consultation_id=${item.id}`
    );
    if (response.status && response.code === "200") {
      if (response?.subjectives?.complain_history)
        setComplain(response?.subjectives?.complain_history);
      else if (response?.subjectives?.diagnosis)
        setDiagnosis(response?.subjectives?.diagnosis);
      else if (response?.subjectives?.plan)
        setNotes(response?.subjectives?.plan);
      else if (response?.notes) setObjective(response?.notes);
      //   setMedicalDetails(response.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  const updateData = async (url, body) => {
    dispatch(enableLoader());
    const response = await post(
      url,
      JSON.stringify({
        consultation_id: item.id,
        patient_id: item.user_id,
        doctor_id: item.doctor_id,
        ...body,
      })
    );
    console.log("responseresponseresponseresponse", response, url, body);
    if (response.status && response.code === "200") {
      dispatch(disableLoader());
      dispatch(showToast(response.message));
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  useEffect(() => {
    _fetchMedicalHistory();
  }, []);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Consultation Note" backBtn={true} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: hp("10") }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={{ ...styles.sectionTitle }}>SUBJECTIVE</Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline={true}
                value={complain}
                onChangeText={(e) => setComplain(e)}
              />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                updateData("/add-subjectives", {
                  column_type: "complain_history",
                  text: complain,
                });
              }}
            >
              <Text style={styles.startButtonText}>Update Subjective</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.sectionTitle }}>OBJECTIVE</Text>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              GENERAL APPEARANCE:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={GENERAL_APPEARANCE}
                onChangeText={(e) => updateState({ GENERAL_APPEARANCE: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              HEAD AND NECK:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={HEAD_AND_NECK}
                onChangeText={(e) => updateState({ HEAD_AND_NECK: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              RESPIRATORY/CHEST:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={RESPIRATORY_CHEST}
                onChangeText={(e) => updateState({ RESPIRATORY_CHEST: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              CARDIOVASCULAR:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={CARDIOVASCULAR}
                onChangeText={(e) => updateState({ CARDIOVASCULAR: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              ABDOMEN:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={ABDOMEN}
                onChangeText={(e) => updateState({ ABDOMEN: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              GENITOURINARY:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={GENITOURINARY}
                onChangeText={(e) => updateState({ GENITOURINARY: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              MUSCULOSKELETAL:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={MUSCULOSKELETAL}
                onChangeText={(e) => updateState({ MUSCULOSKELETAL: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              NEURO:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={NEURO}
                onChangeText={(e) => updateState({ NEURO: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              HEME/LYMPH:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={HEME_LYMPH}
                onChangeText={(e) => updateState({ HEME_LYMPH: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              SKIN/INTEGUMENARY:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={SKIN_INTEGUMENARY}
                onChangeText={(e) => updateState({ SKIN_INTEGUMENARY: e })}
              />
            </View>
            <Text
              style={{
                ...styles.sectionTitle,
                fontWeight: "normal",
                marginTop: hp("2"),
              }}
            >
              PSYCH:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={PSYCH}
                onChangeText={(e) => updateState({ PSYCH: e })}
              />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                var bodyObj = {};
                Object.entries(objectiveData).forEach(([key, value]) => {
                  bodyObj = {
                    ...bodyObj,
                    [key]: value,
                  };
                });
                updateData("/add-notes", bodyObj);
                console.log(
                  ":dklsbvklsbdklvbskldbvklsdbvklsdbklvbsdklvbklsdv",
                  bodyObj
                );
              }}
            >
              <Text style={styles.startButtonText}>Update Objective</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.sectionTitle, marginTop: hp("4") }}>
              Diagnosis:
            </Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={diagnosis}
                onChangeText={(e) => setDiagnosis(e)}
              />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                updateData("/add-subjectives", {
                  column_type: "diagnosis",
                  text: diagnosis,
                });
              }}
            >
              <Text style={styles.startButtonText}>Update Diagnosis</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.sectionTitle }}>Plan:</Text>
            <View style={styles.input}>
              <TextInput
                style={styles.inputStyle}
                placeholderTextColor={COLORS.darkGray}
                multiline
                value={notes}
                onChangeText={(e) => setNotes(e)}
              />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                updateData("/add-subjectives", {
                  column_type: "plan",
                  text: notes,
                });
              }}
            >
              <Text style={styles.startButtonText}>Update Plan</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: hp("50"),
  },
  actionBtn: {
    // width: widthPercentageToDP("40"),
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2076",
    paddingVertical: heightPercentageToDP("1"),
  },
  addButton: {
    backgroundColor: COLORS.primary,
    // padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp("4"),
    justifyContent: "center",
    marginVertical: hp("2"),
    width: wp("90"),
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: wp("90"),
    alignSelf: "center",
    height: hp("10"),
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  sectionTitle: {
    fontSize: hp("1.5"),
    fontWeight: "bold",
    marginBottom: hp("1"),
    color: COLORS.black,
    // marginLeft: wp("3"),
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
  },
  startButtonText: { color: "#fff", fontWeight: "bold" },
  inputStyle: {
    color: "black",
    flex: 1,
    width: wp("85"),
    overflow: "scroll",
  },
});

export default ConsultationNotes;
