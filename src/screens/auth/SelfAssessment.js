import React, { useReducer, useRef, useState } from "react";
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
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import * as Validator from "../../utils/Validator";
import { userUserDataAction } from "../../store/actions/UserActions";
import { CheckBox } from "../../components/icons";

const SelfAssessment = (props) => {
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);

  const [queries, setQueries] = useState([
    {
      label: `Do you have any type of daily pain?`,
      refName: "daily_pain",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have visual impairment?`,
      refName: "impairment",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have cancer or have you ever had cancer?`,
      refName: "cancer",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have any amputation?`,
      refName: "amputation",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have a heart device?`,
      refName: "heart",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have hearing or speaking impairment?`,
      refName: "impairment",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Are you on Dialysis`,
      refName: "dialysis",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have any organ transplant?`,
      refName: "transplant",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Do you have any psychiatric illness?`,
      refName: "psychiatric",
      selected: "",
      options: ["Yes", "No"],
    },
    {
      label: `Are you on Insulin, chemotherapy or any immune suppressing medication?`,
      refName: "insulin",
      selected: "",
      options: ["Yes", "No"],
    },
  ]);

  const signupStep = "step8";
  const [errors, setErrors] = useState({});

  const _onSubmit = async () => {
    let validateData = {};
    queries.forEach(
      (i) => (validateData[i.refName] = i.selected && i.selected.toLowerCase())
    );
    Validator.validate(validateData).then((err) => {
      if (!err) {
        dispatch(userUserDataAction(signupStep, validateData, "BloodType"));
      } else {
        setErrors(err);
      }
    });
  };

  const isInValid = () => {
    return queries.filter((i) => !i.selected).length > 0;
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{ width: "60%", height: 80 }}
              resizeMode={"contain"}
            />
            <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
              Self Assessment
            </Typography>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {queries.map((i, index) => (
                <View key={index} style={styles.queryCard}>
                  <Typography textType="light">{i.label}</Typography>
                  <View style={{ flexDirection: "row" }}>
                    {i.options.map((o) => (
                      <TouchableOpacity
                        key={o}
                        activeOpacity={1}
                        style={styles.options}
                        onPress={() => {
                          setQueries((prev) => {
                            prev[index].selected = o;
                            return [...prev];
                          });
                        }}
                      >
                        <CheckBox selected={o === i.selected} />
                        <Typography>{` ${o}`}</Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={{ marginTop: 10 }}>
              <Button
                label={"Next"}
                disabled={isInValid()}
                onPress={_onSubmit}
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
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
    marginBottom: 10,
    padding: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  queryCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default SelfAssessment;
