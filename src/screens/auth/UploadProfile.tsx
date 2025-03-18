import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, Typography } from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { commonStyles } from "../../style";
import FaIcon from "react-native-vector-icons/FontAwesome";
import {
  updateUserStates,
  userUserDataAction,
} from "../../store/actions/UserActions";
import { openCamera, openPicker } from "react-native-image-crop-picker";
import { ActionSheet } from "../../components/atoms/ActionSheet";
const UploadProfile = (props) => {
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    type: string;
    name: string;
  }>();
  const dispatch = useDispatch();
  const [actionSheet, showActionSheet] = useState(false);

  const signupStep = "step9";
  const [errors, setErrors] = useState({});

  const _onSubmit = async () => {
    dispatch(
      userUserDataAction(
        signupStep,
        {
          pic: selectedImage,
        },
        "UploadProfile"
      )
    );
  };
  /* 
  {
              dispatch( updateUserStates({token: true}) )
            }
             */
  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1 }} />
        <View style={styles.container}>
          <Image
            source={IMAGES.splash}
            style={{ width: "60%", height: 80 }}
            resizeMode={"contain"}
          />

          <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
            Upload your profile image
          </Typography>

          <TouchableOpacity
            style={[commonStyles.boxShadow, styles.avatarContainer]}
            onPress={() => showActionSheet(true)}
          >
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage.uri }
                  : IMAGES.avatar_placeholder
              }
              style={styles.avatar}
            />

            <View style={styles.avatarBtn}>
              <FaIcon name="camera" color={COLORS.primary} size={15} />
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 10 }}>
            <Button
              disabled={!selectedImage}
              label={"Submit"}
              onPress={_onSubmit}
            />
            <Button
              label={"Back"}
              onPress={() => props.navigation.goBack()}
              backgroundColor={"#b8b8b8"}
            />
          </View>
        </View>
      </ImageBackground>
      {actionSheet && (
        <ActionSheet
          onCancel={() => showActionSheet(false)}
          onImageSuccess={(imageObj: { type; name; uri }) => {
            setSelectedImage(imageObj);
            showActionSheet(false);
          }}
        />
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
  avatarContainer: {
    borderWidth: 5,
    borderColor: "#fff",
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    borderRadius: Math.round(
      Dimensions.get("window").width + Dimensions.get("window").height
    ),
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").width * 0.25,
    alignSelf: "center",
  },
  avatarBtn: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 25,
    zIndex: 2,
    elevation: 2,
  },
});

export default UploadProfile;
