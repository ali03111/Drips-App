import { call, put, select } from "redux-saga/effects";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import { fetchMedicalHistory, updateConsultantData, updateUserStates } from "../actions/UserActions";
import {
  fetchPhysicianPatientsApi,
} from "../services/Services";
import store from "..";
import { navigate, onBack, popToTop } from "../../navigation/RootNavigation";
import { selectUserState } from "../selectors/userSelector";
import { setItem } from "../../utils/localStorage";

export function* getPhysicianPatients(): any {
  const { user,userType,token } = yield select( selectUserState );
  yield put(enableLoader());
  const response = yield call(fetchPhysicianPatientsApi,{
    doctor_id:user.user_id
  });
  yield put(disableLoader());
  if(response.code === '200' ){
    yield put(showToast('Patients fetched successfully!'));
    yield put( updateConsultantData({ physicianPatients: response.data }) );
  } else {
    errorHandler(response);
  }
}