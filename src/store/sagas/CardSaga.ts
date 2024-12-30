import { call, put, select } from "redux-saga/effects";
import {
  onBack,
} from "../../navigation/RootNavigation";
import { getItem, setItem } from "../../utils/localStorage";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader, showToast } from "../actions/AppActions";
import { updateStates as updateUserStates } from "../actions/UserActions";
import {
  getCardsApi,
  createCardApi,
  deleteCardApi,
} from "../services/Services";


export function* createCard(action: any): any {
    yield put(enableLoader());
    const cards = yield select((state: any) => state.UserReducer.cards);
    const response = yield call(createCardApi, action.payload);
    yield put(disableLoader());
  
    if ("response" in response) {
      let output = response.response.data;
      if (output.status !== "succeeded" && output.url) {
        yield put(
          updateUserStates({
            verification: {
              visible: true,
              url: output.url,
              type: "card",
              data: output,
            },
          })
        );
      } else if (output.status === "succeeded") {
        yield put(
          updateUserStates({ cards: [...cards, response.response.data] })
        );
        onBack();
      } else {
        yield put(showToast("Something wents wrong"));
      }
    } else {
      errorHandler(response);
    }
  }
  
  export function* removeCard(action: any): any {
    yield put(enableLoader());
    const cards = yield select((state: any) => state.UserReducer.cards);
    const response = yield call(deleteCardApi, action.id);
    yield put(disableLoader());
  
    if ("response" in response) {
      cards.splice(
        cards.findIndex((card: any) => card.card_id === action.id),
        1
      );
      yield put(updateUserStates({ cards: [...cards] }));
    } else {
      errorHandler(response);
    }
  }
  
  export function* getCards(): any {
    yield put(enableLoader());
    const response = yield call(getCardsApi);
    yield put(disableLoader());
    if ("response" in response) {
      yield put(updateUserStates({ cards: response.response.data }));
    } else {
      errorHandler(response);
    }
  }