import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, FONTS, FONTSIZE, IMAGES, THEME } from "../../constants";
import { ThemeContext } from "../../context";
const { width } = Dimensions.get("window");

const Popup = (props) => {
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    visible,
    setVisible,
    title,
    disricption,
    optionOne,
    optionTwo,
    onClose = () => {},
    onPressOne = () => {},
    onPressTwo = () => {},
    mainViewStyles,
    modalBodyStyles,
    modalView,
    twoOptions = true,
    firstColor,
    secondColor,
    crossIcon = true,
  } = props;
  return (
    // <View style={[styles.centeredView]}>
    <Modal animationType="fade" transparent={true} visible={visible}>
      {twoOptions !== false ? (
        <View style={[styles.centeredView, mainViewStyles]}>
          <View style={[styles.modalView, modalBodyStyles]}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                // backgroundColor: theme.primary,
                borderRadius: 50,
              }}
            >
              {crossIcon == true && (
                // <Icon
                //   name='close'
                //   size={30}
                //   color={theme.white}
                //   onPress={onClose}
                // />
                <Image
                  source={IMAGES.crossImg}
                  style={{ width: 30, height: 30, color: THEME.primary }}
                  resizeMode="center"
                />
              )}
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={styles.modalHeading}>{title}</Text>
              <Text style={styles.modalText}>{disricption}</Text>
            </View>

            <TouchableOpacity style={[styles.button]} onPress={onPressOne}>
              <Text
                style={[
                  styles.textStyle,
                  { transform: [{ scale: 1.2 }], color: firstColor },
                ]}
              >
                {optionOne}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { borderTopWidth: 0 }]}
              onPress={onPressTwo}
            >
              <Text
                style={[
                  styles.textStyle,
                  { transform: [{ scale: 1.2 }], color: secondColor },
                ]}
              >
                {optionTwo}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        modalView
      )}
    </Modal>
    // </View>
  );
};
const createStyles = (theme) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width: width / 1.3,
      backgroundColor: "white",
      borderRadius: 20,
      paddingTop: 25,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeading: {
      fontFamily: FONTS.SFProTextSemiBold,
      fontSize: FONTSIZE.L,
      color: theme.black,
      textAlign: "center",
    },
    modalText: {
      fontFamily: FONTS.SFProTextRegular,
      fontSize: FONTSIZE.S,
      color: theme.black,
      textAlign: "center",
    },
    button: {
      width: "100%",
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: theme.darkGray,
      borderBottomColor: theme.darkGray,
      paddingVertical: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    textStyle: {
      fontFamily: FONTS.SFProTextRegular,
      fontSize: FONTSIZE.S,
    },
  });
export default Popup;
