import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {IMAGES, COLORS} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InnerHeader, InputDateTime, InputText, Typography} from '../../components/atoms';
import {navigate} from '../../navigation/RootNavigation';
import {updateAppStates} from '../../store/actions/AppActions';
import * as Validator from '../../utils/Validator';
import { registerAction } from '../../store/actions/UserActions';
import moment from 'moment/moment';
import DropdownModal from '../../components/atoms/DropdownModal';
import DropdownListItem from '../../components/atoms/DropdownListItem';

const Signup = props => {
  const [modalState,setModalState] = useState(false);
  const dispatch = useDispatch();
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [bmi, setBmi] = useState('');

  const [form, setForm] = useState([
    {
      label: 'First Name',
      placeholder: 'First Name',
      type: 'text',
      value: __DEV__?'Test':'',
      error: '',
      keyboardType: 'default',
      refName: 'first_name',
      focusName: 'last_name',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Last Name',
      placeholder: 'Last Name',
      type: 'text',
      value: __DEV__ ?'Test123':'',
      error: '',
      keyboardType: 'default',
      refName: 'last_name',
      focusName: 'email',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Email',
      placeholder: 'Email',
      type: 'text',
      value: __DEV__ ?`test${Math.random() * 101}@cc.com`:'',
      error: '',
      keyboardType: 'default',
      refName: 'email',
      focusName: 'password',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Date Of Birth',
      placeholder: 'Date Of Birth',
      type: 'text',
      value:'',
      error: '',
      keyboardType: 'default',
      refName: 'dob',
      focusName: 'phone',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Phone Number',
      placeholder: 'Phone Number',
      type: 'text',
      value: __DEV__?'123123123':'',
      error: '',
      refName: 'phone',
      focusName: 'marital_status',
      returnKeyType: 'done',
      keyboardType:'phone-pad',
      leftIconVisibility: false,
    },
    {
      label: 'Maritial Status',
      placeholder: 'Maritial Status',
      type: 'text',
      value: __DEV__ ?'Test' :'',
      error: '',
      keyboardType: 'default',
      refName: 'marital_status',
      focusName: 'gender',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Gender',
      placeholder: 'Gender',
      type: 'text',
      value: __DEV__?'male':'',
      error: '',
      keyboardType: 'default',
      refName: 'gender',
      focusName: 'height',
      returnKeyType: 'next',
      leftIconVisibility: false,
    },
    {
      label: 'Height (in cm)',
      placeholder: 'Height (in cm)',
      type: 'text',
      value: __DEV__ ? '120':'',
      error: '',
      keyboardType: 'number-pad',
      refName: 'height',
      focusName: 'weight',
      returnKeyType: 'done',
      leftIconVisibility: false,
    },
    {
      label: 'Weight (in Kg)',
      placeholder: 'Weight (in Kg)',
      type: 'text',
      value: __DEV__ ? '35':'',
      error: '',
      keyboardType: 'number-pad',
      refName: 'weight',
      returnKeyType: 'done',
      leftIconVisibility: false,
    },
  ]);

  const loginAs = userType => {
    dispatch(updateAppStates({userType}));
    navigate('Login' as never);
    props.navigation.navigate('ContactInfo')
  };

  const _onSubmit = () => {
    let validateData = {};
    form.map(i => validateData[i.refName]=i.value);
    validateData['bmi'] = bmi;
    Validator.validate(validateData).then(err => {
      if(!err){
        setErrors({});
        validateData = {
          ...validateData,
          ser_type:'2',
        }
        navigate('CreatePassword' as never, {signUpFormData:validateData} as never);

        // dispatch(updateUserStates({token: true}));
      }
      else setErrors(err);
    });
  }

  const _isValid = () => {
    let formInValid = form.filter(i=> i.value === '') || [];
    return formInValid.length!==0
  }
  const _calculateBMI = () => {
    let height; 
    let weight; 
    form.map(i=>{
      if(i.refName==='height')height = i.value;
      else if(i.refName==='weight')weight = i.value;
    });
    let bmi = (weight / ((height * height) / 10000)).toFixed(2);
    setBmi(bmi)
  }

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 20}}>
        <InnerHeader 
         backBtn
        />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Image
                source={IMAGES.splash}
                style={{width: '70%', height: 100}}
                resizeMode={'contain'}
              />

              <Typography color={COLORS.primary} style={{marginTop: 10}}>
                Personal Information
              </Typography>

              {form.map((i: any, index) => {
                if(i.refName === 'dob') 
                return <InputDateTime
                  {...i}
                  key={index}
                  maxDate={new Date()}
                  title={i.label}
                  error={errors[i.refName]}
                  style={{marginTop: 15,marginBottom:10}}
                  onChange={(text: string) => {
                    form[index].value = text;
                    setForm([...form]);
                  }}
                  inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                  onSubmitEditing={() => {
                    i.focusName ? inputRefs.current[i.focusName].focus() : Keyboard.dismiss();
                  }}
                />
                return (
                  <InputText
                    onPress={()=>setModalState(true)}
                    isPressable={i.refName === 'gender'}
                    {...i}
                    key={index}
                    title={i.label}
                    error={errors[i.refName]}
                    
                    style={{marginTop: 15}}
                    onChangeText={(text: string) => {
                      form[index].value = text;
                      setForm([...form]);
                    }}
                    inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                    onSubmitEditing={() => {
                      i.focusName ? inputRefs.current[i.focusName].focus() : Keyboard.dismiss();
                    }}
                  />
                );
              })}

              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <InputText
                  placeholder={'BMI'}
                  style={{marginTop: 15, flex: 1,}}
                  inputStyle={{backgroundColor:'#eee'}}
                  editable={ false }
                  value={bmi}
                  error={errors['bmi']}
                  inputRef={(e: any) => (inputRefs.current['bmi'] = e)}
                />
                <Button label='Calculate' onPress={_calculateBMI} style={{ flex:1, marginLeft: 20 }} />
              </View>

              <View style={{marginTop: 20}}>
                <Button disabled={_isValid()} label={'Next'} onPress={_onSubmit } />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
      {modalState && <DropdownModal 
      title={'Select Gender'}
      onClose={()=>setModalState(false)}>
          <FlatList
            data={['Male','Female']}
            ItemSeparatorComponent={()=><View style={styles.separtor} />}
            renderItem={({item,index}) => <DropdownListItem 
            selected={item===form[6].value}
            title={item} onPress={()=>{
              setModalState(false);
              form[6].value = item;
              setForm([...form]);
            }} />}
          />
        </DropdownModal>}
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
  separtor:{
    height:1,
    backgroundColor:COLORS.border
  }
});

// const FORM = ;

export default Signup;