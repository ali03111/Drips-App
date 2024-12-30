import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InputText, Typography} from '../../components/atoms';
import { userUserDataAction } from '../../store/actions/UserActions';
import * as Validator from '../../utils/Validator';

const FamilyHistory = props => {
  const signupStep = 'step5';
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  
  const _onSubmit = async() => {
    let validateData:any = {};
    form.map(i => validateData[i.refName]=i.value);
    Validator.validate(validateData).then(err => {
      if(!err){
        dispatch(userUserDataAction(signupStep,{'family_medical_condition':validateData.medical_history},'SocialInfo'));
      }else{
        setErrors(err);
      }
    });
  }

  const isInValid = () => {
    return form.filter(i => i.value==='').length>0;
  }

  const [form, setForm] = useState([
    {
      label: 'Family medical conditions',
      placeholder: 'Family medical conditions',
      type: 'text',
      value: '',
      error: '',
      keyboardType: 'default',
      refName: 'medical_history',
      multiline: false,
      maxLength: 500
    }
  ]);

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
              Past Family History
            </Typography>

            <Typography style={{marginVertical: 5}} size={12} textType="light">
              List all medical conditions in your family (Parents & Siblings):
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
                  onSubmitEditing={() => {
                    Keyboard.dismiss()
                  }}
                />
              );
            })}

            <View style={{marginTop: 10}}>
              <Button 
              disabled={isInValid()}
                label={'Next'} 
                onPress={_onSubmit} 
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
  options: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default FamilyHistory;