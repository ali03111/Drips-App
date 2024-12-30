import React, { useState } from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants";
import { commonStyles } from "../../style";
import { Typography } from "../atoms";

interface Props {
    list: Array<string>
}

export const AddressList = ({list = []}: Props) => {

  const [ items, setItems ] = useState( list.filter( i => i != null ) );

  return (
    <View style={ styles.container }>
      <View
        style={{
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <View style={styles.verticalBar} />
        {
          Array( items.length ? items.length - 1 : 0 ).fill('')
          .map( i => <View style={styles.origin} /> )
        }
        <View style={styles.dropOff} />
      </View>
      <View style={{ flex: 1, padding: 5 }}>
        { items.length > 0 && items.map( i => 
            <Typography capitalize={true} textType={'light'} size={12}>
              {i}
            </Typography>
        )
        .reduce((prev, curr): any => [prev, <View style={ commonStyles.separator } />, curr]) }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: COLORS.border,
      marginVertical: 10,
      padding: 5,
      borderRadius: 8
    },
    origin: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: COLORS.secondary,
    },
    dropOff: {
      height: 10,
      width: 10,
      backgroundColor: COLORS.primary,
      borderRadius: 5,
    },
    verticalBar: {
      borderWidth: 1,
      height: '100%',
      position: 'absolute',
      alignSelf: 'center',
      bottom: 10,
      borderColor: COLORS.lightGray,
    },
  });