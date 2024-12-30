import React, {useReducer, useRef, useState} from 'react';
import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES, COLORS, headerHeight} from '../../constants';
import SafeAreaContainer from '../../containers/SafeAreaContainer';
import {Button, InputText, Typography} from '../../components/atoms';
import {cloneDeep} from 'lodash';
import * as Validator from '../../utils/Validator';
import { userUserDataAction } from '../../store/actions/UserActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { showToast } from '../../store/actions/AppActions';
import { RootState } from '../../store/reducers';
const formItem = {
  label: 'Surgical History',
  placeholder: 'Surgical History',
  type: 'text',
  value: '',
  error: '',
  keyboardType: 'default',
  refName: 'Surgeries1',
  multiline: false,
  maxLength: 500,
}
const SurgicalHistory = props => {

  const dispatch = useDispatch();
  const signupStep = 'step4';
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState([
    cloneDeep(formItem)
  ]);

  const _onSubmitOld = async() => {
    let validateData:any = {};
    form.map(i => validateData[i.refName]=i.value);
    Validator.validate(validateData).then(err => {
      if(!err){
        dispatch(userUserDataAction(signupStep,{'Surgeries1':validateData.medical_history},'FamilyHistory'));
      }else{
        setErrors(err);
      }
    });
  }

  const {
    user
  } = useSelector((state:RootState)=>state.UserReducer)


  const _onSubmit = async() => {
    let validateData:any = {};
    let isValid = true;
    form.map((i,index) => {
      if(isValid && !i.value) isValid = false
      validateData[`${i.refName}[${index}]`]=i.value
    });
    if(isValid){
      validateData.email = user.email
      dispatch(userUserDataAction(signupStep,{...validateData,formData:true},'FamilyHistory'));
    }else
    dispatch(showToast('Please enter all items to continue'))
  }

  const onAddMore = () => {
    let isValid = true;
    form.map((i,index) => { if(isValid && !i.value) isValid = false });
    if(isValid){
      let _formItem = cloneDeep(formItem)
      setForm([...form,_formItem]);
    }else{
      dispatch(showToast('Please fill preceding item to continue'))
    }
  }

  const deleteItem = (index:number) => {
    let _form = cloneDeep(form);
    if(_form[index]){
      _form.splice(index,1);
    }
    setForm(_form);
  }

  const isInValid = () => form.filter(i => i.value==='').length>0;

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 20}}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ height:headerHeight+40 }} />
          <View style={styles.container}>
            <View style={{flex:1}}>

              <ScrollView>
                <Image
                  source={IMAGES.splash}
                  style={{width: '70%', height: 100}}
                  resizeMode={'contain'}
                />

                <Typography color={COLORS.primary} style={{marginVertical: 10}}>
                  Past Surgical History
                </Typography>

                <Typography style={{marginVertical: 5}} size={12} textType="light">
                  List all surgical conditions you have been previously diagnosed with:
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
                      rightIcon={index>0&&<TouchableOpacity style={{paddingHorizontal:10}} onPress={()=>deleteItem(index)}><Icon name={'trash'} size={20} color={COLORS.danger} /></TouchableOpacity>}
                    />
                  );
                })}

                <TouchableOpacity style={styles.buttonContainer} onPress={() => onAddMore()}>
                  <Icon size={20} name='add' color={COLORS.primary} />
                  <Typography style={styles.buttonText}>Add More</Typography>
                </TouchableOpacity>
              </ScrollView>
            </View>

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
    flex:1,
    backgroundColor: '#fff',
    // marginTop: 80,
    padding: 20,
    borderRadius: 20,
    // marginBottom: 20,
  },
  options: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer:{
    paddingVertical:12,
    paddingHorizontal:10,
    alignSelf:'flex-end',
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  buttonText:{
    color:COLORS.primary,
    fontSize:15
  }
});

export default SurgicalHistory;