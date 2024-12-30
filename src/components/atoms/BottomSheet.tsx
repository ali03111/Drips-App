import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { COLORS, FONTSIZE } from "../../constants";
import { Typography } from "./Typography";

const BottomSheet = forwardRef((props: any, ref) => {
  const [item, setItem]: any = useState({
    title: "",
    options: [],
    onSelect: () => {},
    cancelButtonIndex: null,
    disableButtonIndexes: [],
    visibility: false,
  });

  useImperativeHandle(ref, () => ({
    show: ({
      title,
      options,
      onSelect,
      cancelButtonIndex,
      disableButtonIndexes = [],
    }: any) => {
      setItem({
        title,
        options,
        onSelect,
        cancelButtonIndex,
        disableButtonIndexes,
        visibility: true,
      });
    },
    close: () => {
      setItem({ ...item, visibility: false });
    },
  }));

  return (
    <Modal animationType="slide" transparent={true} visible={item.visibility}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={() => {
          setItem({ ...item, visibility: false });
        }}
      />
      <View style={styles.modalView}>
        <Typography
          textType="semiBold"
          size={FONTSIZE.L}
          style={{ marginBottom: 10 }}
        >
          {item.title}
        </Typography>
        {item.options.map((i: any, index: number) => (
          <TouchableOpacity
            style={{ paddingVertical: 10, marginVertical: 5, width: "100%" }}
            onPress={() => {
              if (item.cancelButtonIndex === index) {
                setItem({ ...item, visibility: false });
              } else {
                item.onSelect(index);
              }
            }}
            key={index}
            disabled={item.disableButtonIndexes.includes(index)}
          >
            <Typography
              align="center"
              color={
                (item.cancelButtonIndex === index ? 
                "red" : 
                ( item.disableButtonIndexes.includes( index ) ? 
                  COLORS.darkGray : 
                  COLORS.primary ))
              }
            >{i}</Typography>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalView: {
    bottom: 0,
    padding: 20,
    width: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    alignItems: "center",
    zIndex: 1,
  },
});

export default BottomSheet;
