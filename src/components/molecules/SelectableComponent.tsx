import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants";
import { Typography } from "../atoms/Typography";

export const SelectableComponent = (props) => {

  const {
    data = [],
    mode = "single",
    selected = [],
    setSelected = () => { },
    tabStyle = {}
  } = props;

  const onSelect = (id) => {
    if (mode == "single") {
      const index = selected.findIndex((e) => e === id);
      if (index !== -1) {
        setSelected([]);
      }
      else {
        setSelected([id])
      }
    } else {
      const index = selected.findIndex((e) => e === id);

      if (index !== -1) {
        selected.splice(index, 1);
        setSelected([...selected]);
      } else {
        setSelected([...selected, id]);
      }
    }
  };

  return (
    <View
      style={{
        marginVertical: 10,
        justifyContent: "space-between",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      {data.length > 0 &&
        data.map((item) => {
          const bgColor = selected.includes(item.id) ? COLORS.secondary : "#fff";
          const txtColor = selected.includes(item.id) ? "#fff" : "#8292BB";
          const borderColor = selected.includes(item.id) ? COLORS.secondary : "#8292BB";
          return (
            <TouchableOpacity
              onPress={() => onSelect(item.id)}
              style={[styles.selectBtn, tabStyle, {
                borderColor: borderColor, backgroundColor: bgColor
              }]}
            >
              <Typography
                size={12}
                align="center"
                color={txtColor}
              >
                {item.title}
              </Typography>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  selectBtn: {
    paddingVertical: 10,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
    width: '32%'
  },
});
