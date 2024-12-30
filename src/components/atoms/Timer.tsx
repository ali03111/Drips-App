import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Typography } from "./Typography";
import { commonStyles } from '../../style';
import Icon from 'react-native-vector-icons/Entypo'
const getRemaing = (time) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  let hours = Math.floor(secs / (60 * 60));
  // let hours = Math.floor((secs / mins));
  return { hours, mins, secs };
}

export const Timer = (props) => {

  const [remaingSec, setRemaingSec] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const { hours, mins, secs } = getRemaing(remaingSec)

  const toggle = () => {
    setIsActive(!isActive)
  }
  useEffect(() => {

    let interval: any = null
    if (isActive) {
      interval = setInterval(() => {
        setRemaingSec(remaingSec => remaingSec + 1)
      }, 1000)
    } else if (!isActive && remaingSec! == 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, remaingSec ])


  useEffect(() => {
    toggle()
  }, [])


  
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", flex: 1, paddingHorizontal: 50 }}>
        <View style={{ alignItems: "center" }}>
          <Typography size={35} color="#000" textType="bold">{String(hours).padStart(2, '0')}</Typography>
          <Typography size={12} color="#8292BB" >HOURS</Typography>
        </View>
        <View style={{ marginTop: 10 }}>
          <Icon name="dots-two-vertical" size={25} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Typography size={35} color="#000" textType="bold">{String(mins).padStart(2, '0')}</Typography>
          <Typography size={12} color="#8292BB" >MIN</Typography>
        </View>
        <View style={{ marginTop: 10 }}>
          <Icon name="dots-two-vertical" size={25} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Typography size={35} color="#000" textType="bold">{String(secs).padStart(2, '0')}</Typography>
          <Typography size={12} color="#8292BB" >SEC</Typography>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginVertical: 10,
    flexDirection: 'row',
    ...commonStyles.boxShadow
  },
  timerText: {
    color: '#0000',
  }
});
