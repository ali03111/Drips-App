import { takeLatest,takeEvery } from "redux-saga/effects";
import {
  AUTHENTICATE,
  REGISTER,
  UPDATE_USER_DATA,
  UPDATE_MY_PROFILE,
  MY_PROFILE,
  USER_UPDATE,
  LOGOUT,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  FETCH_SYPTOMS,
  CREATE_CONSULTANT_REQ,
  FETCH_PATIENT_DETAILS,
  FETCH_CONSULTANT_DETAILS,
  CREATE_BOOKING_REQ,
  GET_PATIENT_APPOINTMENTS,
  GET_DOCTOR_DETAILS,
  UPDATE_DEVICE,
  GET_MEDICAL_HISTORY,
  UPDATE_MEDICAL_HISTORY,
  FETCH_PRESCRIPTIONS,
  FETCH_TEST_RESULTS,
  SELECT_DOCTOR_REQUEST,
  UPLOAD_TEST_RESULT,
  DELETE_TEST_RESULT
} from "../actions/UserActions";
import {
  INIT,
} from "../actions/AppActions";

import {
  authenticate,
  changePassword,
  forgotPassword,
  logout,
  register,
  updateDevice,
  updateProfile,
  updateUserData
} from "./AuthSaga";
import { init } from "./AppSaga";
import {
  myProfile,
  userUpdate,
} from "./UserSaga";
import { createMessageSaga, getMessageSaga } from "./ChatSaga";
import { CREATE_MESSAGE, GET_MESSAGES } from "../actions/ChatActions";
import { createConsultantReq, getConsultantDetails, getPatientProfile, getSymptoms,getMedicalHistoryReq, updateMedicalHistoryReq, fetchPrescriptionReq, fetchTestResultsReq, uploadTestResultReq, deleteTestResultReq } from "./PatientSaga";
import { createBookReq, getDoctorDetailsReq, getPatientApointmentsReq, requestDoctorSaga, } from "./BookingSaga";
import { GET_PHYSICIAN_PATIENTS } from "../actions/PhysicianActions";
import { getPhysicianPatients } from "./PhysicianSaga";

export default function* mySaga() {
  yield takeLatest(AUTHENTICATE, authenticate);
  yield takeLatest(INIT, init);
  yield takeLatest(REGISTER, register);
  yield takeLatest(UPDATE_USER_DATA, updateUserData);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(FETCH_PATIENT_DETAILS, getPatientProfile);

  yield takeLatest(CHANGE_PASSWORD, changePassword);
  yield takeLatest(FORGOT_PASSWORD, forgotPassword);
  yield takeLatest(UPDATE_MY_PROFILE, updateProfile);
  yield takeLatest(UPDATE_DEVICE, updateDevice);

  yield takeLatest(FETCH_SYPTOMS, getSymptoms);
  yield takeLatest(CREATE_CONSULTANT_REQ, createConsultantReq);
  yield takeLatest(FETCH_CONSULTANT_DETAILS, getConsultantDetails);
  yield takeLatest(CREATE_BOOKING_REQ, createBookReq);
  yield takeLatest(GET_PATIENT_APPOINTMENTS, getPatientApointmentsReq);
  yield takeLatest(GET_DOCTOR_DETAILS, getDoctorDetailsReq);
  yield takeLatest(GET_MEDICAL_HISTORY, getMedicalHistoryReq);
  yield takeLatest(UPDATE_MEDICAL_HISTORY, updateMedicalHistoryReq);
  yield takeLatest(FETCH_PRESCRIPTIONS, fetchPrescriptionReq);
  
  yield takeLatest(FETCH_TEST_RESULTS, fetchTestResultsReq);
  yield takeLatest(UPLOAD_TEST_RESULT, uploadTestResultReq);
  yield takeLatest(DELETE_TEST_RESULT, deleteTestResultReq);

  yield takeLatest(USER_UPDATE, userUpdate);
  yield takeLatest(MY_PROFILE, myProfile);
  
  // yield takeLatest(GET_ACTIVITY, getNotifications);

  yield takeLatest(GET_MESSAGES, getMessageSaga);
  yield takeLatest(CREATE_MESSAGE, createMessageSaga);
  
  //Physician Apis
  yield takeLatest(GET_PHYSICIAN_PATIENTS, getPhysicianPatients);
  
  yield takeLatest(SELECT_DOCTOR_REQUEST, requestDoctorSaga);
}
