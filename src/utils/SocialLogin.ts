import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import {
  LoginManager,
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from "react-native-fbsdk";
import store from "../store";
import { showToast } from "../store/actions/AppActions";
import { socialLoginAction } from "../store/actions/UserActions";

const profileRequestParams = {
  fields: {
    string: "id, name, email, first_name, last_name, gender, picture",
  },
};

const profileRequestConfig = {
  httpMethod: "GET",
  version: "v2.5",
  parameters: profileRequestParams,
};

export const googleLogin = async (res: any = {}) => {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId:
      "51935680091-sgr7i017r0ahdtdid3arbtukfltfljv2.apps.googleusercontent.com",
    webClientId:
      "51935680091-v1j9jrdl1daipcs569e1p4rnh6v27qq2.apps.googleusercontent.com",
    offlineAccess: false,
  });

  return new Promise(async (resolve, reject) => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      resolve(userInfo.user);
    } catch (error: any) {

      
      store.dispatch(showToast(error.toString()));
      reject(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  });
};

export const facebookLogin = async (res: any = {}) => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only");
    }

    LoginManager.logInWithPermissions(["public_profile"]).then(
      function (result: any) {
        if (result.isCancelled) {
          
        } else {
          
            "Login success with permissions: " +
            result.grantedPermissions.toString()
          );

          AccessToken.getCurrentAccessToken().then((data: any) => {
            

            const infoRequest = new GraphRequest(
              "/me",
              profileRequestConfig,
              (error: any, result: any) => {
                if (error) {
                  store.dispatch(showToast(error.toString()));
                  
                } else {
                  resolve(result);
                  
                }
              }
            );
            // Start the graph request.
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function (error: any) {
        
        store.dispatch(showToast(error));
        reject(error);
      }
    );
  });
};
