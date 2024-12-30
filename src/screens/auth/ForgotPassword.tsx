import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InnerHeader, InputDateTime, InputText, Typography} from '../../components/atoms';
import {navigate} from '../../navigation/RootNavigation';
import {updateAppStates} from '../../store/actions/AppActions';
import * as Validator from '../../utils/Validator';
import { forgotPasswordAction, registerAction } from '../../store/actions/UserActions';

const ForgotPassword = props => {
  let signUpFormData = props.route.params.signUpFormData || {};
  const dispatch = useDispatch();
  const EmailInput: any = React.createRef();
  const [errors, setErrors]: any = useState({});
  const [email, setEmail] = useState(__DEV__?'mackasauser@gmail.com':'');

  const [form, setForm] = useState([
    {
      label: 'Password',
      placeholder: 'Password',
      type: 'text',
      value: __DEV__ ?'Pass@123':'',
      error: '',
      keyboardType: 'default',
      refName: 'new_password',
      returnKeyType: 'next',
      focusName: 'confirm_password',
      secureTextEntry:true,
      leftIconVisibility: false,
    }
  ]);

  const _onSubmit = () => {
    let validateData:any = {email};
    /* Validator.validate(validateData).then(err => {
      if(!err){
        setErrors({}); */
        dispatch(forgotPasswordAction(validateData));
        // dispatch(updateUserStates({token: true}));
      /* }
      else setErrors(err);
    }); */
    //navigate('Verification');
  }
  
  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 20}}>
        <InnerHeader 
         backBtn
        />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1,justifyContent:'flex-end' }}
        >
          
            <View style={styles.container}>
              <Image
                source={IMAGES.splash}
                style={{width: '70%', height: 100}}
                resizeMode={'contain'}
              />

              <Typography color={COLORS.primary} style={{marginTop: 10}}>
                Forgot Password
              </Typography>

              <InputText
                label={'Email Or Phone'}
                placeholder={'Email Or Username'}
                onChangeText={text => setEmail(text)}
                value={email}
                error={errors.email}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                returnKeyType={'done'}
                inputRef={EmailInput}
                allowSpacing={false}
              />

              <View style={{marginTop: 20}}>
                <Button disabled={email===''} label={'Submit'} onPress={_onSubmit } />
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

// const FORM = ;

export default ForgotPassword;