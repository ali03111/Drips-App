import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants";
import { Typography } from "./Typography";
import { commonStyles } from '../../style';

interface Props {
  label: string,
  backgroundColor?: string,
  onPress?: () => void,
  borderRadius?: number
  borderWidth?: number
  disabled?: boolean
  style?: {}
  btnStyle?: {}
  isGradient?: boolean
  rightIcon?: JSX.Element
  textColor?: string,
  borderColor?: string,
}

export const Button = (props: Props) => {

  const {
    onPress,
    backgroundColor = COLORS.primary,
    label,
    disabled = false,
    style = {},
    btnStyle = {},
    rightIcon = null,
    textColor = '#fff',
    borderColor = COLORS.primary,
    borderWidth = 0,
    borderRadius = 50,
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.5}
      style={style}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: disabled ? COLORS.halfWhite : backgroundColor,
            borderRadius: borderRadius,
            borderColor: borderColor,
            borderWidth: borderWidth
          },
          btnStyle
        ]}>
        <Typography color={textColor} size={14}>{`${label} `}</Typography>
        {rightIcon && rightIcon}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginVertical: 5,
    flexDirection: 'row',
    ...commonStyles.boxShadow
  },
});
