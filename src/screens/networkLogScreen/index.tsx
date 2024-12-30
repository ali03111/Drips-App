
import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import _ from 'lodash'
// import { NavigationScreenProp, NavigationState } from '';
import NetworkLogger from 'react-native-network-logger';
import { InnerHeader } from '../../components/atoms';
import SafeAreaContainer from '../../containers/SafeAreaContainer';



const NetworkLogScreen = () => {

  return (
    <View style={{ flex: 1, backgroundColor: 'grey' }}>
      <SafeAreaContainer safeArea={true} mode={'light'}>

      <InnerHeader 
          title='Network'
          backBtn
          />
      <StatusBar barStyle='light-content' />
      <NetworkLogger />
      </SafeAreaContainer>
    </View>
  );
};

export default NetworkLogScreen;
