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

const TipModal = (props: Props) => {

  const {
    visibility,
    title = 'Do you want to add a tip?',
    onSubmit = () => {},
    onClose = () => {}
  }: any = props;

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("Required");

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
              value={ amount }
              placeholder={'Amount should be greater the 1'}
              onChangeText={ setAmount }
              multiline={true}
              maxLength={3}
              keyboardType={'number-pad'}
              onSubmitEditing={ () => Keyboard.dismiss() }
              error={ error }
            />
            <Button
              label={'Submit'}
              style={{ width: '80%' }}
              disabled={ amount === "" || amount < 1 }
              onPress={ () => {
                if( parseInt(amount) < 1 ){
                  setError('Amount should be greater the 1');
                }else if( amount.toString().length == 0 ){
                  setError('Required*');
                }else{
                  onSubmit( amount );
                } 
              }}
            />            
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
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

export default TipModal;
