import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { navigationRef } from "./RootNavigation";
import { DrawerContent } from "./DrawerContent";

import Splash from "../containers/Splash";
import Login from "../screens/auth/Login";
import Welcome from "../screens/auth/Welcome";
import Signup from "../screens/auth/Signup";
import Verification from "../screens/auth/Verification";
import ContactInfo from "../screens/auth/ContactInfo";
import AlergyInfo from "../screens/auth/AlergyInfo";
import BloodType from "../screens/auth/BloodType";
import MedicalHistory from "../screens/auth/MedicalHistory";
import SurgicalHistory from "../screens/auth/SurgicalHistory";
import FamilyHistory from "../screens/auth/FamilyHistory";
import SocialInfo from "../screens/auth/SocialInfo";
import Medication from "../screens/auth/Medication";
import SelfAssessment from "../screens/auth/SelfAssessment";
import UploadProfile from "../screens/auth/UploadProfile";

import Home from "../screens/patient/Home";
import ElectronicCard from "../screens/patient/ElectronicCard";
import SelectPhysician from "../screens/patient/SelectPhysician";
import PhysicianDetail from "../screens/patient/PhysicianDetail";
import Pricing from "../screens/patient/Pricing";
import Payment from "../screens/patient/Payment";
import MyMedicalHistory from "../screens/patient/MyMedicalHistory";
import EditMedicalHistory from "../screens/patient/MyMedicalHistory/EditMedicalHistory";
import MyPrescription from "../screens/patient/MyPrescription";
import MyOrder from "../screens/patient/MyOrder";
import TestResults from "../screens/patient/TestResults";
import ProfileSettings from "../screens/patient/ProfileSettings";

import ConsultantProfileSettings from "../screens/physician/ProfileSettings";
import Consultations from "../screens/physician/Consultations";
import Call from "../screens/physician/Call";
import Chat from "../screens/physician/Chat";
import { RootState } from "../store/reducers";
import { Platform, TouchableOpacity } from "react-native";
import Config from "react-native-config";
import NetworkLogScreen from "../screens/networkLogScreen";
import CreatePassword from "../screens/auth/CreatePassword";
import ForgotPassword from "../screens/auth/ForgotPassword";
import Toast from "../components/atoms/Toast";
import DebuggerButton from "../components/atoms/debuggerButton";
import MyConsultantations from "../screens/patient/MyConsultantations";
import ConsultantDetails from "../screens/patient/ConsultantDetails";
import VoiceCall from "../screens/videoCall";
import { getItem } from "../utils/localStorage";
import {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallFloatingMinimizedView,
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from "@zegocloud/zego-uikit-prebuilt-call-rn";

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  // const dispatch = useDispatch();
  const { splash } = useSelector((state: RootState) => state.AppReducer);

  const { user, userType, token } = useSelector(
    (state: RootState) => state.UserReducer
  );
  if (splash) return <Splash />;
  return (
    <NavigationContainer ref={navigationRef}>
      <ZegoCallInvitationDialog />
      {token ? (
        userType === 1 ? (
          <PatientNavigation />
        ) : (
          <PhysicianNavigation />
        )
      ) : (
        <AuthNavigation />
      )}
      {__DEV__ && <DebuggerButton />}
      <Toast />
      <ZegoUIKitPrebuiltCallFloatingMinimizedView />
    </NavigationContainer>
  );
};

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Network" component={NetworkLogScreen} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="CreatePassword" component={CreatePassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="ContactInfo" component={ContactInfo} />
      <Stack.Screen name="AlergyInfo" component={AlergyInfo} />
      <Stack.Screen name="BloodType" component={BloodType} />
      <Stack.Screen name="MedicalHistory" component={MedicalHistory} />
      <Stack.Screen name="SurgicalHistory" component={SurgicalHistory} />
      <Stack.Screen name="FamilyHistory" component={FamilyHistory} />
      <Stack.Screen name="SocialInfo" component={SocialInfo} />
      <Stack.Screen name="Medication" component={Medication} />
      <Stack.Screen name="SelfAssessment" component={SelfAssessment} />
      <Stack.Screen name="UploadProfile" component={UploadProfile} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const PatientStack = createNativeStackNavigator();
const CommonStack = createNativeStackNavigator();
const CommonStacks = () => (
  <>
    <CommonStack.Navigator>
      <CommonStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
      />
      <CommonStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
      />
    </CommonStack.Navigator>
  </>
);
const CustomerDrawer = () => (
  <Drawer.Navigator
    initialRouteName="DrawerHome"
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{
      drawerStyle: { width: "100%" },
      headerShown: false,
    }}
  >
    <Drawer.Screen name="DrawerHome" component={Home} />
  </Drawer.Navigator>
);
const PatientNavigation = () => {
  return (
    <PatientStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <PatientStack.Screen name="Home" component={CustomerDrawer} />
      <PatientStack.Screen name="ElectronicCard" component={ElectronicCard} />
      <PatientStack.Screen
        name="MyMedicalHistory"
        component={MyMedicalHistory}
      />
      <PatientStack.Screen
        name="EditMedicalHistory"
        component={EditMedicalHistory}
      />
      <PatientStack.Screen name="MyPrescriptions" component={MyPrescription} />
      <PatientStack.Screen name="MyOrders" component={MyOrder} />
      <PatientStack.Screen name="TestResults" component={TestResults} />
      <PatientStack.Screen name="ProfileSettings" component={ProfileSettings} />
      <PatientStack.Screen
        name="MyConsultantations"
        component={MyConsultantations}
      />
      <PatientStack.Screen
        name="ConsultantDetails"
        component={ConsultantDetails}
      />

      <PatientStack.Screen name="SelectPhysician" component={SelectPhysician} />
      <PatientStack.Screen name="PhysicianDetail" component={PhysicianDetail} />
      <PatientStack.Screen name="Pricing" component={Pricing} />
      <PatientStack.Screen name="Payment" component={Payment} />

      <PatientStack.Screen name="Call" component={Call} />
      <PatientStack.Screen name="Chat" component={Chat} />
      <PatientStack.Screen name="Network" component={NetworkLogScreen} />
      <PatientStack.Screen name="VideoCall" component={VoiceCall} />
      <PatientStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
      />
      <PatientStack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
      />
    </PatientStack.Navigator>
  );
};

const PhysicianNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Consultations"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: "100%" },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Consultations" component={ConsultationStack} />
      <Drawer.Screen
        name="ConsultantProfileSettings"
        component={ConsultantProfileSettings}
      />
    </Drawer.Navigator>
  );
};

const ConsultationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Consultations"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={
        {
          drawerStyle: { width: "100%" },
          headerShown: false,
        } as any
      }
    >
      <Stack.Screen name="Network" component={NetworkLogScreen} />
      {/* <Stack.Screen name="Home" component={Consultations} /> */}
      <Stack.Screen name="Consultations" component={Consultations} />
      <Stack.Screen name="ElectronicCard" component={ElectronicCard} />
      <Stack.Screen name="Call" component={Call} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="VideoCall" component={VoiceCall} />
      <Stack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallWaitingScreen"
        component={ZegoUIKitPrebuiltCallWaitingScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        // DO NOT change the name
        name="ZegoUIKitPrebuiltCallInCallScreen"
        component={ZegoUIKitPrebuiltCallInCallScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
