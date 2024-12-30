import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { COLORS, IMAGES } from "../constants";
// import SafeAreaContainer from "./SafeAreaContainer";
import { updateUserStates } from "../store/actions/UserActions";
import { updateAppStates } from "../store/actions/AppActions";
import { useDispatch } from "react-redux";
import * as Animatable from 'react-native-animatable';
import { getItem } from "../utils/localStorage";

export default Splash = (props) => {
  const dispatch = useDispatch();
  const _getState = async() => {
    const authObj = await getItem('user_data');
    dispatch(updateUserStates(authObj));
    dispatch(updateAppStates({ splash: false }));
    // return userData;
  }

  return (
      <ImageBackground style={{ flex: 1 }} source={ IMAGES.bg }>
        <Animatable.View
          animation={'bounceIn'}
          duration={1500}
          style={styles.container}
        >
          <Animatable.Image
            animation={'fadeInLeftBig'}
            duration={2000}
            onAnimationEnd={() => _getState()}
            source={IMAGES.splash}
            style={{ width: 300 }}
            resizeMode="contain"
          >
          </Animatable.Image>
        </Animatable.View>
        <ProgressBar />
      </ImageBackground>
  );
};


const ProgressBar = () => {
  const [timer, setTimer] = useState(0);
  useEffect(() => {

    let timerInterval = setInterval(() => {
        setTimer(prev => {
          if( prev >= 5 ) {
            clearInterval(timerInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 300)

    return () => clearInterval(timerInterval);
  }, [])

  return (
    <View style={styles.timerBar}>
      <View style={{
        ...styles.timerBar,
        backgroundColor: COLORS.primary,
        position: 'absolute',
        height: 6,
        top: 0,
        width: `${timer * 100 / 5}%`,
        alignSelf: 'flex-start'
      }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerBar: {
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#00000029',
    height: 6,
    width: '60%',
    position: 'absolute',
    bottom: 40
  }
});
