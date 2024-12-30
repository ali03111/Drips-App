import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InputText, Typography} from '../../components/atoms';
import * as Validator from '../../utils/Validator';
import { userUserDataAction } from '../../store/actions/UserActions';
const Medication = props => {

  const dispatch = useDispatch();
  const [select, setSelect]: any = useState(null);

  const [form, setForm] = useState([
    {
      label: 'Surgical History',
      placeholder: 'Current Medications ...',
      type: 'text',
      value: '',
      error: '',
      keyboardType: 'default',
      refName: 'medical_history',
      multiline: false,
      maxLength: 100,
    }
  ]);
  const signupStep = 'step7';
  const [errors, setErrors] = useState({});
  
  const _onSubmit = async() => {
    let validateData:any = {};
    form.map(i => validateData[i.refName]=i.value);
    Validator.validate(validateData).then(err => {
      if(!err){
        dispatch(userUserDataAction(signupStep,{'Current_medication1':validateData.medical_history},'SelfAssessment'));
      }else{
        setErrors(err);
      }
    });
  }

  const isInValid = () => {
    return form.filter(i => i.value==='').length>0;
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
              Current Medication
            </Typography>

            <Typography size={12} textType="light" style={{marginBottom: 10}}>
              List all active medication you take:
            </Typography>

            {form.map((i: any, index) => {
              return (
                <InputText
                  {...i}
                  key={index}
                  error={errors[i.refName]}
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
  options: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default Medication;