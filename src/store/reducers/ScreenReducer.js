import {
  RESET_CHAT_STATE,
  UPDATE_CHAT_STATE,
  UPDATE_Screen_STATE,
} from "../actions/ChatActions";

const initialState = {
  routeName: "Consultations",
  title: "Scheduled Consultations",
};

export default ScreenReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_Screen_STATE:
      console.log("sljkdbvklsdbvklsbdklbdsklvbdsklblkdv.", action);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
