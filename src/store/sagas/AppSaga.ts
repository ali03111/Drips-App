import { call, put, select } from 'redux-saga/effects';
import { navigate } from '../../navigation/RootNavigation';
import { getItem, setItem } from '../../utils/localStorage';
import { errorHandler } from '../../utils/utils';
import { disableLoader, enableLoader, showToast, updateStates } from '../actions/AppActions';
import { updateStates as updateUserState } from '../actions/UserActions';
import { customerHomeApi, getContentApi, getFranchiseApi, getInfoApi, getServiceApi } from '../services/Services';
import { setDeviceSaga } from './UserSaga';

export function* init(): any {

  yield call( getInfo );
  yield call( getFranchises );
  yield call( getServices );
  const response = yield call( getItem, 'key' );

  yield put(updateStates({ splash: false }));
  if( response ){
    yield put( updateUserState(response) );
    yield call( setDeviceSaga );
  }

}

export function* getFranchises(): any {
  const response = yield call(getFranchiseApi);
  if( 'response' in response ){
    yield put(updateStates({
      franchises: response.response.data,
    }));
  } else {
    errorHandler(response)
  }
}

export function* getServices(): any {
  // yield put( enableLoader() );
  const response = yield call(getServiceApi, 0);
  // yield put( disableLoader() );
  if( 'response' in response ){
    yield put(updateStates({
      services: response.response.data
    }));
  } else {
    errorHandler(response)
  }
}

export function* getInfo(): any {
  let response = yield call( getItem, 'info' );
  if( !response ){
    response = yield call(getInfoApi);
    setItem('info', response);
  }
  yield put(updateStates({ info: response }));
}

export function* getHome(): any {
  yield put( enableLoader() );
  const response = yield call( customerHomeApi );
  yield put( disableLoader() );
  if( 'response' in response ){
    yield put(updateStates({
      home: response.response.data
    }));
  } else {
    errorHandler(response)
  }
}

export function* getContent({slug}: any): any {
  yield put( enableLoader() );
  const response = yield call( getContentApi, slug );
  yield put( disableLoader() );
  if( 'response' in response ){
    navigate('Content' as never, { content: response.response.data } as never )
  } else {
    errorHandler(response)
  }
}

export function* convertFormData(payload: any): any {
  const formData = new FormData();
  for (let key in payload) {
    formData.append(key, payload[key]);
  }

  return formData;
}
