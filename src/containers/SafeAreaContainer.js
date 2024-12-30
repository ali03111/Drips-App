import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { COLORS, FONTSIZE, IMAGES, screenHeight } from '../constants';

export default SafeAreaContainer = props => {
  const {
    safeArea = true,
    mode = 'dark',
    backgroundColor = 'transparent',
    style = {},
  } = props;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar
        translucent={true}
        backgroundColor={backgroundColor}
        barStyle={mode === 'dark' ? "dark-content" : "light-content"}
      />
      {safeArea ?
        <SafeAreaView style={{ flex: 1,backgroundColor:COLORS.primary}}>
          {props.children}
        </SafeAreaView> :
        <>
          {props.children}
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({});
