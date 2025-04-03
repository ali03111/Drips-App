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

            <Typography size={20} color={COLORS.primary} style={{fontWeight:"bold"}} >
            {"Registration Fee \nECC Card"} 
            </Typography>
            <Typography size={15} color={COLORS.black} >
            </Typography>
            <Typography size={15} color={COLORS.black} >
            One-Time Fee for Exclusive Benefits 
            </Typography>
            <Typography size={15} color={COLORS.black} >
            </Typography>
            <Typography size={12} color={COLORS.darkGray} >
            Get your ECC Card and enjoy seamless pet| transportation and care services! Pay a onetime registration fee and unlock exclusive benefits. 
            </Typography>
            <Typography size={15} color={COLORS.black} >
            </Typography>
            <Typography size={12} color={COLORS.darkGray} style={{marginVertical:hp('0.5')}} >
            • One-time payment - No hidden charges!
            </Typography>
            <Typography size={12} color={COLORS.darkGray} style={{marginVertical:hp('0.5')}} >
            • Priority bookings & special discounts
            </Typography>
            <Typography size={12} color={COLORS.darkGray} style={{marginVertical:hp('0.5')}} >
            • Hassle-free pet transport experience
            </Typography>
            <Typography size={12} color={COLORS.darkGray} style={{marginVertical:hp('0.5')}} >
            </Typography>
            <Typography size={12} color={COLORS.darkGray} style={{marginVertical:hp('0.5')}} >
            Complete your payment now to activate your
            ECC Card and get started! *
            </Typography>

            <View style={{ marginTop: hp("10") }}>
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
                  uri: `https://webvortech.com/drips/custom-portal/ecc-payment/${user?.user_id}`,
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
