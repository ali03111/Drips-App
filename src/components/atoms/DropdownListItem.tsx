import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONTSIZE } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';

interface DropdownListItemProps {
    onPress:()=>void
    title:string
    selected:boolean
}

const DropdownListItem = (props: DropdownListItemProps) => {
  return (
    <TouchableOpacity
        onPress={props.onPress}
        style={styles.container}>
      <Text style={styles.item}>{props.title}</Text>
      {props.selected && <Icon color={COLORS.primary} size={22} name='checkmark' />}
    </TouchableOpacity>
  );
};

DropdownListItem.defaultProps = {
  selected:false
}

export default DropdownListItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical:12,
    paddingHorizontal:10,
    flexDirection:'row',
    alignItems: 'center',
  },
  item:{
    flex:1,
    fontSize:FONTSIZE.M,
    color:COLORS.primary,
    fontFamily:FONTS.PoppinsMedium
  }
});
