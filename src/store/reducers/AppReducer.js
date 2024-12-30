import { SHOW_TOAST, UPDATE_APP_STATE, UPDATE_LOADER } from "../actions/AppActions";

const initialState = {
    splash: true,
    loader: false,
    fcmToken: null,
    userType: 1, // 1 FOR PATIENT 2 FOR PHYSICIAN
    info: {},
    toast: {
        show: false,
        title: '',
        message: '',
    },
};

export default AppReducer = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case UPDATE_LOADER:
            return {
                ...state,
                loader: action.loader
            };

        case SHOW_TOAST:
            return {
                ...state,
                toast: action.toast
            };

        case UPDATE_APP_STATE:

            if (action.payload?.serviceId) {
                action.payload.service = state.services.find(service => service.id === action.payload.serviceId);
            }

            return {
                ...state,
                ...action.payload
            };


        default:
            return state;
    }
};