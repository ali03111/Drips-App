import React, { useRef, useState } from "react";
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
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IMAGES, COLORS, screenHeight, headerHeight } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { cloneDeep } from "lodash";
import { userUserDataAction } from "../../store/actions/UserActions";
import Icon from "react-native-vector-icons/Ionicons";
import { RootState } from "../../store/reducers";
import { showToast } from "../../store/actions/AppActions";

const formItem = {
  label: "Medical History",
  placeholder: "Medical History",
  type: "text",
  value: "",
  error: "",
  keyboardType: "default",
  refName: "past_medical_history",
  multiline: false,
  maxLength: 255,
};

const MedicalHistory = (props) => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const dispatch = useDispatch();
  const signupStep = "step3";
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState([cloneDeep(formItem)]);

  const _onSubmit = async () => {
    let validateData: any = {};
    let isValid = true;
    form.forEach((i, index) => {
      if (isValid && !i.value) isValid = false;
      validateData[`${i.refName}[${index}]`] = i.value;
    });

    if (isValid) {
      validateData.email = user.email;
      dispatch(
        userUserDataAction(
          signupStep,
          { ...validateData, formData: true },
          "SurgicalHistory"
        )
      );
    } else {
      dispatch(showToast("Please enter all items to continue"));
    }
  };

  const onAddMore = () => {
    let isValid = form.every((i) => i.value);
    if (isValid) {
      setForm([...form, cloneDeep(formItem)]);
    } else {
      dispatch(showToast("Please fill preceding item to continue"));
    }
  };

  const deleteItem = (index: number) => {
    let _form = cloneDeep(form);
    _form.splice(index, 1);
    setForm(_form);
  };

  const isInValid = () => form.some((i) => i.value === "");

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={{ height: headerHeight + 40 }} />
              <View style={styles.container}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <Image
                    source={IMAGES.splash}
                    style={{ width: "70%", height: 100, alignSelf: "center" }}
                    resizeMode="contain"
                  />

                  <Typography
                    color={COLORS.primary}
                    style={{ marginVertical: 10 }}
                  >
                    Past Medical History
                  </Typography>

                  <Typography
                    style={{ marginVertical: 5 }}
                    size={12}
                    textType="light"
                  >
                    List all medical conditions you have been previously
                    diagnosed with:
                  </Typography>

                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onAddMore}
                  >
                    {/* <Icon size={20} name="add" color={COLORS.primary} /> */}
                    <Text style={styles.buttonText}>Add more +</Text>
                  </TouchableOpacity>
                  {form.map((i, index) => (
                    <InputText
                      {...i}
                      key={index}
                      title={i.label}
                      error={errors[i.refName]}
                      onChangeText={(text) => {
                        let newForm = [...form];
                        newForm[index].value = text;
                        setForm(newForm);
                      }}
                      rightIcon={
                        index > 0 && (
                          <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                            onPress={() => deleteItem(index)}
                          >
                            <Icon
                              name="trash"
                              size={20}
                              color={COLORS.danger}
                            />
                          </TouchableOpacity>
                        )
                      }
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  ))}

                  {/* <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onAddMore}
                  >
                    <Icon size={20} name="add" color={COLORS.primary} />
                    <Text style={styles.buttonText}>Add more +</Text>
                  </TouchableOpacity> */}
                  <View style={{ bottom: 10 }}>
                    <Button
                      label="Next"
                      disabled={isInValid()}
                      onPress={_onSubmit}
                    />
                    <Button
                      label="Back"
                      onPress={() => props.navigation.goBack()}
                      backgroundColor="#b8b8b8"
                    />
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 5,
  },
});

export default MedicalHistory;
