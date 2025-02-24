export const GET_MESSAGES = "GET_MESSAGES";
export const CREATE_MESSAGE = "CREATE_MESSAGE";
export const RESET_CHAT_STATE = "RESET_CHAT_STATE";
export const UPDATE_CHAT_STATE = "UPDATE_CHAT_STATE";
export const UPDATE_Screen_STATE = "UPDATE_Screen_STATE";

export const getChatDetailsAction = (payload) => ({
  type: GET_MESSAGES,
  payload,
});
export const sendChatMessage = (payload) => ({ type: CREATE_MESSAGE, payload });
export const updateChatStates = (payload) => ({
  type: UPDATE_CHAT_STATE,
  payload,
});
export const updateScreenStates = (payload) => ({
  type: UPDATE_Screen_STATE,
  payload,
});
