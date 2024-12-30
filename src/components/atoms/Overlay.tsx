import React from "react";
import { View } from "react-native";

type Props = {}
export const Overlay = (props: any) => {
  return (
    <View style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      {props.children}
    </View>
  );
};
