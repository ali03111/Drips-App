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
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  InnerHeader,
  InputDateTime,
  InputText,
  Typography,
} from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import * as Validator from "../../utils/Validator";
import { registerAction } from "../../store/actions/UserActions";

const CreatePassword = (props) => {
  let signUpFormData = props.route.params.signUpFormData || {};
  const dispatch = useDispatch();
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [bmi, setBmi] = useState("");

  const [form, setForm] = useState([
    {
      label: "Password",
      placeholder: "Password",
      type: "text",
      value: __DEV__ ? "Pass@123" : "",
      error: "",
      keyboardType: "default",
      refName: "new_password",
      returnKeyType: "next",
      focusName: "confirm_password",
      secureTextEntry: true,
      leftIconVisibility: false,
    },
    {
      label: "Password",
      placeholder: "Password",
      type: "text",
      value: __DEV__ ? "Pass@123" : "",
      error: "",
      keyboardType: "default",
      refName: "confirm_password",
      returnKeyType: "done",
      secureTextEntry: true,
      leftIconVisibility: false,
    },
  ]);

  const _onSubmit = () => {
    let validateData: any = {};
    form.map((i) => (validateData[i.refName] = i.value));
    Validator.validate(validateData).then((err) => {
      console.log("jklsbvklsdbkvlsdbklsdbvklsdbsdkv", err);
      if (!err) {
        setErrors({});
        validateData = {
          password: validateData.new_password,
          password_confirmation: validateData.confirm_password,
          ...signUpFormData,
        };
        console.log("jklsbvklsdbkvlsdbklsdbvklsdbsdkvdsfsd", validateData);
        dispatch(registerAction(validateData));
        // dispatch(updateUserStates({token: true}));
      } else setErrors(err);
    });
    //navigate('Verification');
  };

  const _isValid = () => {
    let formInValid = form.filter((i) => i.value === "") || [];
    return formInValid.length !== 0;
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <InnerHeader backBtn />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{ width: "70%", height: 100 }}
              resizeMode={"contain"}
            />

            <Typography color={COLORS.primary} style={{ marginTop: 10 }}>
              Create Password
            </Typography>

            {form.map((i: any, index) => {
              return (
                <InputText
                  {...i}
                  key={index}
                  title={i.label}
                  error={errors[i.refName]}
                  style={{ marginTop: 15 }}
                  onChangeText={(text: string) => {
                    form[index].value = text;
                    setForm([...form]);
                  }}
                  inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                  onSubmitEditing={() => {
                    i.focusName
                      ? inputRefs.current[i.focusName].focus()
                      : Keyboard.dismiss();
                  }}
                />
              );
            })}

            <View style={{ marginTop: 20 }}>
              <Button
                disabled={_isValid()}
                label={"Submit"}
                onPress={_onSubmit}
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
  },
});

// const FORM = ;

export default CreatePassword;
