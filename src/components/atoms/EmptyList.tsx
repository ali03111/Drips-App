import React from "react";
import { Text, View, StyleSheet } from "react-native"
import { useSelector } from "react-redux";
import { COLORS, FONTS, FONTSIZE, screenHeight } from '../../constants';
import { Typography } from "./Typography";

export const EmptyList = (props: any) => {

    const user = useSelector( (state: any) => state.UserReducer.user );

    const {
        title = "No Record Found",
        style = {}
    }  = props;

    return (
        <View style={[styles.headerView, style]}>
            <Typography 
                style={{ width: "80%" }} 
                align="center"
                color={COLORS.darkGray}>
                {title}
            </Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight(30),
        backgroundColor: '#fff'
    },
});
