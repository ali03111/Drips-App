// import Geolocation from "@react-native-community/geolocation";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';

const PermissionCheck = async () => {
  if( Platform.OS === 'ios' ){
    return await Geolocation.requestAuthorization('whenInUse');
  }else{
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  }
}

export const getCurrentLocation = async (ask = true) => {

    const granted = await PermissionCheck();
    if( granted === 'granted' ){

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve(position.coords);
          },
          (error) => {
  
            if (error.PERMISSION_DENIED == 1 ) {
              
              Alert.alert(
                'Permission Denied', 
                'Please open your location from settings',
                [
                  {
                    text: "Open Settings",
                    onPress: () => {
  
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      } else {
                        Linking.openSettings();
                      }
                    }
                  },
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                  }
                ]
              );
  
            } else {
              reject(error);
            }
          },
          (Platform.OS === 'ios') ? {
            enableHighAccuracy: true, 
            timeout: 20000, 
            maximumAge: 1000 
          } : {}
        );
      });

    } 
    
};
