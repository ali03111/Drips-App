import { RESET_USER_STATE, UPDATE_STATE } from '../actions/UserActions';
import { MedicalHistoryModel, OrderItemModel, PrescriptionItemModel, TestResultItemModel } from '../models/MedicalHistory';

const initialState = {
    defaultRoute: 'index',
    token: false,
    requirement: false,
    userType: 0, // 0 = CUSTOMER , 1 = NANNY
    account: null,
    notifications: {
        data: [],
        pagination: {}
    },
    services: [],
    user: {
        Address:"",
        user_id:"",
        lname:"",
        email: "",
        pic:"",
        franchise: "",
        Gender:"",
        DOB:"",
        name: "",
        password: "",
        phone: "",
        address: "",
        services: [],
        locations: [],
        height:"",
        Weight:"",
        country:""
    },
    wallet: {
        amount: 0,
        date: null
    },
    symptoms: [],
    verification: {
        visible: false,
        url: null,
        type: null,
        data: {}
    },
    medicalHistory:{} as MedicalHistoryModel,
    prescriptionData:[] as PrescriptionItemModel[],
    orderData:[] as OrderItemModel[],
    resultData:[] ,
    attachmentsData:[] ,
    testResults:[] as TestResultItemModel[],
};

const UserReducer = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                ...action.payload
            };

        case RESET_USER_STATE:
            return { ...initialState };
        default:
            return state;
    }
};
export default UserReducer;