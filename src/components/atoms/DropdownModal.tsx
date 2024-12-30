import * as React from 'react';
import { Text, View, StyleSheet, Modal, KeyboardAvoidingView, Pressable, Keyboard, Dimensions, Platform } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons'
interface DropdownModalProps {
    children:React.ReactElement,
    onClose:()=>void
    title:string
}

const {width,height} = Dimensions.get('window');

const DropdownModal = (props: DropdownModalProps) => {
    const [keyboardStatus, setKeyboardStatus] = React.useState('');
    React.useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus('open');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus('hide');
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <Modal visible transparent animationType='slide'>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Pressable 
                onPress={() => {
                    if(keyboardStatus ==='open'){
                    Keyboard.dismiss();
                    return
                    }
                    props.onClose();
                }}
                style={{flex:1,backgroundColor:'rgba(0,0,0,.5)'}} />
                <View style={styles.mainContainer}>
                    <View style={styles.header}>
                    <View style={styles.buttonContainer}></View>
                    <View style={{flex:1}}>
                        <Text style={styles.title}>{props.title}</Text>
                    </View>
                    <View style={[styles.buttonContainer,{alignItems:'flex-end'}]}>
                        <Pressable onPress={props.onClose}>
                            <Icon size={24} color={COLORS.white} name='close'  />
                        </Pressable>
                    </View>
                    </View>
                    <View style={styles.container}>
                        {props.children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default DropdownModal;

const styles = StyleSheet.create({
    closeIcon:{
        tintColor:COLORS.white,
        width:width*.05,
        height:width*.05,
      },
      container: {
        padding:10,
        height:height*.5,
      },
      mainContainer:{
        backgroundColor:COLORS.white,
        // maxHeight:height*.06
      },
      header:{
        backgroundColor:COLORS.primary,
        height:height*.07,
        flexDirection:'row',
        alignItems: 'center',
      },
      buttonContainer:{
        width:width*.2,
        paddingHorizontal:width*.03
      },
      title:{
        color:COLORS.white,
        fontFamily:FONTS.NunitoRegular,
        textAlign:'center',
        paddingHorizontal:5,
        fontSize:width*.05
      }
});
