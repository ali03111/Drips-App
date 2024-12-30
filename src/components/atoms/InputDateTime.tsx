import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Typography } from "./Typography";
import { commonStyles } from "../../style";
import moment from "moment";
import { COLORS, FONTSIZE } from "../../constants";
import FaIcon from 'react-native-vector-icons/FontAwesome5';
import { capitalize } from "../../utils/utils";

export const InputDateTime = (props: any) => {
  const [visible, setVisible]: any = useState(false);
  const [value, setValue]: any = useState();
  const {
    label = "Please select",
    mode = "date",
    is24Hour = false,
    onChange = () => {},
    style = {},
    error = false,
    showIcon = false,
    minDate = null,
    maxDate = null,
  } = props;
  
  return <>
    <TouchableOpacity style={[ styles.container, style ]} onPress={ () => setVisible(true) }>
      {/* <Typography>{props.value}</Typography> */}
      { props.value || value ? <Typography style={{flex: 1}}>
        {props.value || moment( new Date(value) ).format( mode == 'date' ? 'DD-MM-YYYY' : 'hh:mm A' )  }
      </Typography> : <Typography color={COLORS.halfWhite} style={{flex: 1}}>
        { label  }
      </Typography> }
      {showIcon && <FaIcon name='calendar' size={18} />}
      <DateTimePickerModal
        minimumDate={minDate}
        maximumDate={maxDate}
        isVisible={ visible }
        mode={mode}
        display={'spinner'}
        date={value || new Date()}
        is24Hour={is24Hour}
        onConfirm={ (e: any) => {
          let date = moment(e).format('MM-DD-YYYY');
          setValue(e);
          onChange(date);
          setVisible(false);
        } }
        onCancel={ () => setVisible(false) }
        />
    </TouchableOpacity>
    {error != null && error != '' && (
        <Typography
          color={COLORS.primary}
          size={FONTSIZE.XXS}
          textType="light"
          align="right">
          {capitalize(error)}
        </Typography>
      )}
  </>
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.inputView,
    padding: 15,
  }
})