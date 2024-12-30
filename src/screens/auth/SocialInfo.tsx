import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InputText, Typography} from '../../components/atoms';
import * as Validator from '../../utils/Validator';
import { userUserDataAction } from '../../store/actions/UserActions';

import { CheckBox } from '../../components/icons';

const SocialInfo = props => {

  const dispatch = useDispatch();
  const [select, setSelect]: any = useState(null);

  const [ queries, setQueires ] = useState([
    {
      refName:'do_you_smoke',
      label: `Do you smoke?`,
      selected: '',
      options: ['Yes', 'No']
    },
    {
      refName:'do_u_marijuana',
      label: `Do you use any Recreational Drugs Like Marijuana?`,
      selected: '',
      options: ['Yes', 'No']
    },
    {
      refName:'do_u_Alcohol',
      label: `Do you drink Alcohol?`,
      selected: '',
      options: ['Yes', 'No']
    },
    {
      refName:'are_you_employed',
      label: `Are you Employed?`,
      selected: '',
      options: ['Yes', 'No']
    }
  ]);

  const signupStep = 'step6';
  const [errors, setErrors] = useState({});
  
  const _onSubmit = async() => {
    let validateData:any = {};
    queries.map(i => validateData[i.refName]=i.selected.toLowerCase());
    Validator.validate(validateData).then(err => {
      if(!err){
        dispatch(userUserDataAction(signupStep,validateData,'Medication'));
      }else{
        setErrors(err);
      }
    });
  }

  const isInValid = () => {
    return queries.filter(i => !i.selected).length>0;
  }

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 20}}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }} />
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{width: '70%', height: 100}}
              resizeMode={'contain'}
            />

            <Typography color={COLORS.primary} style={{marginVertical: 10}}>
              Social History
            </Typography>

            { queries.map( (i: any, index) => (<View style={ styles.queryCard }>
                <Typography textType='light'>{ i.label }</Typography>
                <View style={{ flexDirection: 'row' }}>
                  { i.options.map( (o) => <TouchableOpacity 
                    activeOpacity={1}
                    style={ styles.options }
                    onPress={ () => {
                      setQueires( prev => {
                        prev[index].selected = o;
                        return [...prev];
                      } )
                    } }
                  >
                    <CheckBox selected={ o == i.selected } />
                    <Typography>{` ${o}`}</Typography>
                  </TouchableOpacity> ) }
                </View>
              </View>) ) }

            <View style={{marginTop: 10}}>
              <Button 
              disabled={isInValid()}
                label={'Next'} 
                onPress={_onSubmit } 
              />
              <Button 
                label={'Back'} 
                onPress={() => props.navigation.goBack() }
                backgroundColor={'#b8b8b8'}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 80,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  queryCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5
  }
});

export default SocialInfo;