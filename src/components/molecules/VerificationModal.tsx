import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/FontAwesome5";


import { COLORS } from "../../constants";
import { FixedHeader } from "../atoms";
import { useDispatch, useSelector } from "react-redux";
import { getCards, getWallet, updateStates } from "../../store/actions/UserActions";
import { showToast } from "../../store/actions/AppActions";
import { navigate, onBack } from "../../navigation/RootNavigation";
import { selectCards, selectWallet } from "../../store/selectors/userSelector";

const VerificationModal = (props: any) => {
  const dispatch = useDispatch();

  const {
    visible = false,
    url = null,
    type = null,
    data = {},
  } = useSelector((state: any) => state.UserReducer.verification);
  const cards = useSelector( selectCards );

  const onMessage = (event: any) => {

    if (event.nativeEvent.data === "succeeded") {
      switch (type) {
        case "card":
          dispatch( getCards() );
          dispatch(showToast("Card added successfully"));
          onBack();
          break;

        case "booking":
          dispatch( showToast("Booked successfully") );
          navigate('Thankyou');
          break;

        case "booking":
          dispatch( showToast("Invoice paid successfully") );
          navigate('Thankyou');
          break;

        case "topup":
          dispatch( showToast("Paid successfully") );
          dispatch( getWallet() );
          navigate('TopupSuccess');
          break;

        default:
          navigate('Thankyou');
          break;
      }
    } else {
      dispatch(showToast("Transaction Failed"));
    }

    dispatch(
      updateStates({
        verification: {
          visible: false,
          url: null,
          type: null,
          data: {},
        },
      })
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalView}>
        {/* {loading && <Loader />} */}
        <FixedHeader
          {...props}
          backBtn={false}
          title={"Card Verification"}
          rightIcons={ <TouchableOpacity style={{
            alignItems: 'center'
          }}
          onPress={ () => {
            dispatch(
              updateStates({
                verification: {
                  visible: false,
                  url: null,
                  type: null,
                  data: {},
                },
              })
            );
          } }
          >
            <Icon name="times" size={20} />
          </TouchableOpacity> }
        />
        {url != null && (
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            onMessage={(event) => onMessage(event)}
            onShouldStartLoadWithRequest={(request) => {
              return true;
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: '#fff'
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: 20,
  },
});

export default VerificationModal;
