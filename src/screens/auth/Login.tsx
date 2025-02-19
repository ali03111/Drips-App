import React, { Ref, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTSIZE, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, Typography, InputText } from "../../components/atoms";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Validator from "../../utils/Validator";
import { navigate } from "../../navigation/RootNavigation";
import { commonStyles } from "../../style";
import { loginAction, updateUserStates } from "../../store/actions/UserActions";

const Login = (props) => {
  const dispatch = useDispatch();
  const { userType } = useSelector((state: any) => state.AppReducer);

  const [errors, setErrors]: any = useState({});

  const [email, setEmail] = useState(
    __DEV__
      ? userType === 1
        ? "mackasauser@gmail.com"
        : "adeobabamideled@gmail.com"
      : ""
  );
  //adeobabamideled@gmail.com
  //mackasauser@gmail.com
  const [password, setPassword] = useState(
    __DEV__ ? (userType === 1 ? "@Admin!23#" : "123123123") : ""
  );

  const [secureEntry, setSecureEntry] = useState(true);
  const EmailInput: any = React.createRef();
  const PasswordInput: any = React.createRef();

  const _onSignin = () => {
    let validateData: {
      email?: string;
      username?: string;
      password?: string;
    } = { email, password };
    if (userType === 2) {
      delete validateData.email;
      validateData.username = email;
    }
    Validator.validate(validateData).then((err) => {
      if (!err) {
        let loginData = {
          email,
          password,
        };
        dispatch(loginAction(loginData));
        // dispatch(updateUserStates({token: true}));
      } else setErrors(err);
    });
  };
  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }} />

          <View style={styles.inputContainer}>
            <Image
              source={IMAGES.splash}
              style={{ width: "80%", height: 100 }}
              resizeMode={"contain"}
            />

            <InputText
              label={userType === 1 ? "Email" : "MDCN"}
              placeholder={`Enter ${userType === 1 ? "Email" : "MDCN"}`}
              onChangeText={(text) => setEmail(text)}
              value={email}
              error={errors.email}
              autoCapitalize={"none"}
              keyboardType={"email-address"}
              returnKeyType={"done"}
              inputRef={EmailInput}
              onSubmitEditing={() =>
                PasswordInput.current && PasswordInput.current.focus()
              }
              allowSpacing={false}
            />

            <InputText
              label={"Password"}
              placeholder={"Password"}
              onChangeText={(text) => setPassword(text)}
              value={password}
              error={errors.password}
              autoCapitalize={"none"}
              returnKeyType={"done"}
              secureTextEntry={secureEntry}
              inputRef={PasswordInput}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              // rightIcon={
              //   <TouchableOpacity
              //     style={{ justifyContent: "center", marginHorizontal: 8 }}
              //     onPress={() => setSecureEntry(!secureEntry)}
              //   >
              //     <Icon
              //       name={secureEntry ? "eye-slash" : "eye"}
              //       size={15}
              //       color={COLORS.darkGray}
              //     />
              //   </TouchableOpacity>
              // }
            />

            <View style={commonStyles.justifyContentBetween}>
              <TouchableOpacity
                onPress={() => navigate("ForgotPassword" as never)}
              >
                <Typography>Forget Password</Typography>
              </TouchableOpacity>
              {userType == 1 && (
                <TouchableOpacity onPress={() => navigate("SignUp")}>
                  <Typography color={COLORS.primary}>Create Account</Typography>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <Button label={"Log In"} onPress={_onSignin} />
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
  },
  inputContainer: {
    backgroundColor: "#fff",
    marginTop: 80,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
});

export default Login;
