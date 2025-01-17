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
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import { CheckBox } from "../../components/icons";
import { userUserDataAction } from "../../store/actions/UserActions";

const AlergyInfo = (props) => {
  const signupStep = "step2";
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);
  const [dummy, setDummy] = useState(0);
  const [allergies, setAllergies] = useState([{ alergic: "" }]);

  const _onSubmit = async () => {
    if (!select) return;
    dispatch(
      userUserDataAction(
        signupStep,
        {
          Is_allergies: select.toLowerCase(),
          allergies: select == "Yes" ? allergies.map((res) => res.alergic) : [],
        },
        "MedicalHistory"
      )
    );
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

            <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
              Allergies
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
              <Typography align="center">
                Are you allergic to any Medication or do you have any type of
                allergies?
              </Typography>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {["Yes", "No"].map((i, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    style={styles.options}
                    onPress={() => setSelect(i)}
                  >
                    <CheckBox selected={i === select} />
                    <Typography>{` ${i}`}</Typography>
                  </TouchableOpacity>
                ))}
              </View>
              {select == "Yes" && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      setAllergies([...allergies, { alergic: "" }])
                    }
                  >
                    <Typography
                      style={{ textAlign: "right", marginVertical: 5 }}
                    >
                      Add more +
                    </Typography>
                  </TouchableOpacity>
                  {allergies.map((res, index) => {
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
                          placeholder={`Enter allergies`}
                          onChangeText={(text) => {
                            setAllergies((prevAllergies) =>
                              prevAllergies.map((allergy, i) =>
                                i === index
                                  ? { ...allergy, alergic: text }
                                  : allergy
                              )
                            );
                          }}
                          value={allergies[index]?.alergic}
                          autoCapitalize={"none"}
                          returnKeyType={"done"}
                          // onSubmitEditing={() =>
                          //   PasswordInput.current && PasswordInput.current.focus()
                          // }
                          style={{ width: "85%" }}
                          allowSpacing={false}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setDummy(dummy + 1);
                            allergies.splice(index, 1);
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
              <Button
                disabled={!select}
                label={"Next"}
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

export default AlergyInfo;
