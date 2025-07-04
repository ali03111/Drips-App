import {
  View,
  Text,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { COLORS, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../components/atoms";
import { Button } from "../../components/atoms";
import { hp } from "../../utils/responsive";
import WebView from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientDetailsAction } from "../../store/actions/UserActions";

const EccPaymentScreen = () => {
  const { user, userType, token } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();

  const fetchDetail = () => {
    dispatch(fetchPatientDetailsAction());
  };

  const [showPayment, setPayment] = useState(false);

  return (
    <SafeAreaContainer safeArea={true}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }} />
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{ width: "30%", height: 100 }}
              resizeMode={"contain"}
            />

            <Typography
              size={20}
              color={COLORS.primary}
              style={{ fontWeight: "bold" }}
            >
              {"ECC Registration Fee:"}
            </Typography>
            <Typography size={15} color={COLORS.black}></Typography>
            <Typography size={15} color={COLORS.black}>
              One-Time Fee for Exclusive Benefits
            </Typography>
            <Typography size={15} color={COLORS.black}></Typography>
            <Typography size={12} color={COLORS.darkGray}>
              The Electronic Complaint Card (ECC) is a media enhanced digital
              card that contains a summary of your medical and surgical history,
              which allows you upload media files like your lab test results for
              instant review by a doctor.
            </Typography>
            <Typography size={12} color={COLORS.darkGray}></Typography>
            <Typography size={12} color={COLORS.darkGray}>
              It also allows a real-time edit of this information, with each
              consultation providing the most up to date information of your
              clinical status.
            </Typography>
            <Typography size={12} color={COLORS.darkGray}></Typography>
            <Typography size={12} color={COLORS.darkGray}>
              Registration of the ECC is a one-time fee for new users, and it
              becomes a permanent folder in your medical records with DRIPS.
            </Typography>
            <Typography size={15} color={COLORS.black}></Typography>
            <Typography
              size={12}
              color={COLORS.darkGray}
              style={{ marginVertical: hp("0.5") }}
            >
              • One-time payment - No subscriptions
            </Typography>
            <Typography
              size={12}
              color={COLORS.darkGray}
              style={{ marginVertical: hp("0.5") }}
            >
              • Allows access to your patient portal
            </Typography>
            <Typography
              size={12}
              color={COLORS.darkGray}
              style={{ marginVertical: hp("0.5") }}
            >
              • Used each time when booking a consultation with a doctor
            </Typography>
            <Typography
              size={12}
              color={COLORS.darkGray}
              style={{ marginVertical: hp("0.5") }}
            ></Typography>
            <Typography
              size={12}
              color={COLORS.darkGray}
              style={{ marginVertical: hp("0.5") }}
            >
              *Complete your payment now to activate your ECC and get started
            </Typography>

            <View style={{ marginTop: hp("3") }}>
              <Button label={"Pay Now"} onPress={() => setPayment(true)} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      {showPayment && (
        <Modal onRequestClose={fetchDetail} transparent animationType="slide">
          <SafeAreaContainer style={styles.paymentContainer}>
            <InnerHeader
              onBackPress={() => {
                setPayment(false);
                fetchDetail();
              }}
              backBtn
              title="Payment"
            />
            <View style={{ flex: 1 }}>
              <WebView
                source={{
                  uri: `https://dripsmedical.com/custom-portal/ecc-payment/${user?.user_id}`,
                }}
              />
            </View>
          </SafeAreaContainer>
        </Modal>
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 80,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    height: hp("80"),
  },
  separtor: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  paymentContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
});

export default EccPaymentScreen;
