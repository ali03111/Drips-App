import { Platform } from "react-native";
import { getBrand, getSystemVersion, getUniqueId, getVersion } from "react-native-device-info";
import { call, put, select } from "redux-saga/effects";
import { navigate, reset } from "../../navigation/RootNavigation";
import { getItem, setItem } from "../../utils/localStorage";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import { updateStates as updateAppStates } from "../actions/AppActions";
import { updateStates as updateUserStates } from "../actions/UserActions";
import { selectAppState } from "../selectors/appSelector";
import { selectUser } from "../selectors/userSelector";
import {
  getUserApi,
  getUsersApi,
  setScheduleApi,
  toggleFavoriteApi,
  userUpdateApi,
  getAllSlotsApi,
  getTimeSlotsApi,
  getQuestions,
  getMyProfileApi,
  getNotificationsApi,
  updateBusinessApi,
  updateServiceApi,
  setDeviceApi,
} from "../services/Services";

export function* userUpdate({ payload }: any): any {
  const formData = yield call(updateUserFormData, payload);
  yield put(enableLoader());
  const response = yield call(userUpdateApi, formData);
  yield put(disableLoader());

  if ("response" in response) {
    yield call(updateUserModel, response.response.data);

    if (response.response.data.user_type == "service_provider") {
      response.response.data.schedule.length > 0 ? reset("Tabs") : navigate("Schedule");
    } else {
      reset("Tabs");
    }
  } else {
    errorHandler(response);
  }
}

export function* updateBusinessSaga({ payload, redirect }: any): any {
  
  const user = yield select( selectUser );

  const formData = yield call(updateUserFormData, payload);
  yield put(enableLoader());
  const response = yield call( updateBusinessApi, formData);

  yield put(disableLoader());
  if ("response" in response) {
    
    yield call(
      updateUserModel, 
      { ...user, business: response.response.data },
      (redirect ? 'ServiceForm' : "")
    );

    if( redirect ){
      navigate('ServiceForm');
    }else{
      yield put( showToast('Busines Profile Updated Successfully') )
    }
    
  } else {
    errorHandler(response);
  }
}

export function* updateServiceSaga({ payload }: any): any {
  
  const user = yield select( selectUser );
  yield put(enableLoader());
  const response = yield call( updateServiceApi, payload);

  yield put(disableLoader());
  if ("response" in response) {
    yield call(
      updateUserModel, 
      { ...user, services: response.response.data },
      'Schedule'
    );
    navigate('Schedule');
  } else {
    errorHandler(response);
  }
}

export function* updateScehdule({ payload }: any): any {

  const user = select( selectUser );

  yield put(enableLoader());
  const response = yield call(setScheduleApi, { schedule: payload });
  yield put(disableLoader());

  if ("response" in response) {
    yield call( updateUserModel, { ...user, schedule: response.response.data } );
    reset("Tabs");
  } else {
    errorHandler(response);
  }
}

export function* myProfile(): any {
  const response = yield call(getMyProfileApi);
  if ("response" in response) {
    yield call(updateUserModel, response.response.data);
  } else {
    errorHandler(response);
  }
}

export function* userList({ payload }: any): any {
  const { favorite, providers } = yield select( selectAppState );

  yield put(enableLoader());
  const response = yield call(getUsersApi, payload);
  yield put(disableLoader());

  if ("response" in response) {
    if (payload.page === 1 || !payload.page) {
      if (payload.favorite == 1) {
        yield put(updateAppStates({ favorite: response.response }));
      } else {
        yield put(updateAppStates({ providers: response.response }));
      }
    } else {
      if (payload.favorite == 1) {
        yield put(
          updateAppStates({
            favorite: {
              data: [...favorite.data, ...response.response.data],
              pagination: response.response.pagination,
            },
          })
        );
      } else {
        yield put(
          updateAppStates({
            providers: {
              data: [...providers.data, ...response.response.data],
              pagination: response.response.pagination,
            },
          })
        );
      }
    }
  } else {
    errorHandler(response);
  }
}

export function* userView(action: any): any {
  const provider = select((state: any) => state.AppReducer.provider);

  yield put(enableLoader());
  const response = yield call(getUserApi, action.id);
  yield put(disableLoader());

  if ("response" in response) {
    yield put(
      updateAppStates({
        providerId: response.response.data.id,
        provider: { ...provider, ...response.response.data },
      })
    );
    navigate(action.navigate);
  } else {
    errorHandler(response);
  }
}

export function* toggleFavorite({ payload }: any): any {
  const providers = yield select((state: any) => state.AppReducer.providers);

  yield put(enableLoader());
  const response = yield call(toggleFavoriteApi, payload.id);
  yield put(disableLoader());

  if ("response" in response) {
    const index = providers.data.findIndex((i) => i.id === payload.id);
    const updated = [...providers.data];
    updated[index].is_liked = !updated[index].is_liked;
    yield put(
      updateAppStates({
        providers: {
          data: updated,
          pagination: providers.pagination,
        },
      })
    );
  } else {
    errorHandler(response);
  }
}

export function* getAllSlots(action: any): any {
  yield put(enableLoader());
  const response = yield call(getAllSlotsApi, action.id);
  yield put(disableLoader());

  if ("response" in response) {
    yield put(updateAppStates({ slots: response.response.data }));
  } else {
    errorHandler(response);
  }
}

export function* getQuestionnaire(action: any): any {
  yield put(enableLoader());
  const response = yield call(getQuestions, action.id);
  yield put(disableLoader());

  if ("response" in response) {
    yield put(updateAppStates({ questions: response.response.data }));
  } else {
    errorHandler(response);
  }
}

export function* getDateSlots(action: any): any {
  yield put(enableLoader());
  const response = yield call(getTimeSlotsApi, action.payload);
  yield put(disableLoader());

  if ("response" in response) {
    yield put(updateAppStates({ dateSlots: response.response.data }));
  } else {
    errorHandler(response);
  }
}

export function* getNotifications(action: any): any {
  yield put(enableLoader());
  const response = yield call(getNotificationsApi);
  yield put(disableLoader());

  if ("response" in response) {
    yield put(
      updateUserStates({
        notifications: {
          data: response.response.data,
          pagination: response.response.pagination,
        },
      })
    );
  } else {
    errorHandler(response);
  }
}

export function* setDeviceSaga(): any {

  const user = yield select( selectUser );
  const { fcmToken } = yield select( selectAppState );

  const response = yield call( setDeviceApi, {
    udid: getUniqueId(),
    device_token: fcmToken,
    device_type: Platform.OS,
    device_brand: getBrand(),
    device_os: getSystemVersion(),
    app_version: getVersion()
  } );

  if( 'response' in response ){
    yield call(updateUserModel, response.response.data);
    
  } else {
    errorHandler(response)
  }
}

function* updateUserModel(data: any, route = "Tab" ): any {

  const key = yield call(getItem, "key");
  key.user = { ...key.user, ...data };
  key.defaultRoute = route;

  if( data.service_provider_type === 'business' ){
    if( !data.business ){
      key.defaultRoute = "Welcome";
    }else if( data.services.length === 0 ){
      key.defaultRoute = "ServiceForm";
    }else if( data.schedule.length === 0 ){
      key.defaultRoute = "Schedule";
    }
  }else if( data.service_provider_type === 'individual' ){
    if( data.services.length === 0 ){
      key.defaultRoute = "Welcome";
    }else if( data.schedule.length === 0 ){
      key.defaultRoute = "Schedule";
    }
  }

  setItem("key", key);
  yield put(
    updateUserStates({
      user: key.user
    })
  );

}

function* updateUserFormData(payload: any): any {
  if (payload["services"])
    payload["services"] = payload["services"].map((item: any) => item.id);

  const formData = new FormData();
  for (let key in payload) {
    if (key === "services") {
      payload[key].forEach((item: any) => {
        formData.append(`${key}[]`, item);
      });
    } else if (key === "preferred" || key === "remove_preferred") {
      payload[key].forEach((item: any, index: number) => {
        for (const [name, value] of Object.entries(item)) {
          formData.append(`${key}[${index}][${name}]`, value);
        }
      });
    } else {
      formData.append(key, payload[key]);
    }
  }

  return formData;
}
