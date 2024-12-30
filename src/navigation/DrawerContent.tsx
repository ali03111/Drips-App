import * as React from "react";
import {
  Alert,
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
import { updateUserStates } from "../store/actions/UserActions";
import { navigate } from "./RootNavigation";
import { RootState } from "../store/reducers";
import { removeItem, setItem } from "../utils/localStorage";
import { onUserLogout } from "../utils/ZegoCloudConfig";

export const DrawerContent = (props) => {
  const dispatch = useDispatch();
  const { userType } = useSelector((state: RootState) => state.UserReducer);
  const { user }: any = useSelector((state: RootState) => state.UserReducer);
  React.useEffect(() => {
    // alert(userType);
  }, []);

  const [items, setItems] = React.useState(
    userType === 1 ? PATIENTMENU : PHYSICIANMENU
  );
  let imagePath =
    (user.pic && { uri: IMAGE_URL + user.pic }) || IMAGES.avatar_placeholder;

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
  return (
    <DrawerContentScrollView
      style={{ flex: 1, backgroundColor: COLORS.primary, padding: 30 }}
    >
      <ScrollView>
        <TouchableOpacity style={styles.header} activeOpacity={1}>
          <Image
            source={imagePath}
            defaultSource={IMAGES.avatar_placeholder}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              resizeMode: "cover",
            }}
          />
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
            style={styles.drawerItem}
            onPress={() =>
              i.navigateTo === "Home"
                ? props.navigation.closeDrawer()
                : navigate(i.navigateTo as never, i.params as never)
            }
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
    title: "Request A Consultation",
    navigateTo: "Home",
    params: {},
    icon: <HomeIcon />,
  },
  {
    title: "My Medical History",
    navigateTo: "MyMedicalHistory",
    params: {},
    icon: <CalendarIcon />,
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
    title: "Electronic Complaint Card",
    navigateTo: "ElectronicCard",
    params: {},
    icon: <BusinessCard />,
  },
  {
    title: "Account Settings",
    navigateTo: "ProfileSettings",
    params: {},
    icon: <SettingIcon />,
  },
];

const PHYSICIANMENU = [
  {
    title: "Scheduled Consultations",
    navigateTo: "Consultations",
    params: {
      title: "Scheduled Consultation",
    },
    icon: <CalendarIcon />,
  },
  {
    title: "Past Consultations",
    navigateTo: "Consultations",
    params: {
      title: "Past Consultations",
    },
    icon: <CalendarIcon />,
  },
  {
    title: "All Consultations",
    navigateTo: "Consultations",
    params: {
      title: "All Consultations",
    },
    icon: <DoctorIcon />,
  },
  {
    title: "Account Settings",
    navigateTo: "ConsultantProfileSettings",
    params: {},
    icon: <SettingIcon />,
  },
];
