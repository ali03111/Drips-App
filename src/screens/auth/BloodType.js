import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import {
  disableLoader,
  enableLoader,
  updateAppStates,
} from "../../store/actions/AppActions";
import { CheckBox } from "../../components/icons";
import { userUserDataAction } from "../../store/actions/UserActions";
import RNPickerSelect from "react-native-picker-select";
import DropdownModal from "../../components/atoms/DropdownModal";
import DropdownListItem from "../../components/atoms/DropdownListItem";
import { get } from "../../store/services/Http";
import { errorHandler } from "../../utils/utils";

const BloodType = (props) => {
  const signupStep = "step10";
  const dispatch = useDispatch();
  const isEdit = props?.route?.params;

  const { user } = useSelector((state) => state.UserReducer);

  const getSocialData = async () => {
    dispatch(enableLoader());
    // const response = await get(`patient-detail?id=1810`);
    const response = await get(
      `/patient-detail?user_type=1&id=${user?.user_id}`
    );
    console.log("responseresponseresponseresponseresponse", response);
    if (response.status && response.code === "200") {
      setApiBody({
        bloodType:
          response?.patientinfo[0]?.blood_type != "not_selected"
            ? response?.patientinfo[0]?.blood_type
            : `Don't Know`,
        genotype:
          response?.patientinfo[0]?.genotype != "not_selected"
            ? response?.patientinfo[0]?.genotype
            : `Don't Know`,
      });
      // populateSelectedValues(
      //   queries,
      //   "firstOpQes",
      //   "secondOpQes",
      //   "thirdOpQes",
      //   "forthOpQes",
      //   response?.patientinfo[0]
      // );

      // setQueires(prev=>(

      // ))
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  useEffect(() => {
    if (isEdit == true) getSocialData();
  }, []);

  const [modalState, setModalState] = useState(null);
  const [apiBody, setApiBody] = useState({
    bloodType: null,
    genotype: null,
  });

  const typeState = {
    bloodType: {
      ModalTitle: "Select BloodType",
      modalArry: [
        "Don't Know",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },
    genotype: {
      ModalTitle: "Select GenoType",
      modalArry: ["Don't know", "AA", "AS", "AC", "SS", "SC", "CC"],
    },
  };

  const { bloodType, genotype } = apiBody;

  const _onSubmit = async () => {
    dispatch(
      userUserDataAction(
        signupStep,
        {
          blood_type: bloodType,
          genotype,
        },
        isEdit == true ? "null" : "SelfAssessment"
      )
    );
    if (isEdit == true) props?.navigation.goBack();
  };

  const isInValid = () => {
    if (bloodType != null && genotype != null) return false;
    else return true;
  };

  const getDisplayValue = (type, value) => {
    if (!value) return value;

    if (type === "bloodType") {
      const bloodSymbols = {
        "A+": "🩸 A+",
        "A-": "🩸 A-",
        "B+": "🩸 B+",
        "B-": "🩸 B-",
        "AB+": "🩸 AB+",
        "AB-": "🩸 AB-",
        "O+": "🩸 O+",
        "O-": "🩸 O-",
      };
      return bloodSymbols[value] || value;
    }

    if (type === "genotype") {
      const genotypeSymbols = {
        AA: "🧬 AA",
        AS: "🧬 AS",
        AC: "🧬 AC",
        SS: "🧬 SS",
        SC: "🧬 SC",
        CC: "🧬 CC",
      };
      return genotypeSymbols[value] || value;
    }

    return value;
  };

  console.log("bloodTypebloodTypebloodType", bloodType);

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }} />
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{ width: "70%", height: 100 }}
              resizeMode={"contain"}
            />

            <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
              Blood Type:
            </Typography>
            <Typography>
              Please check your blood group (leave blank if you don't know)
            </Typography>

            <ScrollView
              contentContainerStylestyle={{
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 10,
                padding: 20,
                paddingBottom: 10,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* <Typography>Please check your blood group</Typography> */}
              <InputText
                onPress={() => setModalState("bloodType")}
                isPressable //   {...i}
                title={"Select bloodtype"}
                style={{ marginTop: 15 }}
                value={bloodType}
                isBlood={true}
              />
              <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
                GenoType:
              </Typography>
              <InputText
                onPress={() => setModalState("genotype")}
                isPressable //   {...i}
                title={"Select genotype"}
                style={{ marginTop: 15 }}
                value={genotype}
              />
            </ScrollView>
            {modalState != null && (
              <DropdownModal
                title={typeState[modalState]?.ModalTitle}
                onClose={() => setModalState(null)}
              >
                <FlatList
                  data={typeState[modalState]?.modalArry}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separtor} />
                  )}
                  renderItem={({ item, index }) => (
                    <DropdownListItem
                      selected={apiBody[modalState] == item}
                      title={item}
                      onPress={() => {
                        setApiBody((prev) => ({
                          ...prev,
                          [modalState]: item,
                        }));
                        setModalState(null);
                      }}
                    />
                  )}
                />
              </DropdownModal>
            )}
            <View style={{ marginTop: 10 }}>
              <Button
                disabled={isInValid()}
                label={isEdit == true ? "Update" : "Next"}
                onPress={() => _onSubmit()}
              />
              <Button
                label={"Back"}
                onPress={() => props.navigation.goBack()}
                backgroundColor={"#b8b8b8"}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 80,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    maxHeight: "80%",
  },
  options: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default BloodType;
