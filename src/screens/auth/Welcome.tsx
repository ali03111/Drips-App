import React from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button } from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import Config from "react-native-config";

const Welcome = (props) => {
  const dispatch = useDispatch();

  const loginAs = (userType) => {
    dispatch(updateAppStates({ userType }));
    navigate("Login" as never);
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }} />
        <View style={styles.container}>
          <Image
            source={IMAGES.splash}
            style={{ width: "70%", height: 100 }}
            resizeMode={"contain"}
          />

          <View style={{ marginTop: 20 }}>
            <Button label={"Sign in as a Patient"} onPress={() => loginAs(1)} />
            <Button
              label={"Sign in as a Physician"}
              onPress={() => loginAs(2)}
              backgroundColor={"#b8b8b8"}
            />
          </View>
        </View>
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

export default Welcome;
