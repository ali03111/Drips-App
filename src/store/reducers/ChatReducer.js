import {  RESET_CHAT_STATE,UPDATE_CHAT_STATE } from '../actions/ChatActions';

const initialState = {
    messages:[],
    appointmentId:null,
    apointmentItem:{},
};

export default ChatReducer = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case UPDATE_CHAT_STATE:
            return {
                ...state,
                ...action.payload
            };

        case RESET_CHAT_STATE:
            return { ...initialState };
        default:
            return state;
    }
};