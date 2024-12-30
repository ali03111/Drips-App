// import { Colors, Constants, Utils } from 'common';
import * as React from 'react';
import { Text, View, StyleSheet, Pressable, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
// import { updateProfile, uploadMedia } from 'reduxStore/services/user';
import { RouteProp, useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { checkPermissionForUsage, getResolvedPath } from '../../utils/utils';
import { COLORS, FONTS } from '../../constants';
interface ActionSheetProps {
    onImageSuccess: (mediaObj: {
        type: string,
        name: string,
        uri: string
    }) => void
    onCancel: () => void
}

let initial = {
    fileName: '',
    imageType: '',
    picture: '',
    isLoading: false,
    showLoginView: false
}

const ActionSheet = (props: ActionSheetProps) => {
    let navigation = useNavigation();
    const [{
        isLoading,
        fileName,
        imageType,
        picture
    }, setState] = React.useState(initial);

    const updateState = (state: {}) => {
        setState(prevState => ({ ...prevState, ...state }));
    }


    const onImageSuccess = (response) => {
        let assets = response || {};
        let uri = assets && assets.path || '';
        let type = assets && assets.mime || '';
        let name = assets && assets.filename || uri.substring(uri.lastIndexOf('/') + 1, uri.length);
        
        const realPath = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        getResolvedPath(realPath).then(pathRes => {
            var str1 = "file://";
            var str2 = pathRes.path;
            var correctpath = str1.concat(str2);
            props.onImageSuccess({
                type,
                name,
                uri: correctpath
            });
            onCancel();
        }).catch(err => { })
    }


    const openCamera = (type: number) => {
        if (type === 2) {
            ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true
            }).then(image => {
                onImageSuccess(image);
            });
            return
        }
        else {
            checkPermissionForUsage('camera')
            .then(res => {
                ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: true
                }).then(image => {
                    onImageSuccess(image);
                });
            })
            .catch(error => {
                updateState({ isLoading: false });
            });
        }
    }
    let viewRef: any = React.useRef<Animatable.View>(null);
    let viewRefMain: any = React.useRef<Animatable.View>(null);
    const onCancel = () => {
        viewRef?.current?.fadeOutDown && viewRef.current.fadeOutDown(800)
        viewRefMain?.current?.fadeOut && viewRefMain.current.fadeOut(1000).then(() => props.onCancel())
    }
    return (
        <Animatable.View duration={500} ref={viewRefMain} animation={'fadeIn'} style={styles.container}>
            <Pressable onPress={() => props.onCancel()} style={{ flex: 1, }} />
            <View style={styles.subContainer}>
                <Animatable.View duration={500} ref={viewRef} animation={'fadeInUp'} >
                    <Pressable style={styles.button} onPress={() => openCamera(1)}>
                        <Icon size={25} color={COLORS.primary} name='camera' />
                        <Text style={styles.buttonTitle}>Camera</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => openCamera(2)}>
                        <Icon size={25} color={COLORS.primary} name='image' />
                        <Text style={styles.buttonTitle}>Gallery</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => onCancel()}>
                        <Text style={[styles.buttonTitle, styles.cancelButton]}>Cancel</Text>
                    </Pressable>
                </Animatable.View>
            </View>
        </Animatable.View>
    );
};
ActionSheet.defaultProps = {
    filePicker: false
}

export { ActionSheet };

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 999,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    subContainer: {
        width: '100%',
        padding: 15
    },
    button: {
        marginVertical: 10,
        paddingHorizontal: 15,
        height: 55,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 10
    },
    buttonTitle: {
        paddingHorizontal: 8,
        color: COLORS.darkGray,
        fontFamily:FONTS.PoppinsMedium
    },
    cancelButton: {
        color:COLORS.danger,
        fontFamily:FONTS.PoppinsMedium
    },
});
