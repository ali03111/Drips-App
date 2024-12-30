import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TextInput
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS, FONTS } from "../../constants";

const UserVerification = (props) => {
    const dispatch = useDispatch();
    const inputRef = useRef([]);
    const [pin, setPin] = useState(Array(4).fill(''));
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.sectionCode}>
                {Array(4).fill('').map((_, i) => <View style={[styles.sectionField]}>
                    <TextInput
                        ref={e => inputRef[i] = e}
                        placeholder="-"
                        placeholderTextColor={COLORS.secondary}
                        onChangeText={(text) => {
                            pin[i] = text;
                            setPin([...pin]);
                            if (text.length > 0) {
                                inputRef[i + 1]?.focus();
                                inputRef[i + 1]?.clear();
                            }
                        }}
                        onFocus={() => inputRef[i]?.clear()}
                        value={pin[i]}
                        keyboardType="numeric"
                        returnKeyType="next"
                        maxLength={1}
                        blurOnSubmit={true}
                        style={{ alignSelf: "center", fontSize: 35, fontFamily: FONTS.CarterOneRegular, color: COLORS.secondary }}
                    />
                </View>)}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sectionCode: {
        flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        // borderWidth: 1,
        // backgroundColor: '#fff',

    },
    sectionField: {
        margin: 10,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderBottomWidth: 2,
        borderColor: COLORS.secondary,

    }
});

export default UserVerification;