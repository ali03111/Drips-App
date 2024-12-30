import React from "react";
import { Text, View, StyleSheet } from "react-native"
import { COLORS, FONTS, FONTSIZE } from '../../constants';

export const NoNetwork = (props: any) => {

    const {
        title = "No Network Found",
        style = {}
    }  = props;

    return (
        <View style={[styles.headerView, style]}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    headerText: { 
        fontFamily: FONTS.PoppinsSemiBold,
        fontSize: FONTSIZE.M,
        color: COLORS.primary,
        opacity: 0.7
    }
});
