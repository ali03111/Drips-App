import { Alert, Platform } from 'react-native';
import { getBaseOs, getBrand, getSystemVersion, getUniqueId, getVersion } from 'react-native-device-info';
import { call, put, select } from 'redux-saga/effects';
import { navigate, onBack, reset } from '../../navigation/RootNavigation';
import { removeItem, setItem } from '../../utils/localStorage';
import { errorHandler, serializeObject } from '../../utils/utils';
import { disableLoader, enableLoader, showToast } from '../actions/AppActions';
import { fetchPatientDetailsAction, RESET_USER_STATE, updateUserStates } from '../actions/UserActions';
import { selectAppState } from '../selectors/appSelector';
import { selectAppReducer, selectUser, selectUserState } from '../selectors/userSelector';
import { changePasswordApi,updateProfileApi,updateDeviceDetailsApi, forgotPasswordApi, loginApi, logoutApi, registerApi, userUserData, userUserDataUploadImage } from '../services/Services';
import store from "../../store";
import { convertFormData } from './AppSaga';
import { onUserLogin } from '../../utils/ZegoCloudConfig';

export function* authenticate(action: any): any {

  const appState = yield select( selectAppState );
  const user = yield select( selectUser );
  const { fcmToken } = yield select( selectAppState );

  yield put( enableLoader() );
  const response = yield call( loginApi, {
    ...action.payload,
    /* udid: getUniqueId(),
    device_token: fcmToken,
    device_type: Platform.OS,
    device_brand: getBrand(),
    device_os: getSystemVersion(),
    app_version: getVersion() */
  } );
  yield put( disableLoader() );

  if(response.code === '200' ){
    const data = response.data;
    onUserLogin({
      userID:data.id,
      userName:data.name,
    })
    const authObj: any = {
      'user': { ...user, ...data,user_id:data.id },
      'token': data.token,
      'userType': appState.userType,
      // 'providerType': data.service_provider_type,
    };
    setItem('user_data', authObj);
    yield put( updateUserStates(authObj) );
  } else {
    if(appState.userType === 2){
      response.message = 'Invalid MDCN or Password'
    }
    errorHandler(response)
  }
}

export function* updateUserData(action: any): any {
  console.log("actionactionactionactionactionactionactionaction",action,selectAppReducer)
  const { user } = yield select( selectUserState );
  const appState = yield select( selectAppState );
  yield put( enableLoader() );
  let response:any = {};
  if(action.payload.pic || action.payload.formData){
    if(action.payload.formData) delete action.payload.formData;
    const formData = yield call(convertFormData, action.payload);
    response = yield call(userUserDataUploadImage,`${action.step}/${user.user_id}`, formData);
  }else{
    response = yield call( userUserData,
      `${action.step}/${user.user_id}`,
      {
      ...action.payload,
      email:user.email
      } 
    );
  }
  yield put( disableLoader() );
  if(response.code === '200' ){
    const resData = response.user;
    const authObj: any = {
      'user': {...user,...resData},
      'userType': store.getState().AppReducer.userType
    };
    yield put( updateUserStates(authObj) );
    setItem('signup_data', authObj);
    setItem('signup_step', action.step);
    if(!action.payload.pic)
      navigate(action.routeName as never);
    else{
    onUserLogin({
      userID:resData?.id,
      userName:resData?.name,
    })
    const authObj: any = {
      'user': { ...resData, ...resData,user_id:resData.id },
      'token': resData.token,
      'userType': appState.userType,
      // 'providerType': data.service_provider_type,
    };
    setItem('user_data', authObj);
    yield put( updateUserStates(authObj) );}
  } else {
    errorHandler(response)
  }
} 

export function* register(action: any): any {

  const { fcmToken } = yield select( selectAppState );
  yield put( enableLoader() );
  const response = yield call( registerApi, {
    ...action.payload,
  } );
  yield put( disableLoader() );
  if(response.code === '200' ){
    const resData = response.user;
    const authObj: any = {
      'user': {...resData,user_id:resData.id},
      'userType': store.getState().AppReducer.userType
    };
    authObj['defaultRoute'] = 'Welcome';
    yield put( updateUserStates(authObj) );
    setItem('signup_data', authObj);
    navigate('ContactInfo' as never);
  } else {
    console.log("kjsbdvjksbkvbsdklvbsdklbvdklsbvkldsbvklsdblvksdblkvksldbvksdbvsdv",response)
    // store.dispatch(showToast("Something went wrong"));
    errorHandler(response)
  }
} 

export function* logout(): any {
  const { fcmToken } = yield select( selectAppState );
  
  yield put( enableLoader() );
  const response = yield call( logoutApi, { device_token: fcmToken } );
  yield put( disableLoader() );

  if( 'response' in response ){
    removeItem('key');
    yield put( { type: RESET_USER_STATE } );
  } else {
    errorHandler(response)
  }
} 

export function* changePassword({ payload }: any): any {
  
  yield put( enableLoader() );
  const response = yield call( changePasswordApi, payload );
  yield put( disableLoader() );

  if( 'response' in response ){
    yield put( showToast( response.response.messages[0] ) );
    onBack();
  } else {
    errorHandler(response)
  }
}

export function* forgotPassword({ payload }: any): any {
  
  yield put( enableLoader() );
  const response = yield call( forgotPasswordApi, payload );
  yield put( disableLoader() );

  if(response.code === '200' ){
    yield put( showToast( response.message ) );
    onBack();
  } else {
    errorHandler(response)
  }
}
export function* updateProfile({ payload }: any): any {
  
  yield put( enableLoader() );
  const response = yield call( updateProfileApi, payload );
  yield put( disableLoader() );

  if(response.code === '200' ){
    yield put( showToast( response.message ) );
    yield put( fetchPatientDetailsAction() );
    onBack();
  } else {
    errorHandler(response)
  }
}

export function* updateDevice({ payload }: any): any {
  
  // yield put( enableLoader() );
  const queryString:string = serializeObject(payload);
  const response = yield call( updateDeviceDetailsApi,queryString );
  // yield put( disableLoader() );

  if(response.code === '200' ){
    // yield put( showToast( response.message ) );
    yield put( fetchPatientDetailsAction() );
    onBack();
  } else {
    errorHandler(response)
  }
}
