import { call, put, select } from "redux-saga/effects";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import { fetchMedicalHistory, fetchTestResults, updateConsultantData, updateUserStates } from "../actions/UserActions";
import {
  getSymptomsApi,
  consultationReqApi,
  getPatientProfileApi,
  getConsultantDetailsApi,
  bookApointmentApi,
  getMedicalHistoryApi,
  updateMedicalHistoryApi,
  fetchPrescriptionsApi,
  fetchTestResultsApi,
  getAllTestResultApi,
  addTestResultApi,
  deleteTestResultApi,
  fetchOrdersApi,
  fetchResultsApi,
  fetchAttchApi
} from "../services/Services";
import store from "..";
import { navigate, onBack, popToTop } from "../../navigation/RootNavigation";
import { selectUserState } from "../selectors/userSelector";
import { setItem } from "../../utils/localStorage";

export function* getSymptoms(): any {
  yield put(enableLoader());
  const response = yield call(getSymptomsApi);
  yield put(disableLoader());
  if(response.code === '200' ){
    yield put(showToast('Symptoms fetched successfully!'));
    yield put( updateUserStates({ symptoms: [...response.data,{ id: 5457, name: "Other", selected: false }] }) );
  } else {
    errorHandler(response);
  }
}

export function* getPatientProfile(action): any {
  const { user,userType,token } = yield select( selectUserState );
  yield put(enableLoader());
  let body:any = {
    id:user.user_id,
    user_type:userType
  }
  if(action.payload){
    body = action.payload
  }
  const response = yield call(getPatientProfileApi,{
    id: action.payload?.id ? action.payload?.id: user.user_id,
    user_type:action.payload?.id ? 1: userType
  });
  yield put(disableLoader());
  console.log("klsvbklsdbvklsdbkvbsdbvksdbvlksdbkvbsdkvdfgdfgdfgdfgdfbl;bsd.",response,{
    id: action.payload?.id ? action.payload?.id: user.user_id,
    user_type:action.payload?.id ? 1: userType
  },userType)
  if(response.code === '200' ){
    const data = response.patientinfo[0] && response.patientinfo[0] || null;
    if(data){
      if(!action.payload){
        const authObj: any = {
          'user': { ...user, ...data },
          token,
          userType
        };
console.log("klsvbklsdbvklsdbkvbsdbvksdbvlksdbkvbsdkvbl;bsd.",response)
        
        setItem('user_data', authObj);
        yield put( updateUserStates(authObj) );
      }else{
        console.log
        yield put( updateConsultantData({
          patientDetails:data
        }) );
      }
    }
  }
}

export function* getPatientDetails(): any {
  yield put(enableLoader());
  const response = yield call(getSymptomsApi);
  yield put(disableLoader());
  if(response.code === '200' ){
    yield put( updateUserStates({ symptoms: response.data }) );
  } else {
    errorHandler(response);
  }
}

export function* createConsultantReq(action: any): any {
  yield put(enableLoader());
  const response = yield call(
    consultationReqApi,
    action.payload
  );
  yield put(disableLoader());
  console.log("klsdbvklasdbklvbdsklbvlsdbvds",response)
  if(response.code === '200' ){
    if(response.data.doctors && response.data.doctors.length!==0){
      yield put( updateConsultantData({ availableConsultants: response.data.doctors , problemDetail:response.data.consultation_data}) );
      navigate('SelectPhysician' as never);
    }else{
      yield put(showToast('No Consutants Found!'));
    }
  } else {
    errorHandler(response);
  }
}

export function* getConsultantDetails(action: any): any {
  yield put(enableLoader());
  const response = yield call(
    getConsultantDetailsApi,
    action.payload?.id
  );
      console.log("lksdblvkbsdlkvblksdbvklsbdlkvbsldkbvksbvjdbfjksgdkjfsdgflksd",response, action.payload)
  yield put(disableLoader());
  if(response.code === '200' ){
    yield put( updateConsultantData({ apointmentDetails: response.data }) );
  } else {
    console.log("lksdblvkbsdlkvblksdbvklsbdlkvbsldkbvksbvlksd",response)
    errorHandler(response);
  }
}

export function* getMedicalHistoryReq(): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    getMedicalHistoryApi,
    {patient_id:user.user_id}
  );
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    console.log("ljksdbvklsdbklbsdklvbsdklvbklsdbklsdbksdblk;dsbl;vk",response.data)
    // yield put(showToast('Medical History Fetched Successfully!'));
    const convertStringToArray = (string:string)=> {
      if(string.length <= 0 || string == null) return []
      return string.includes(',') ? string.split(',') : [string]
    }
    let data = {
      allergies:response.data.allergies|| [],
      Surgeries1:response.data.surgicalHistory||[],
      past_medical_history:response.data.MedicalHistory||[],
      Current_medication1:response.data.Current_medication1||[],
      family_medical_condition:response.data.family_medical_condition||[],
    }
    // let data = {
    //   allergies:convertStringToArray(response.data.allergies ?? []) || [],
    //   Surgeries1:convertStringToArray(response.data.surgicalHistory?? [])||[],
    //   past_medical_history:convertStringToArray(response.data.MedicalHistory?? [])||[],
    // }
    console.log('medical history response ===>',data);
    
    //Surgeries1,past_medical_history
    yield put( updateUserStates({ medicalHistory: data }) );
  } else {
    errorHandler(response);
  }
}

export function* updateMedicalHistoryReq(action: any): any {
  yield put(enableLoader());
  console.log("aksdgviosbdoivgeovgwegiovgeiovgewiovgioewvioewl0",action)
  const response = yield call(
    updateMedicalHistoryApi,
    action.payload
  );
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    yield put(showToast('Medical History Updated Successfully!'));
    yield put(fetchMedicalHistory());
    onBack();
  } else {
    errorHandler(response);
  }
}

export function* fetchPrescriptionReq(): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    fetchPrescriptionsApi,
    user.user_id
  );
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    yield put( updateUserStates({ prescriptionData:response.data }) );
  } else {
    errorHandler(response);
  }
}
export function* fetchOrdersReq(): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    fetchOrdersApi,
    user.user_id
  );
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    yield put( updateUserStates({ orderData:response.data }) );
  } else {
    errorHandler(response);
  }
}
export function* fetchRsultsReq(action): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    fetchResultsApi,
    action.paylaod
  );
  console.log("hdivbwbsdvbsbvbsbdvbsbdvbslidbvlsdblvkbsdklvsd",response)
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    yield put( updateUserStates({ resultData:response.data }) );
  } else {
    errorHandler(response);
  }
}
export function* fetchAttchmentsReq(action): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    fetchAttchApi,
    action.paylaod
  );
  console.log("hdivbwbsdvbsbvbsbdvbsbdvbslidbvlsdblvkbsdklvsd",response)
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    yield put( updateUserStates({ attachmentsData:response.data }) );
  } else {
    errorHandler(response);
  }
}
export function* fetchTestResultsReq(): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    getAllTestResultApi,
    user.user_id
  );
  yield put(disableLoader());
  console.log("responseresponseresponseresponseresponseresponseresponse",response)
  if(response.status && response.code === '200'){
    yield put( updateUserStates({ testResults:response?.alltestresult || [] }) );
    // if(typeof response?.alltestresult === 'object'){
    //   yield put( updateUserStates({ testResults:response?.alltestresult || [] }) );
    // }else{
    //   yield put( updateUserStates({ testResults:[] }) );
    // }
  } else {
    errorHandler(response);
  }
}
export function* uploadTestResultReq(action:any): any {
  yield put(enableLoader());
  const { user } = yield select( selectUserState );
  const response = yield call(
    addTestResultApi,
    action.payload
  );
  console.log("sjkldbvklsdbvklbdsklvbsdlvbklsdbvsdbvksdbkl",action.payload,response)
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    // yield put( updateUserStates({ testResults:response.data }) );
    yield put( fetchTestResults() );
  } else {
    errorHandler(response);
  }
}
export function* deleteTestResultReq(action:any): any {
  yield put(enableLoader());
  const response = yield call(
    deleteTestResultApi,
    action.id
  );
  yield put(disableLoader());
  if(response.status && response.code === '200'){
    // yield put( updateUserStates({ testResults:response.data }) );
    yield put( fetchTestResults() );
  } else {
    errorHandler(response);
  }
}
