import React from "react";
import { View, TextInput } from "react-native";
import { COLORS, FONTS, FONTSIZE } from "../../constants";
import AdIcon from "react-native-vector-icons/AntDesign";

export const SearchBar = () => {
  return (
    <View
      style={{
        marginVertical: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: COLORS.lightBlack,
        paddingHorizontal: 15,
        flexDirection: "row",
      }}
    >
      <TextInput
        style={{
          flex: 1,
          fontSize: FONTSIZE.S,
          fontFamily: FONTS.PoppinsRegular,
          color: COLORS.white,
          paddingVertical: 15,
        }}
        placeholderTextColor={COLORS.darkGray}
        placeholder={"Serach Here"}
      />
      <View
        style={{
          margin: 10,
          justifyContent: "center",
          borderLeftColor: COLORS.halfWhite,
          borderLeftWidth: 1,
        }}
      >
        <AdIcon
          name={"search1"}
          size={20}
          style={{ marginLeft: 20 }}
          color={COLORS.halfWhite}
        />
      </View>
    </View>
  );
};
