import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Keyboard, Image } from "react-native";
import { COLORS, FONTS, FONTSIZE, IMAGES } from "../../constants";
import Icon from "react-native-vector-icons/AntDesign";
import { Button, InputText, Typography } from "../atoms";

type Props = {
  visibility: Boolean;
  title: String;
  desc?: String;
  onSubmit: any;
}

const PopupModal = (props: Props) => {

  const {
    visibility,
    title = 'Cancellation Reason',
    desc = 'Cancellation Reason',
    onSubmit = () => {},
  }: any = props;

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

            <View style={{ 
              backgroundColor: '#e3f0f8', 
              marginTop: 10,
              width: 150, 
              height: 150,
              borderRadius: 80,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center'
            }}>
              <Image
                source={IMAGES.tick} 
                style={{width: 70, height: 70 }} 
                resizeMode={'contain'} 
              />
            </View>

            <Typography textType="semiBold" size={ 24 } style={{ marginVertical: 20 }}>
              { title }
            </Typography>

            <Typography textType="light" size={ 16 } align="center" style={{ marginBottom: 10 }}>
              { desc }
            </Typography>
            
            <Button
              label={'Done'}
              style={{ width: '80%' }}
              onPress={ () => {
                onSubmit();
              } }
            />            
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
  }
});

export default PopupModal;
