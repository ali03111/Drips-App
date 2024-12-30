import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Keyboard } from "react-native";
import { COLORS, FONTS, FONTSIZE } from "../../constants";
import Icon from "react-native-vector-icons/AntDesign";
import { Button, InputText, Typography } from "../atoms";

type Props = {
  visibility: Boolean;
  title: String;
  onSubmit: any;
  onClose: any;
}

const ReasonModal = (props: Props) => {

  const {
    visibility,
    title = 'Cancellation Reason',
    required = false,
    onSubmit = () => {},
    onClose = () => {}
  }: any = props;

  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  return (
    <Modal
        animationType='fade'
        transparent={true}
        visible={visibility}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={styles.modalView}>
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={onClose}
              style={ styles.closeButton }
            >
              <Icon name="close" size={25} color={'#fff'} />
            </TouchableOpacity>

            <Typography textType="semiBold" size={ FONTSIZE.M } style={{ marginBottom: 10 }}>
              { title }
            </Typography>
            <InputText 
              style={{ width: '90%' }}
              value={ reason }
              onChangeText={ setReason }
              multiline={true}
              maxLength={255}
              onSubmitEditing={ () => Keyboard.dismiss() }
            />
            <Typography textType="light" size={12} color={COLORS.danger} style={{
              alignSelf: 'left',
              paddingHorizontal: 20
            }}>
              { err }
            </Typography>
            
            <Button
              label={'Submit'}
              style={{ width: '80%' }}
              onPress={ () => {
                setErr("")
                if(!reason.length){
                  setErr("Required*")
                  return;
                }
                onSubmit( reason );
              } }
            />            
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: 20
  }
});

export default ReasonModal;
