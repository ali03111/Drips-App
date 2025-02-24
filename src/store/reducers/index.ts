import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';

import UserReducerState from "./UserReducer";
import AppReducer from "./AppReducer";
import ConsultantReducer from "./ConsultantReducer";
import ChatReducer from "./ChatReducer";
import ScreenReducer from "./ScreenReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
const persistConfig = {   key: 'root',   storage:AsyncStorage,  keyPrefix: '' };
const UserReducer = persistReducer(persistConfig, UserReducerState);
const AppReducers =  combineReducers({
    AppReducer,
    UserReducer,
    ConsultantReducer,
    ChatReducer,
    ScreenReducer
})
export type RootState = ReturnType<typeof AppReducers>
export default AppReducers;