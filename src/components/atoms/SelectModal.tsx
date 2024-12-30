import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { COLORS, FONTS, FONTSIZE, screenHeight } from "../../constants";
import { Typography } from "./Typography";
import Icon from "react-native-vector-icons/AntDesign";

type Props = {
  visibility: Boolean;
  title: String;
  options: Array<{}>;
  onSelect: () => {};
  returnType?: string;
};

const SelectModal = (props: Props) => {
  const {
    visibility,
    title,
    options = [],
    onSelect = () => {},
    returnType = null,
    onClose = () => {},
  }: any = props;

  return (
    <Modal animationType="fade" transparent={true} visible={visibility}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Icon name="close" size={25} color={"#fff"} />
          </TouchableOpacity>

          <Typography
            textType="semiBold"
            size={FONTSIZE.M}
            style={{ marginBottom: 10 }}
            align="center"
          >
            {title}
          </Typography>
          <ScrollView showsVerticalScrollIndicator={false} >
            {options &&
              options.map((i: any, index: number) => (
                <TouchableOpacity
                  style={{ marginVertical: 15 }}
                  onPress={() => {
                    returnType === "object" ? onSelect(i) : onSelect(i.title);
                  }}
                  key={index}
                >
                  <Typography align="center">{i?.title}</Typography>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    maxHeight: screenHeight(85),
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
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

export default SelectModal;
