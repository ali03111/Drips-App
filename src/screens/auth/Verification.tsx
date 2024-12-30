import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, Typography } from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import PopupModal from "../../components/molecules/PopupModal";

const Verification = (props) => {
  const dispatch = useDispatch();

  const inputRef = useRef([]);
  const [pin, setPin] = useState(Array(4).fill(""));
  const [popup, setPopup] = useState({
    visibility: false,
    title: "Verified",
    desc: "Hurrah!! You have successfully verified the account.",
    onSubmit: () => {},
  });

  const loginAs = (userType) => {
    dispatch(updateAppStates({ userType }));
    navigate("Login");
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground
        source={IMAGES.imgbg}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <View style={styles.container}>
          <Typography size={16} align="center">
            Enter your 4 digit code
          </Typography>

          <View
            style={{
              backgroundColor: "#e3f0f8",
              marginTop: 10,
              width: 150,
              height: 150,
              borderRadius: 80,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Image
              source={IMAGES.mailbox}
              style={{ width: 70, height: 70 }}
              resizeMode={"contain"}
            />
          </View>

          <View style={styles.sectionCode}>
            {Array(4)
              .fill("")
              .map((_, i) => (
                <View style={[styles.sectionField]}>
                  <TextInput
                    ref={(e) => (inputRef[i] = e)}
                    placeholder="-"
                    onChangeText={(text) => {
                      pin[i] = text;
                      setPin([...pin]);
                      if (text.length > 0) {
                        inputRef[i + 1]?.focus();
                        inputRef[i + 1]?.clear();
                      }
                    }}
                    onFocus={() => inputRef[i]?.clear()}
                    value={pin[i]}
                    keyboardType="numeric"
                    returnKeyType="done"
                    maxLength={1}
                    blurOnSubmit={true}
                    style={styles.inputText}
                  />
                </View>
              ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              justifyContent: "center",
            }}
          >
            <Typography>Did you don't get code?</Typography>
            <TouchableOpacity>
              <Typography color={COLORS.primary}>Resend</Typography>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            <Button
              label={"Verify"}
              onPress={() => {
                setPopup((prev) => {
                  return {
                    ...prev,
                    visibility: true,
                    onSubmit: () => {
                      setPopup({ ...popup, visibility: false });
                      props.navigation.navigate("ContactInfo");
                    },
                  };
                });
              }}
            />
          </View>
        </View>
        <PopupModal {...popup} />
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

  sectionCode: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  sectionField: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  inputText: {
    padding: 10,
    fontSize: 18,
  },
});

export default Verification;
