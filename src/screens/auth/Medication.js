import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { userUserDataAction } from "../../store/actions/UserActions";
import { CheckBox } from "../../components/icons";

const Medication = (props) => {
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);
  const [medications, setMedications] = useState([{ alergic: "" }]);
  const signupStep = "step7";

  const _onSubmit = async () => {
    if (!select) return;
    dispatch(
      userUserDataAction(
        signupStep,
        {
          is_current_medication: select.toLowerCase(),
          Current_medication1:
            select === "Yes" ? medications.map((res) => res.alergic) : [],
        },
        "SelfAssessment"
      )
    );
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexGrow: 1, marginTop: 30 }}
        >
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <ScrollView
            contentContainerStyle={styles.container(
              medications.length >= 1 && select === "Yes"
            )}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={IMAGES.splash}
              style={styles.logo}
              resizeMode="contain"
            />

            <Typography color={COLORS.primary} style={styles.heading}>
              Current Medication
            </Typography>

            <View style={styles.card}>
              <Typography align="center">
                Are you currently taking any medication?
              </Typography>

              <View style={styles.optionsContainer}>
                {["Yes", "No"].map((i, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={styles.options}
                    onPress={() => {
                      setSelect(i);
                      if (i === "No") setMedications([]); // Reset medications if "No" is selected
                    }}
                  >
                    <CheckBox selected={i === select} />
                    <Typography>{` ${i}`}</Typography>
                  </TouchableOpacity>
                ))}
              </View>

              {select === "Yes" && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      setMedications([...medications, { alergic: "" }])
                    }
                    activeOpacity={0.7}
                    style={styles.addMoreButton}
                  >
                    <Typography>Add more +</Typography>
                  </TouchableOpacity>

                  {medications.map((res, index) => (
                    <View key={index} style={styles.inputRow}>
                      <InputText
                        placeholder="Enter medications"
                        onChangeText={(text) => {
                          setMedications((prevAllergies) =>
                            prevAllergies.map((allergy, i) =>
                              i === index
                                ? { ...allergy, alergic: text }
                                : allergy
                            )
                          );
                        }}
                        value={res.alergic}
                        autoCapitalize="none"
                        returnKeyType="done"
                        style={styles.input}
                        allowSpacing={false}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setMedications((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Image
                          source={IMAGES.trashImg}
                          resizeMode="contain"
                          style={styles.trashIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button disabled={!select} label="Next" onPress={_onSubmit} />
              <Button
                label="Back"
                onPress={() => props.navigation.goBack()}
                backgroundColor="#b8b8b8"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: "70%",
    height: 100,
    alignSelf: "center",
  },
  heading: {
    marginVertical: 10,
    textAlign: "center",
  },
  container: (isLength) => ({
    backgroundColor: "#fff",
    // top: 40,
    padding: 20,
    borderRadius: 20,
    // bottom: 50,
    // paddingBottom: 100,
  }),
  card: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    paddingBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  addMoreButton: {
    alignSelf: "flex-end",
    marginVertical: 5,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    width: "85%",
  },
  trashIcon: {
    width: 30,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default Medication;
