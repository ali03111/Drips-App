import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { COLORS, FONTS, FONTSIZE } from "../../constants";
import { Typography } from "./Typography";
import { commonStyles } from "../../style";
import { capitalize } from "../../utils/utils";
import Icon from "react-native-vector-icons/FontAwesome5";
import { startCase } from "lodash";
export const InputText = (props) => {
  const {
    label = null,
    error,
    placeholder,
    placeholderColor = COLORS.halfWhite,
    onChangeText = () => {},
    onKeyPress = () => {},
    value,
    autoCapitalize,
    keyboardType = "default",
    returnKeyType = "done",
    inputRef = (input) => {},
    onSubmitEditing = () => {},
    secureTextEntry = false,
    autoFocus = false,
    maxLength = 100,
    style = {},
    inputStyle = {},
    inputProps = {},
    cardStyle = {},
    rightIcon = null,
    multiline = false,
    editable = true,
    allowSpacing = true,
    isPressable = false,
    onPress = null,
  } = props;

  const [active, setActive] = useState(false);
  const [isSecure, setSecure] = useState(secureTextEntry);

  const getRightIcon = () => {
    if (!rightIcon && secureTextEntry) {
      return (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={() => setSecure(!isSecure)}
        >
          <Icon
            name={isSecure ? "eye-slash" : "eye"}
            size={15}
            color={COLORS.darkGray}
          />
        </TouchableOpacity>
      );
    } else if (isPressable) {
      return <Icon name={"chevron-down"} size={15} color={COLORS.darkGray} />;
    }
    return rightIcon;
  };

  return (
    <View
      style={{
        marginVertical: 10,
        ...style,
      }}
    >
      {/* {label && (
        <Typography
          textType={'light'}
          size={FONTSIZE.XS}
          color={active ? COLORS.primary : COLORS.darkGray} >
          {label}
        </Typography>
      )} */}
      <View
        style={{
          ...commonStyles.inputView,
          borderColor: active ? COLORS.primary : COLORS.lightGray,
          ...cardStyle,
        }}
      >
        {isPressable ? (
          <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <Typography
              style={{
                fontSize: FONTSIZE.S,
                fontFamily: FONTS.PoppinsRegular,
                color: COLORS.black,
                padding: 10,
                ...inputStyle,
                backgroundColor: editable ? COLORS.white : COLORS.lightGray,
              }}
            >
              {startCase(value || placeholder)}
            </Typography>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={{
              flex: 1,
              fontSize: FONTSIZE.S,
              fontFamily: FONTS.PoppinsRegular,
              color: COLORS.black,
              padding: 10,
              ...inputStyle,
              backgroundColor: editable ? COLORS.white : COLORS.lightGray,
            }}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            underlineColorAndroid="transparent"
            onChangeText={(e) => {
              onChangeText(!allowSpacing ? e.replace(/\s/g, "") : e);
            }}
            onKeyPress={onKeyPress}
            value={value}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            blurOnSubmit={false}
            maxLength={maxLength}
            ref={inputRef}
            onSubmitEditing={onSubmitEditing}
            secureTextEntry={isSecure}
            autoFocus={autoFocus}
            onBlur={() => setActive(false)}
            onFocus={() => setActive(true)}
            multiline={multiline}
            editable={editable}
            {...inputProps}
          />
        )}
        {getRightIcon()}
      </View>
      {error != null && error != "" && (
        <Typography
          color={COLORS.primary}
          size={FONTSIZE.XXS}
          textType="light"
          align="right"
        >
          {capitalize(error)}
        </Typography>
      )}
    </View>
  );
};

InputText.defaultProps = {
  isPressable: false,
  onPress: null,
};
