import { call, put, select } from "redux-saga/effects";
import { navigate, navigationRef } from "../../navigation/RootNavigation";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader } from "../actions/AppActions";
import { getChatDetailsAction, updateChatStates } from "../actions/ChatActions";
import { selectMessages, selectUserState } from "../selectors/userSelector";
import {
  createMessageApi,
  messageApi,
} from "../services/Services";

export function* getMessageSaga({ payload }: any): any {
  yield put(enableLoader());
  const response = yield call(messageApi, payload.id);
  yield put(disableLoader());

  if (response.code === '200' || response.code === 200) {
    // yield put( resetUnread( id ) );
    yield put(
      updateChatStates({
        apointmentItem:payload,
        appointmentId: payload.id,
        messages: response.data
      })
    );
    navigate("Chat" as never);
  } else {
    errorHandler(response);
  }
}

export function* createMessageSaga({ payload }: any): any {
  const {user} = yield select(selectUserState);
  const {messages} = yield select(selectMessages);
  let body:any = new FormData();
  for (const [key,value] of Object.entries(payload)) {
    body.append(key,value);
  }  
  const response = yield call(createMessageApi, body);

  console.log('kjsdbvjksdkjvsbdkjvbsdkvbklsdbklsdbvlksd',JSON.stringify(response))

  if (response.code === '200') {
    const msg = {...payload,created_at:new Date()};
    // yield put(getChatDetailsAction({id:payload.consultant_id}));
    yield put(
      updateChatStates({
        messages: [...messages,msg],
      })
    );
    navigationRef.navigate("Chat" as never);
  } else {
    // errorHandler(response);
  }
}
