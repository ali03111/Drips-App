import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES, IMAGE_URL } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import * as Validator from "../../utils/Validator";

import {
  Button,
  InnerHeader,
  InputDateTime,
  InputText,
  Typography,
} from "../../components/atoms";
import { commonStyles } from "../../style";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import {
  fetchDoctorDetailsAction,
  fetchPatientDetailsAction,
  updateDoctorProfileAction,
  updateProfileAction,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import BottomSheet from "../../components/atoms/BottomSheet";
import { imageCamera, imagePicker } from "../../utils/utils";
import { isEmpty, startCase } from "lodash";
import moment from "moment";
import DropdownModal from "../../components/atoms/DropdownModal";
import DropdownListItem from "../../components/atoms/DropdownListItem";
import { DoctorDetailsModel } from "../../store/reducers/ConsultantReducer";
import { hp, wp } from "../../utils/responsive";
const ProfileSettings = (props) => {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state: RootState) => state.UserReducer);
  // const { physicianProfile }: any = useSelector((state: RootState) => state.ConsultantReducer);

  const { doctorDetails }: { doctorDetails: DoctorDetailsModel } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  console.log(
    "useruseruseruseruseruseruseruseruseruseruseruseruseruser",
    doctorDetails,
    user
  );

  const actionSheet: any = useRef();
  const [modalState, setModalState] = useState(false);

  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [userProfile, setProfile] = useState({
    uri: IMAGE_URL + user.pic,
    type: null,
  });

  console.log(doctorDetails.email);

  const [form, setForm] = useState([
    {
      label: "First Name",
      placeholder: "First Name",
      type: "text",
      value: startCase(doctorDetails.name),
      error: "",
      keyboardType: "default",
      refName: "name",
      focusName: "lname",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Last Name",
      placeholder: "Last Name",
      type: "text",
      value: startCase(doctorDetails.lname),
      error: "",
      keyboardType: "default",
      refName: "lname",
      focusName: "phone",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Email",
      placeholder: "Email",
      type: "text",
      value: `${doctorDetails.email}`,
      error: "",
      editable: false,
      keyboardType: "default",
      refName: "email",
      focusName: "phone",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Phone Number",
      placeholder: "Phone Number",
      type: "text",
      value: doctorDetails.phone,
      error: "",
      keyboardType: "default",
      refName: "phone",
      // focusName: "dob",
      returnKeyType: "done",
      leftIconVisibility: false,
    },
    {
      label: "Date Of Birth",
      placeholder: "Date Of Birth",
      type: "datetime",
      mode: "date",
      value: doctorDetails?.dob,
      error: "",
      keyboardType: "default",
      refName: "dob",
      focusName: "Gender",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Gender",
      placeholder: "Gender",
      type: "text",
      value: startCase(doctorDetails.gender),
      error: "",
      keyboardType: "default",
      refName: "gender",
      focusName: "address",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Address",
      placeholder: "Address",
      type: "text",
      value: startCase(doctorDetails.residency),
      error: "",
      keyboardType: "default",
      refName: "residency",
      returnKeyType: "next",
      leftIconVisibility: false,
      editable: false,
    },
    {
      label: "Language",
      placeholder: "Language",
      type: "text",
      value: startCase(doctorDetails.language),
      error: "",
      keyboardType: "default",
      refName: "language",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
  ]);

  const _fetchProfile = () => {
    dispatch(fetchDoctorDetailsAction({ id: user.user_id }));
  };

  const _onSubmit = () => {
    let validateData: any = {};
    form.map((i) => (validateData[i.refName] = i.value));
    Validator.validate(validateData).then((err) => {
      if (!err) {
        setErrors({});
        let body = new FormData();
        for (const [key, value] of Object.entries<any>(validateData)) {
          body.append(key, value);
        }
        body.append("id", user.user_id);
        if (userProfile.type) {
          body.append("pic", userProfile as any);
        }
        dispatch(updateProfileAction(body));
      } else setErrors(err);
    });
  };

  useEffect(() => {
    _fetchProfile();
  }, []);

  useEffect(() => {
    if (!isEmpty(doctorDetails)) {
      let _form = form.map((i) => {
        let _i = { ...i };
        if (i.refName === "gender") {
          _i.value = doctorDetails.gender || "";
        } else if (i.refName === "email") {
          _i.value = doctorDetails.email || "";
        } else if (i.refName === "name") {
          _i.value = doctorDetails.name || "";
        } else if (i.refName === "lname") {
          _i.value = doctorDetails.lname || "";
        } else if (i.refName === "DOB") {
          _i.value = doctorDetails.DOB || "";
        } else if (i.refName === "residency") {
          _i.value = doctorDetails.residency || "";
        } else if (i.refName === "phone") {
          _i.value = doctorDetails.phone || "";
        } else if (i.refName === "language") {
          _i.value = doctorDetails.language || "";
        }
        return _i;
      });
      setForm(_form);
    }
  }, [doctorDetails]);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <InnerHeader title="Profile" backBtn={true} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 20 }}
        >
          <TouchableOpacity
            style={[commonStyles.boxShadow, styles.avatarContainer]}
            onPress={() => {
              actionSheet.current.show({
                title: "Select Image",
                options: ["Camera", "Gallery", "Cancel"],
                cancelButtonIndex: 2,
                onSelect: (index: any) => {
                  switch (index) {
                    case 0:
                      imageCamera().then((image: any) => {
                        setProfile(image);
                        actionSheet.current.close();
                      });
                      break;

                    case 1:
                      imagePicker({
                        multiple: false,
                        minFiles: 1,
                        maxFiles: 1,
                      }).then((image: any) => {
                        setProfile(image);
                        actionSheet.current.close();
                      });
                      break;

                    default:
                      break;
                  }
                },
              });
            }}
          >
            <Image
              source={user?.pic ? userProfile : IMAGES.avatar_placeholder}
              // source={userProfile}
              defaultSource={IMAGES.avatar_placeholder}
              style={styles.avatar}
              resizeMode="cover"
            />

            <View style={styles.avatarBtn}>
              <FaIcon name="camera" color={COLORS.primary} size={15} />
            </View>
          </TouchableOpacity>

          {form.map((i: any, index) => {
            switch (i.type) {
              case "text":
                return (
                  <InputText
                    {...i}
                    isPressable={i.refName.toLowerCase() === "gender"}
                    key={index}
                    onPress={() => setModalState(true)}
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
              case "datetime":
                return (
                  <InputDateTime
                    {...i}
                    key={index}
                    title={i.label}
                    error={errors[i.refName]}
                    style={{ marginVertical: 10, padding: 15 }}
                    onChange={(text: string) => {
                      form[index].value = text; //moment(text).format('YYYY-MM-DD');
                      setForm([...form]);
                    }}
                    inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                    onSubmitEditing={() => {
                      i.focusName && inputRefs.current[i.focusName].focus();
                    }}
                  />
                );
              default:
                break;
            }
          })}

          <Button onPress={_onSubmit} label="Update Profile" />
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomSheet ref={actionSheet} />
      {modalState && (
        <DropdownModal
          title={"Select Gender"}
          onClose={() => setModalState(false)}
        >
          <FlatList
            data={["Male", "Female"]}
            ItemSeparatorComponent={() => <View style={styles.separtor} />}
            renderItem={({ item, index }) => (
              <DropdownListItem
                selected={item === form[5].value}
                title={item}
                onPress={() => {
                  setModalState(false);
                  form[5].value = item;
                  setForm([...form]);
                }}
              />
            )}
          />
        </DropdownModal>
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  separtor: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  avatarContainer: {
    borderWidth: 5,
    borderColor: "#fff",
    // width: 110,
    // height: 110,
    borderRadius: 55,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    borderRadius: Math.round(
      Dimensions.get("window").width + Dimensions.get("window").height
    ),
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").width * 0.25,
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

export default ProfileSettings;
