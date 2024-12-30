import React, {useEffect, useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InputText, Typography} from '../../components/atoms';
import {navigate} from '../../navigation/RootNavigation';
import {updateAppStates} from '../../store/actions/AppActions';
import { RootState } from '../../store/reducers';
import { userUserDataAction } from '../../store/actions/UserActions';
import * as Validator from '../../utils/Validator';

const ContactInfo = props => {
  const signupStep = 'step1'
  const dispatch = useDispatch();
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const {
    user
  } = useSelector((state:RootState) => state.UserReducer);
  const [form, setForm] = useState([
    {
      label: 'Address',
      placeholder: 'Address',
      type: 'text',
      value: '',
      error: '',
      keyboardType: 'default',
      refName: 'address',
      focusName: 'contact',
      returnKeyType: 'next',
      multiline: false,
      maxLength: 255,
      inputProps: {
        // textAlignVertical: 'top',
        // numberOfLines: 5
      }
    },
    {
      label: 'Phone Number',
      placeholder: 'Phone Number',
      type: 'text',
      value: '',
      error: '',
      keyboardType: 'phone-pad',
      refName: 'contact',
      returnKeyType: 'done'
    }
  ]);
  useEffect(() => {}, []);

  const _onSubmit = async() => {
    let validateData = {};
    form.map(i => validateData[i.refName]=i.value);
    Validator.validate(validateData).then(err => {
      if(!err){
        dispatch(userUserDataAction(signupStep,validateData,'AlergyInfo'));
      }
      else setErrors(err);
    });
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

            <Typography color={COLORS.primary} style={{marginTop: 10}}>
              Contact Information
            </Typography>

            {form.map((i: any, index) => {
              return (
                <InputText
                  {...i}
                  key={index}
                  title={i.label}
                  onChangeText={(text: string) => {
                    form[index].value = text;
                    setForm([...form]);
                  }}
                  error={errors[i.refName]}
                  inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                  onSubmitEditing={() => {
                    ( i.focusName ? 
                    inputRefs.current[i.focusName].focus() :
                    Keyboard.dismiss() )
                  }}
                />
              );
            })}

            <View style={{marginTop: 10}}>
              <Button 
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
});

export default ContactInfo;