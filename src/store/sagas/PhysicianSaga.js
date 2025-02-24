import { call, put, select } from "redux-saga/effects";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import {
  fetchMedicalHistory,
  updateConsultantData,
  updateUserStates,
} from "../actions/UserActions";
import { fetchPhysicianPatientsApi } from "../services/Services";
import store from "..";
import { navigate, onBack, popToTop } from "../../navigation/RootNavigation";
import { selectScreen, selectUserState } from "../selectors/userSelector";
import { setItem } from "../../utils/localStorage";

export function* getPhysicianPatients(action) {
  const { title } = yield select(selectScreen);

  const URlObj = {
    "Scheduled Consultations": "/all-patients",
    "All Consultations": "/all-patients",
    "Past Consultations": "/past-consultation",
  };
  console.log("actionactionactionactionactionactionaction", title);

  const { user, userType, token } = yield select(selectUserState);
  yield put(enableLoader());
  const response = yield call(fetchPhysicianPatientsApi, {
    doctor_id: user.user_id,
    url: URlObj[title ?? action.payload?.payload],
  });
  yield put(disableLoader());

  if (response.code === "200") {
    yield put(showToast("Patients fetched successfully!"));
    yield put(updateConsultantData({ physicianPatients: response.data }));
  } else {
    errorHandler(response);
  }
}
