import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { FONTSIZE } from "../../constants";
import { Overlay, Typography } from "../atoms";

interface Props {
  title: string,
  description?: string,
  options?: Array<any>,
}

export const CardPopup = ({ title, description, options = [] }: Props) => {
  
    return (
      <Overlay>
        <View style={ styles.card }>
          <Typography size={ FONTSIZE.XL } style={{ marginBottom: 10 }}>{ title }</Typography>
          <Typography align='center' textType='light'>{ description }</Typography>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around',
            width: '100%',
            marginTop: 10,
          }}>
            { options.map((option, index) => {
              return (<TouchableOpacity onPress={ option.onPress } >
                <Typography textType='light' size={ FONTSIZE.S }>
                  { option.label }
                </Typography>
              </TouchableOpacity>)
            } ) }
          </View>
        </View>
      </Overlay>
    );
  };

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: "80%",
    maxWidth: 350,
    borderRadius: 5,
    alignItems: 'center',
    padding: 15,
    zIndex: 99
  }
});