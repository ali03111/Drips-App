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
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IMAGES, COLORS, headerHeight } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { cloneDeep } from "lodash";
import * as Validator from "../../utils/Validator";
import { userUserDataAction } from "../../store/actions/UserActions";
import Icon from "react-native-vector-icons/Ionicons";
import { showToast } from "../../store/actions/AppActions";
import { RootState } from "../../store/reducers";

const formItem = {
  label: "Surgical History",
  placeholder: "Surgical History",
  type: "text",
  value: "",
  error: "",
  keyboardType: "default",
  refName: "Surgeries1",
  multiline: false,
  maxLength: 500,
};

const SurgicalHistory = (props) => {
  const dispatch = useDispatch();
  const signupStep = "step4";
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState([cloneDeep(formItem)]);

  const { user } = useSelector((state: RootState) => state.UserReducer);

  const _onSubmit = async () => {
    let validateData = {};
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
          "FamilyHistory"
        )
      );
    } else {
      dispatch(showToast("Please enter all items to continue"));
    }
  };

  const onAddMore = () => {
    let isValid = form.every((i) => i.value.trim() !== "");
    if (isValid) {
      let _formItem = cloneDeep(formItem);
      setForm([...form, _formItem]);
    } else {
      dispatch(showToast("Please fill preceding item to continue"));
    }
  };

  const deleteItem = (index) => {
    let _form = cloneDeep(form);
    if (_form[index]) {
      _form.splice(index, 1);
    }
    setForm(_form);
  };

  const isInValid = () => form.some((i) => i.value.trim() === "");

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={styles.imageBackground}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <View style={{ height: headerHeight + 40 }} />
              <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <Image
                    source={IMAGES.splash}
                    style={styles.logo}
                    resizeMode={"contain"}
                  />

                  <Typography color={COLORS.primary} style={styles.title}>
                    Past Surgical History
                  </Typography>

                  <Typography
                    style={styles.subtitle}
                    size={12}
                    textType="light"
                  >
                    List all surgical conditions you have been previously
                    diagnosed with:
                  </Typography>

                  {form.map((item, index) => (
                    <InputText
                      {...item}
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      error={errors[item.refName]}
                      title={item.label}
                      onChangeText={(text) => {
                        form[index].value = text;
                        setForm([...form]);
                      }}
                      onSubmitEditing={() => {
                        if (index < form.length - 1) {
                          inputRefs.current[index + 1]?.focus();
                        } else {
                          Keyboard.dismiss();
                        }
                      }}
                      blurOnSubmit={false}
                      rightIcon={
                        index > 0 && (
                          <TouchableOpacity
                            style={styles.deleteIcon}
                            onPress={() => deleteItem(index)}
                          >
                            <Icon
                              name={"trash"}
                              size={20}
                              color={COLORS.danger}
                            />
                          </TouchableOpacity>
                        )
                      }
                    />
                  ))}

                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={onAddMore}
                  >
                    <Icon size={20} name="add" color={COLORS.primary} />
                    <Typography style={styles.buttonText}>Add More</Typography>
                  </TouchableOpacity>
                  <View>
                    <Button
                      disabled={isInValid()}
                      label={"Next"}
                      onPress={_onSubmit}
                    />
                    <Button
                      label={"Back"}
                      onPress={() => props.navigation.goBack()}
                      backgroundColor={"#b8b8b8"}
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
  imageBackground: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: "70%",
    height: 100,
    alignSelf: "center",
  },
  title: {
    marginVertical: 10,
  },
  subtitle: {
    marginVertical: 5,
  },
  buttonContainer: {
    paddingVertical: 12,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 15,
    marginLeft: 5,
  },
  deleteIcon: {
    paddingHorizontal: 10,
  },
});

export default SurgicalHistory;
