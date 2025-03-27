import { call, put, select, take } from "redux-saga/effects";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import {
  bookApointmentApi, getDoctorDetailsApi, getPatientApointmentApi, requestDoctorApi,
} from "../services/Services";
import {  popToTop,onBack, navigate } from "../../navigation/RootNavigation";
import store from "..";
import { UPDATE_CONSULTANT_STATE, getConsultantDetailAction, updateConsultantData, updateUserStates } from "../actions/UserActions";
import { selectConsultantState, selectUserState } from "../selectors/userSelector";

export function* createBookReq(action: any): any {
  yield put(enableLoader());
  const response = yield call(
    bookApointmentApi,
    action.payload
  );
  console.log("responseresponseresponseresponseresponseresponse",response)
  yield put(disableLoader());
  if(response.code === '200' ){
    yield put(showToast('Booking Created Successfully!'));
    if(response.data.consultation_data.appointment_id){
      yield put(getConsultantDetailAction({id:response.data.consultation_data.appointment_id}));
      yield take(UPDATE_CONSULTANT_STATE)
      const { apointmentDetails } = yield select( selectConsultantState );
      popToTop();
      navigate("ConsultantDetails" as never, { item:apointmentDetails } as never)
      // yield put( updateConsultantData({ latestBookingDetails: response.data.consultation_data }) );
    }
    /* if(response.data.doctors && response.data.doctors.length!==0){
    }else{
      yield put(showToast('No Consutants Found!'));
    } */
  } else {
    errorHandler(response);
  }
}
export function* getPatientApointmentsReq(action: any): any {
  yield put(enableLoader());
  const { user,userType,token } = yield select( selectUserState );
  const response = yield call(
    getPatientApointmentApi,
    {patient_id:user.user_id}
  );
  yield put(disableLoader());
  if(response.data){
    yield put(showToast('Appointments Fetched Successfully!'));
    yield put( updateConsultantData({ apointmentList: response.data }) );
    /* if(response.data.doctors && response.data.doctors.length!==0){
      yield put( updateConsultantData({ availableConsultants: response.data.doctors }) );
    }else{
      yield put(showToast('No Consutants Found!'));
    } */
  } else {
    errorHandler(response);
  }
}

export function* getDoctorDetailsReq(action: any): any {
  yield put(enableLoader());
  const { userType } = yield select( selectUserState );
  const response = yield call(
    getDoctorDetailsApi,
    action.payload
  );
  yield put(disableLoader());
  
  if(response.code === '200'){
    yield put( updateConsultantData({ doctorDetails: response.doctorinfo[0] }) );
    /* if(userType===1)
    else
    yield put( updateConsultantData({ physicianProfile: response.doctorinfo[0] }) ); */
  } else {
    // errorHandler(response);
    // onBack();
  }
}

export function* requestDoctorSaga(action: any): any {
  yield put(enableLoader());
  const response = yield call(
    requestDoctorApi,
    action.payload
  );
  yield put(disableLoader());
  
  if(response.code === '200'){
    yield put(showToast(response.message || 'Request Submitted Successfully!'));
  } else {
    errorHandler(response);
  }
}
