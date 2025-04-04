import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import FaIcon from "react-native-vector-icons/FontAwesome5";

import { COLORS, IMAGES, IMAGE_URL } from "../constants";
import { Typography } from "../components/atoms";
import {
  BusinessCard,
  CalendarIcon,
  CapsuleIcon,
  CardIcon,
  DoctorIcon,
  HomeIcon,
  LogoutIcon,
  SettingIcon,
  SearchIcon,
} from "../components/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorDetailsAction,
  updateUserStates,
} from "../store/actions/UserActions";
import { navigate, replace } from "./RootNavigation";
import { removeItem } from "../utils/localStorage";
import { onUserLogout } from "../utils/ZegoCloudConfig";
import { updateScreenStates } from "../store/actions/ChatActions";
import { fetchPhysicianPatients } from "../store/actions/PhysicianActions";
import { hp } from "../utils/responsive";
import { getPatientProfileApi } from "../store/services/Services";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export const DrawerContent = (props) => {
  const dispatch = useDispatch();
  const { userType } = useSelector((state) => state.UserReducer);
  const { user } = useSelector((state) => state.UserReducer);

  const { doctorDetails } = useSelector((state) => state.ConsultantReducer);

  const [items, setItems] = useState(
    (userType === 1 && PATIENTMENU) || (userType === 2 && PHYSICIANMENU)
  );

  const _fetchProfile = () => {
    dispatch(fetchDoctorDetailsAction({ id: user.user_id }));
  };
  const isFouscued = props?.navigation?.isFocused();

  const isfoc = useIsFocused();

  const useFinc = async () => {
    let body = {
      id: user.user_id,
      user_type: userType,
    };
    _fetchProfile();
    const response = await getPatientProfileApi(body);

    console.log("slkdbvlksbdklvbskdlbsdbvklsdbvklsdbklv", response);
  };

  useFocusEffect(
    useCallback(() => {
      useFinc();
    }, [])
  );

  useEffect(() => {
    useFinc();
  }, [isFouscued, doctorDetails?.pic, user?.pic, isfoc]);

  console.log(
    "useruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruserskjdbvklsbdkl",
    // props?.navigation?.toggleDrawer(),
    isfoc
  );
  // let imagePath = Boolean(user?.pic || doctorDetails?.pic)
  //   ? {
  //       uri: IMAGE_URL + user?.pic,
  //       // ((userType === 1 && user?.pic) ||
  //       //   (userType === 2 && doctorDetails?.pic)),
  //     }
  //   : IMAGES.avatar_placeholder;

  const onLogout = () => {
    Alert.alert("LOGOUT!", "Are you sure you want to logout?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          onUserLogout();
          await removeItem("user_data");
          dispatch(updateUserStates({ token: false }));
        },
      },
    ]);
  };

  const ImageView = useCallback(() => {
    let imagePath = Boolean(user?.pic || doctorDetails?.pic)
      ? {
          uri:
            IMAGE_URL +
            ((userType === 1 && user?.pic) ||
              (userType === 2 && doctorDetails?.pic)),
        }
      : IMAGES.avatar_placeholder;
    return (
      <Image
        source={imagePath}
        // source={IMAGES.avatar_placeholder}
        defaultSource={IMAGES.avatar_placeholder}
        resizeMode="contain"
        style={{
          borderRadius: Math.round(
            Dimensions.get("window").width + Dimensions.get("window").height
          ),
          width: Dimensions.get("window").width * 0.15,
          height: Dimensions.get("window").width * 0.15,
        }}
      />
    );
  }, [doctorDetails?.pic, user?.pic]);

  return (
    <DrawerContentScrollView
      style={{ flex: 1, backgroundColor: COLORS.primary, padding: 30 }}
    >
      <ScrollView>
        <TouchableOpacity style={styles.header} activeOpacity={1}>
          <ImageView />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Typography color="#fff" size={20}>
              {`${user.name} ${user.lname || ""}`}
            </Typography>
            <Typography color="#fff" textType="light" size={12}>
              {userType == 1 ? "Patient" : "Physician"}
            </Typography>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => props.navigation.closeDrawer()}
          >
            <FaIcon name="times-circle" color="#fff" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>

        {items.map((i, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => {
              console.log(
                "userTypeuserTypeuserTypeuserTypeuserType",
                userType,
                i
              );
              dispatch(
                updateScreenStates({
                  routeName: i.navigateTo,
                  title: i.params.title,
                })
              );
              // props.navigation.closeDrawer();
              // replace(i.navigateTo, i.params);

              if (i.navigateTo === "Home") {
                props.navigation.closeDrawer();
              } else {
                dispatch(
                  updateScreenStates({
                    routeName: i.navigateTo,
                    title: i.params.title,
                  })
                );
                dispatch(
                  fetchPhysicianPatients({
                    payload: i.params.title ?? "Scheduled Consultations",
                  })
                );
                props.navigation.closeDrawer();
                // replace(i.navigateTo, i.params);

                props.navigation.navigate(i.navigateTo, i.params);
              }
              // i.navigateTo === "Home"
              //   ? props.navigation.closeDrawer()
              //   : props.navigation.navigate(i.navigateTo, i.params);
            }}
          >
            {i.icon}
            <Typography
              color="#fff"
              textType="light"
              style={{ marginLeft: 20 }}
            >
              {i.title}
            </Typography>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.drawerItem} onPress={onLogout}>
          <LogoutIcon />
          <Typography color="#fff" textType="light" style={{ marginLeft: 20 }}>
            Logout
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  closeBtn: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  drawerItem: {
    flexDirection: "row",
    marginTop: 35,
  },
});

const PATIENTMENU = [
  {
    title: "My Medical History",
    navigateTo: "MyMedicalHistory",
    params: {},
    icon: <CalendarIcon />,
  },
  {
    title: "Request A Consultation",
    navigateTo: "Home",
    params: {},
    icon: <HomeIcon />,
  },
  {
    title: "My Consultation",
    navigateTo: "MyConsultantations",
    params: {},
    icon: <DoctorIcon />,
  },
  {
    title: "My Prescriptions",
    navigateTo: "MyPrescriptions",
    params: {},
    icon: <CapsuleIcon />,
  },
  {
    title: "My Orders",
    navigateTo: "MyOrders",
    params: {},
    icon: <CardIcon />,
  },
  {
    title: "My Test Result",
    navigateTo: "TestResults",
    params: {},
    icon: <SearchIcon />,
  },
  {
    title: "Account Settings",
    navigateTo: "ProfileSettings",
    params: {},
    icon: <SettingIcon />,
  },
  {
    title: "Electronic Complaint Card",
    navigateTo: "ElectronicCard",
    params: {},
    icon: <BusinessCard />,
  },
];

const PHYSICIANMENU = [
  {
    title: "Scheduled Consultations",
    navigateTo: "Consultations",
    params: { title: "Scheduled Consultation" },
    icon: <CalendarIcon />,
  },
  {
    title: "Past Consultations",
    navigateTo: "Consultations",
    params: { title: "Past Consultations" },
    icon: <CalendarIcon />,
  },
  {
    title: "All Consultations",
    navigateTo: "Consultations",
    params: { title: "All Consultations" },
    icon: <DoctorIcon />,
  },
  {
    title: "Account Settings",
    navigateTo: "ConsultantProfileSettings",
    params: {},
    icon: <SettingIcon />,
  },
];
