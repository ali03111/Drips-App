import { call, put, select } from "redux-saga/effects";
import { navigate } from "../../navigation/RootNavigation";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader } from "../actions/AppActions";
import { updateStates } from "../actions/UserActions";
import {
  accountApi,
  getAccountApi,
  removeAccountApi,
} from "../services/Services";


export function* getAccountSaga(): any {
  yield put(enableLoader());
  const response = yield call( getAccountApi );
  yield put(disableLoader());
  if ("response" in response) {
    yield put( updateStates({ account: response.response.data }) );
  } else {
    errorHandler(response);
  }
}

export function* postAccountSaga({ payload }: any): any {
  yield put(enableLoader());
  const response = yield call( accountApi, payload );
  yield put(disableLoader());

  if ("response" in response) {
    yield put( updateStates({ account: response.response.data }) );
  } else {
    errorHandler(response);
  }
}

export function* removeAccountSaga(): any {
  yield put(enableLoader());
  const response = yield call( removeAccountApi );
  yield put(disableLoader());

  if ("response" in response) {
    yield put( updateStates({ account: null }) );
  } else {
    errorHandler(response);
  }
}
