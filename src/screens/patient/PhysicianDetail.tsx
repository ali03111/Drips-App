import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES, IMAGE_URL, PAYMENT_URL } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import { renderStars } from "../../utils/utils";
import { ConsultantItem } from "../../store/models";
import { WebView } from "react-native-webview";
import {
  createBookingReqAction,
  getConsultantDetailAction,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";

const PhysicianDetail = (props) => {
  const dispatch = useDispatch();
  const { apointmentData } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  const [showPayment, setPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const { item, bookingType }: { item: ConsultantItem; bookingType?: string } =
    props.route.params;
  const address = item.address || "N/A";
  const imagePath =
    (item.pic && { uri: IMAGE_URL + item.pic }) || IMAGES.avatar_placeholder;
  const updatePaymentUrl = (type: string) => {
    let url = `${PAYMENT_URL}${item.user_id}?type=${type}`;
    setPaymentUrl(url);
    setPayment(true);
  };

  const _fetchPhysicianProfile = () => {
    let data = {
      id: item.id,
    };
    dispatch(getConsultantDetailAction(data));
  };

  useEffect(() => {}, []);

  const _onBookNow = async () => {
    let _bookingDetails = { ...apointmentData };
    _bookingDetails.doctor_id = item.user_id;
    let body = new FormData();
    for (const [key, value] of Object.entries<any>(_bookingDetails)) {
      body.append(key, value);
    }
    dispatch(createBookingReqAction(body));
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader
          title="Physician Detail"
          drawerBtn={false}
          backBtn={true}
        />
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={{ flexDirection: "row" }}>
              <Image
                defaultSource={IMAGES.avatar_placeholder}
                source={imagePath}
                style={styles.profileImg}
              />

              <View style={styles.cardDetail}>
                <Typography size={16} textType="semiBold">
                  {item.name}
                </Typography>
                <Typography size={12} color={COLORS.placeholderColor}>
                  Medical School: {item.medical_school || "N/A"}
                </Typography>
                {/* <Typography>{item.customer_status}</Typography> */}

                {/* bookingType!=='booking' && <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: 180,
                  }}
                >
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#4cd2fd" }]}
                    // onPress={ () => props.navigation.navigate('Pricing') }
                    onPress={ () => updatePaymentUrl('chat') }
                  >
                    <Typography color="#fff" size={12} style={{ padding: 0 }}>
                      Chat
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#ff2076" }]}
                    onPress={ () => updatePaymentUrl('voicechat') }
                  >
                    <Typography color="#fff" size={12} style={{ padding: 0 }}>
                      Voice Call
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#feb524" }]}
                    onPress={ () => updatePaymentUrl('videochat') }
                  >
                    <Typography color="#fff" size={12} style={{ padding: 0 }}>
                      Video Call
                    </Typography>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>

            <Typography
              color={COLORS.placeholderColor}
              style={{ marginTop: 20 }}
            >
              Residency:{item.residency || "N/A"}
            </Typography>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Typography size={12} color={COLORS.rating}>
                {" "}
                {item.customer_status || 1} (100){" "}
              </Typography>
              {renderStars(item.customer_status || 1)}
            </View>

            <View style={commonStyles.separator} />

            <Typography>Address</Typography>
            <Typography color={COLORS.placeholderColor} size={12}>
              {address}
            </Typography>

            <View style={commonStyles.separator} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Typography>Mon-Wed</Typography>
              <Typography>10:00 AM - 12:00 PM</Typography>
            </View>
          </View>
          <View style={{ margin: 20 }}>
            <Button label={`Book Appointment`} onPress={_onBookNow} />
          </View>
        </View>
      </View>
      {showPayment && (
        <Modal transparent animationType="slide">
          <SafeAreaContainer style={styles.paymentContainer}>
            <InnerHeader
              onBackPress={() => setPayment(false)}
              backBtn
              title="Payment"
            />
            <View style={{ flex: 1 }}>
              <WebView source={{ uri: paymentUrl }} />
            </View>
          </SafeAreaContainer>
        </Modal>
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
  ribbon: {
    backgroundColor: COLORS.primary,
    marginHorizontal: -20,
  },
  card: {
    ...commonStyles.boxShadow,
    backgroundColor: "#fff",
    marginVertical: 15,
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  profileImg: {
    width: 110,
    height: 145,
    borderRadius: 10,
  },
  cardDetail: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
  },
  actionBtn: {
    margin: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PhysicianDetail;