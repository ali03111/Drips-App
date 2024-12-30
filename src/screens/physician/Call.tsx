import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";
import { IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Typography } from "../../components/atoms";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import InIcon from "react-native-vector-icons/Ionicons";
import { onBack } from "../../navigation/RootNavigation";

const Call = (props) => {

  const dispatch = useDispatch();
  const [ callEnable, setCallEnable] = useState(true);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>

      { !callEnable && <CallEndedOverlay onPress={ () => setCallEnable( !callEnable ) } /> }

      <ImageBackground
        source={IMAGES.patient}
        style={{ flex: 1, padding: 20, paddingTop: 50 }}
        resizeMode="cover"
      >
        { callEnable && <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Image
            source={IMAGES.doctor1}
            style={{ height: 200, width: 120, borderRadius: 10 }}
          />

          <View>
            <View
              style={{
                backgroundColor: "#ffffffad",
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                width: 150,
              }}
            >
              <Typography size={16}>Time Left</Typography>
              <Typography size={20}>04:50</Typography>
            </View>
          </View>
        </View>}

        <TouchableOpacity
          onPress={ () => setCallEnable( !callEnable ) }
          style={ styles.btnContainer }
        >
          <View style={ styles.callBtn } >
            <InIcon name={"call-sharp"} size={40} color={"#fff"} />
          </View>
          <Typography color="#fff">Cancel</Typography>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const CallEndedOverlay = ({ onPress }) => {

  return (<View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#00000096",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 99,
    }}
  >
    <TouchableOpacity 
      onPress={ () => onBack() }
      style={{
      position: 'absolute',
      top: 40,
      right: 40
    }}>
      <FaIcon name={'times'} size={30} color={'#fff'} />
    </TouchableOpacity>


    <View
      style={{
        backgroundColor: "#ffffffad",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        width: 150,
      }}
    >
      <Typography size={16}>Time Left</Typography>
      <Typography size={20}>04:50</Typography>
    </View>

    <TouchableOpacity
      onPress={ onPress }
      style={ styles.btnContainer }
    >
      <View style={[ styles.callBtn, { backgroundColor: "#6bef52" } ]} >
        <InIcon name={"call-sharp"} size={40} color={"#fff"} />
      </View>
      <Typography color="#fff">Call Again</Typography>
    </TouchableOpacity>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  callBtn: {
    width: 60,
    height: 60,
    backgroundColor: "#EF5261",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    alignItems: "center",
    position: "absolute",
    alignSelf: "center",
    bottom: 100,
  }
});

export default Call;
