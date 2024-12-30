import React from "react";
import { Text } from "react-native";
import { COLORS, FONTS, FONTSIZE } from "../../constants";

type Props = {
  textType?: "bold" | "semiBold" | "regular" | "light";
  size?: number;
  color?: string;
  align?: string;
  style?: Object;
  children: any;
  numberOfLines?: number;
  capitalize?: boolean;
  ellipsizeMode?: string;
};

export const Typography = (props: Props) => {
  const {
    textType = "regular",
    size = FONTSIZE.S,
    color = COLORS.text,
    align = "left",
    style = {},
    numberOfLines = undefined,
    capitalize = false,
    ellipsizeMode = "tail",
  } = props;

  let textStyle: any = {
    lineHeight: size * 1.6,
    fontSize: size,
    color: color,
    textAlign: align,
    textTransform: capitalize ? "capitalize" : "none",
    ...style,
  };

  switch (textType) {
    case "bold":
      textStyle.fontFamily = FONTS.PoppinsMedium;
      break;
    case "semiBold":
      textStyle.fontFamily = FONTS.PoppinsSemiBold;
      break;
    case "regular":
      textStyle.fontFamily = FONTS.PoppinsMedium;
      break;
    case "light":
      textStyle.fontFamily = FONTS.PoppinsRegular;
      break;
    default:
      textStyle.fontFamily = FONTS.PoppinsRegular;
      break;
  }

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {props.children}
    </Text>
  );
};
