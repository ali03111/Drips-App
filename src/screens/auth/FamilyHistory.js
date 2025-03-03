// import React, {useReducer, useRef, useState} from 'react';
// import {View, StyleSheet, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
// import {useDispatch} from 'react-redux';
// import {IMAGES, COLORS} from '../../constants';
// import SafeAreaContainer from '../../containers/SafeAreaContainer';
// import {Button, InputText, Typography} from '../../components/atoms';
// import { userUserDataAction } from '../../store/actions/UserActions';
// import * as Validator from '../../utils/Validator';

// const FamilyHistory = props => {
//   const signupStep = 'step5';
//   const dispatch = useDispatch();
//   const [errors, setErrors] = useState({});

//   const _onSubmit = async() => {
//     let validateData:any = {};
//     form.map(i => validateData[i.refName]=i.value);
//     Validator.validate(validateData).then(err => {
//       if(!err){
//         dispatch(userUserDataAction(signupStep,{'family_medical_condition':validateData.medical_history},'SocialInfo'));
//       }else{
//         setErrors(err);
//       }
//     });
//   }

//   const isInValid = () => {
//     return form.filter(i => i.value==='').length>0;
//   }

//   const [form, setForm] = useState([
//     {
//       label: 'Family medical conditions',
//       placeholder: 'Family medical conditions',
//       type: 'text',
//       value: '',
//       error: '',
//       keyboardType: 'default',
//       refName: 'medical_history',
//       multiline: false,
//       maxLength: 500
//     }
//   ]);

//   return (
//     <SafeAreaContainer safeArea={false}>
//       <ImageBackground source={IMAGES.imgbg} style={{flex: 1, padding: 20}}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={{ flex: 1 }}
//         >
//           <View style={{ flex: 1 }} />
//           <View style={styles.container}>
//             <Image
//               source={IMAGES.splash}
//               style={{width: '70%', height: 100}}
//               resizeMode={'contain'}
//             />

//             <Typography color={COLORS.primary} style={{marginVertical: 10}}>
//               Past Family History
//             </Typography>

//             <Typography style={{marginVertical: 5}} size={12} textType="light">
//               List all medical conditions in your family (Parents & Siblings):
//             </Typography>

//             {form.map((i: any, index) => {
//               return (
//                 <InputText
//                   {...i}
//                   key={index}
//                   title={i.label}
//                   onChangeText={(text: string) => {
//                     form[index].value = text;
//                     setForm([...form]);
//                   }}
//                   onSubmitEditing={() => {
//                     Keyboard.dismiss()
//                   }}
//                 />
//               );
//             })}

//             <View style={{marginTop: 10}}>
//               <Button
//               disabled={isInValid()}
//                 label={'Next'}
//                 onPress={_onSubmit}
//               />
//               <Button
//                 label={'Back'}
//                 onPress={() => props.navigation.goBack() }
//                 backgroundColor={'#b8b8b8'}
//               />
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </ImageBackground>
//     </SafeAreaContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     marginTop: 80,
//     padding: 20,
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   options: {
//     marginTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center'
//   }
// });

// export default FamilyHistory;

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import { userUserDataAction } from "../../store/actions/UserActions";
import { CheckBox } from "../../components/icons";

const FamilyHistory = (props) => {
  const signupStep = "step5";
  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);
  const [dummy, setDummy] = useState(0);
  const [allergies, setAllergies] = useState([{ alergic: "" }]);

  const [errors, setErrors] = useState({});

  // const _onSubmit = async() => {
  //   let validateData:any = {};
  //   form.map(i => validateData[i.refName]=i.value);
  //   Validator.validate(validateData).then(err => {
  //     if(!err){
  //       dispatch(userUserDataAction(signupStep,{'family_medical_condition':validateData.medical_history},'SocialInfo'));
  //     }else{
  //       setErrors(err);
  //     }
  //   });
  // }

  const _onSubmit = async () => {
    if (!select) return;
    dispatch(
      userUserDataAction(
        signupStep,
        {
          Is_family: select.toLowerCase(),
          family_medical_condition:
            select == "Yes" ? allergies.map((res) => res.alergic) : [],
        },
        "SocialInfo"
      )
    );
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={styles.background}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexGrow: 1, marginTop: 30 }}
        >
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <ScrollView
            contentContainerStyle={styles.container(
              allergies.length >= 1 && select === "Yes"
            )}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={IMAGES.splash}
              style={styles.logo}
              resizeMode="contain"
            />

            <Typography color={COLORS.primary} style={styles.heading}>
              Past Family History
            </Typography>

            <View style={styles.card}>
              <Typography align="center">
                List all medical conditions in your family (Parents & Siblings):
              </Typography>

              <View style={styles.optionsContainer}>
                {["Yes", "No"].map((i, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.7}
                    style={styles.options}
                    onPress={() => {
                      setSelect(i);
                      if (i === "No") setAllergies([]); // Reset allergies if "No" is selected
                    }}
                  >
                    <CheckBox selected={i === select} />
                    <Typography>{` ${i}`}</Typography>
                  </TouchableOpacity>
                ))}
              </View>

              {select === "Yes" && (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      setAllergies([...allergies, { alergic: "" }])
                    }
                    activeOpacity={0.7}
                    style={styles.addMoreButton}
                  >
                    <Typography>Add more +</Typography>
                  </TouchableOpacity>

                  {allergies.map((res, index) => (
                    <View key={index} style={styles.inputRow}>
                      <InputText
                        placeholder="Enter medical condition"
                        onChangeText={(text) => {
                          setAllergies((prevAllergies) =>
                            prevAllergies.map((allergy, i) =>
                              i === index
                                ? { ...allergy, alergic: text }
                                : allergy
                            )
                          );
                        }}
                        value={res.alergic}
                        autoCapitalize="none"
                        returnKeyType="done"
                        style={styles.input}
                        allowSpacing={false}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setAllergies((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Image
                          source={IMAGES.trashImg}
                          resizeMode="contain"
                          style={styles.trashIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <Button disabled={!select} label="Next" onPress={_onSubmit} />
              <Button
                label="Back"
                onPress={() => props.navigation.goBack()}
                backgroundColor="#b8b8b8"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: "70%",
    height: 100,
    alignSelf: "center",
  },
  heading: {
    marginVertical: 10,
    textAlign: "center",
  },
  container: (isLength) => ({
    backgroundColor: "#fff",
    // top: 40,
    padding: 20,
    borderRadius: 20,
    // bottom: 50,
    // paddingBottom: 100,
  }),
  card: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 20,
    paddingBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  addMoreButton: {
    alignSelf: "flex-end",
    marginVertical: 5,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    width: "85%",
  },
  trashIcon: {
    width: 30,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default FamilyHistory;
