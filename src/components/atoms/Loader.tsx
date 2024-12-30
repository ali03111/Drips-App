import * as React from 'react';
import { Text, View, StyleSheet,Dimensions, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../../constants';
import { RootState } from '../../store/reducers';
const{
  width,height
} = Dimensions.get('window');
interface LoaderProps {}

const Loader = (props: LoaderProps) => {
    const loader = useSelector((state:RootState) => state.AppReducer.loader)
    if(!loader) return null;
    return (
        <View style={[styles.container]}>
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent:'center',
    alignItems: 'center',
    width,
    height,
    backgroundColor:'rgba(0,0,0,.4)',
    zIndex:999999
  }
});
