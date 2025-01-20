import React, { useReducer, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import * as Validator from "../../utils/Validator";
import { userUserDataAction } from "../../store/actions/UserActions";
import { CheckBox } from "../../components/icons";

const Medication = (props) => {
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);

  const [form, setForm] = useState([
    {
      label: "Surgical History",
      placeholder: "Current Medications ...",
      type: "text",
      value: "",
      error: "",
      keyboardType: "default",
      refName: "medical_history",
      multiline: false,
      maxLength: 100,
    },
  ]);

  const [medications, setMedications] = useState([{ alergic: "" }]);
  const [dummy, setDummy] = useState(0);
  const signupStep = "step7";
  const [errors, setErrors] = useState({});

  // const _onSubmit = async () => {
  //   let validateData = {};
  //   form.forEach((i) => {
  //     validateData[i.refName] = i.value;
  //   });
  //   Validator.validate(validateData).then((err) => {
  //     if (!err) {
  //       dispatch(
  //         userUserDataAction(
  //           signupStep,
  //           { Current_medication1: validateData.medical_history },
  //           "SelfAssessment"
  //         )
  //       );
  //     } else {
  //       setErrors(err);
  //     }
  //   });
  // };

  const _onSubmit = async () => {
    if (!select) return;

    //       dispatch(
    //   userUserDataAction(
    //     signupStep,
    //     { Current_medication1: validateData.medical_history },
    //     "SelfAssessment"
    //   )
    // );
    dispatch(
      userUserDataAction(
        signupStep,
        {
          is_current_medication: select.toLowerCase(),
          Current_medication1:
            select == "Yes" ? medications.map((res) => res.alergic) : [],
        },
        "SelfAssessment"
      )
    );
  };

  const isInValid = () => {
    return form.filter((i) => i.value === "").length > 0;
  };

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
              <Typography color={COLORS.primary} style={{ marginTop: 10 }}>
                Current Medication
              </Typography>

              <Typography size={12} textType="light" style={{ marginTop: 10 }}>
                Are you currently taking any medication
              </Typography>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "50%",
                }}
              >
                {["Yes", "No"].map((i, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    style={styles.options}
                    onPress={() => {
                      if (i == "No") setMedications([]);
                      setSelect(i);
                    }}
                  >
                    <CheckBox selected={i === select} />
                    <Typography>{` ${i}`}</Typography>
                  </TouchableOpacity>
                ))}
              </View>
              {select == "Yes" && (
                <>
                  <Typography
                    size={12}
                    textType="light"
                    style={{ marginVertical: 10 }}
                  >
                    List all active medication you take:
                  </Typography>
                  <TouchableOpacity
                    onPress={() =>
                      setMedications([...medications, { alergic: "" }])
                    }
                  >
                    <Typography
                      style={{ textAlign: "right", marginVertical: 5 }}
                    >
                      Add more +
                    </Typography>
                  </TouchableOpacity>
                  {medications.map((res, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <InputText
                          placeholder={`Enter medications`}
                          onChangeText={(text) => {
                            setMedications((prevAllergies) =>
                              prevAllergies.map((allergy, i) =>
                                i === index
                                  ? { ...allergy, alergic: text }
                                  : allergy
                              )
                            );
                          }}
                          value={medications[index]?.alergic}
                          autoCapitalize={"none"}
                          returnKeyType={"done"}
                          style={{ width: "85%" }}
                          allowSpacing={false}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setDummy(dummy + 1);
                            medications.splice(index, 1);
                          }}
                        >
                          <Image
                            source={IMAGES.trashImg}
                            resizeMode="contain"
                            style={{ width: 30 }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </>
              )}
            </ScrollView>
            <View style={{ marginTop: 10 }}>
              <Button disabled={!select} label={"Next"} onPress={_onSubmit} />
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

export default Medication;
