import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, Typography} from '../../components/atoms';
import {navigate} from '../../navigation/RootNavigation';
import { CheckBox } from '../../components/icons';

const Pricing = props => {

  const dispatch = useDispatch();
  const [select, setSelect]: any = useState(null);

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 10}}>
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{width: '70%', height: 100}}
              resizeMode={'contain'}
            />

            <Typography color={COLORS.primary} style={{marginVertical: 5}}>
              Pricing & Subscription:
            </Typography>

            <Typography color={COLORS.primary} style={{marginTop: 5}}>
              For General Medical Officer:
            </Typography>

            <Typography size={12} textType="light">
              Chat/Voice Calling/ Video Calling services for General medical officer are charged at N500 for 10 minutes, N1500 for 25 minutes and N3000 for 45 minutes repectively.
            </Typography>

            <Typography color={COLORS.primary} style={{marginVertical: 5}}>
              What do you want to subscribe?
            </Typography>
            
            <View>
              { 
                PACKAGES.map( (i, index) => <TouchableOpacity 
                  activeOpacity={1}
                  style={ styles.options }
                  onPress={ () => setSelect(index) }
                >
                  <CheckBox selected={ index == select } />
                  <Typography size={12} textType='light'>{` ${i.desc}`}</Typography>
                </TouchableOpacity> ) 
              }
            </View>

            <Typography color={COLORS.primary} style={{marginTop: 20}}>
              For Specialist:
            </Typography>

            <Typography size={12} textType="light">
              Chat/Voice Calling/ Video Calling services for General medical officer are charged at N500 for 10 minutes, N1500 for 25 minutes and N3000 for 45 minutes repectively.
            </Typography>

            <Typography color={COLORS.primary} style={{marginVertical: 5}}>
              What do you want to subscribe?
            </Typography>
            
            <View>
              { 
                PACKAGES.map( (i, index) => <TouchableOpacity 
                  activeOpacity={1}
                  style={ styles.options }
                  onPress={ () => setSelect(index) }
                >
                  <CheckBox selected={ index == select } />
                  <Typography size={12} textType='light'>{` ${i.desc}`}</Typography>
                </TouchableOpacity> ) 
              }
            </View>

            <View style={{marginTop: 10}}>
              <Button 
                label={'Pay to Proceed'} 
                onPress={() => navigate('Payment') } 
              />
              <Button 
                label={'Back'} 
                onPress={() => props.navigation.goBack() }
                backgroundColor={'#b8b8b8'}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 40,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  options: {
    marginTop: 10,
    flexDirection: 'row',
  }
});

export default Pricing;

const PACKAGES = [
  {
    id: 1,
    desc: `Chat (Charged at N500 for 10 minute)`
  },
  {
    id: 2,
    desc: `Voice Calling (Charged at N1500 for 25 minutes)`
  },
  {
    id: 3,
    desc: `Video Calling (Charged at N3000 for 45 minutes)`
  }
]