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
  FlatList,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import { CheckBox } from "../../components/icons";
import { userUserDataAction } from "../../store/actions/UserActions";
import RNPickerSelect from "react-native-picker-select";
import DropdownModal from "../../components/atoms/DropdownModal";
import DropdownListItem from "../../components/atoms/DropdownListItem";

const BloodType = (props) => {
  const signupStep = "step10";
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState(null);
  const [apiBody, setApiBody] = useState({
    bloodType: null,
    genotype: null,
  });

  const typeState = {
    bloodType: {
      ModalTitle: "Select BloodType",
      modalArry: [
        "Don't Know",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },
    genotype: {
      ModalTitle: "Select GenoType",
      modalArry: ["Don't know", "AS", "AA", "AC", "CC", "SS", "SC"],
    },
  };

  const { bloodType, genotype } = apiBody;

  const _onSubmit = async () => {
    dispatch(
      userUserDataAction(
        signupStep,
        {
          blood_Type: bloodType,
          genotype,
        },
        "UploadProfile"
      )
    );
  };

  const isInValid = () => {
    if (bloodType != null && genotype != null) return false;
    else return true;
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
              Blood Type:
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
              <Typography>Please check your blood group</Typography>
              <InputText
                onPress={() => setModalState("bloodType")}
                isPressable //   {...i}
                title={"Select bloodtype"}
                style={{ marginTop: 15 }}
                value={bloodType}
              />
              <Typography>Please check your geno group</Typography>
              <InputText
                onPress={() => setModalState("genotype")}
                isPressable //   {...i}
                title={"Select genotype"}
                style={{ marginTop: 15 }}
                value={genotype}
              />
            </ScrollView>
            {modalState != null && (
              <DropdownModal
                title={typeState[modalState]?.ModalTitle}
                onClose={() => setModalState(null)}
              >
                <FlatList
                  data={typeState[modalState]?.modalArry}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separtor} />
                  )}
                  renderItem={({ item, index }) => (
                    <DropdownListItem
                      selected={apiBody[modalState] == item}
                      title={item}
                      onPress={() => {
                        setApiBody((prev) => ({
                          ...prev,
                          [modalState]: JSON.stringify(item),
                        }));
                        setModalState(null);
                      }}
                    />
                  )}
                />
              </DropdownModal>
            )}
            <View style={{ marginTop: 10 }}>
              <Button
                disabled={isInValid()}
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

export default BloodType;
