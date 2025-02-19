import {
  RESET_CONSULTANT_STATE,
  UPDATE_CONSULTANT_STATE,
} from "../actions/UserActions";
export interface DoctorDetailsModel{
      "id": number,
      "Is_deleted":string
      "name":string
      "lname": string,
      "email":string
      "password":string
      "gender":string
      "marital_status": string,
      "dob": string,
      "ser_type": string,
      "MDCN":string
      "Api_token": string,
      "customer_status":string
      "status_Incomplete":string
      "password_Is_secure":string
      "localisation": string,
      "provider_id": string,
      "provider": string,
      "status": 1,
      "Is_approved":string
      "Is_online": string,
      "remember_token":string
      "created_at":string
      "updated_at":string
      "deleted_at": string,
      "phone":string
      "code": string,
      "user_id": 749,
      "bio": string,
      "license_number": string,
      "DOB":string
      "pic":string
      "country": string,
      "state": string,
      "city": string,
      "address": string,
      "postal": string,
      "Speciality":string
      "language":string
      "expertise":string
      "medical_school":string
      "residency":string
      "price":string
    
}
const initialState = {
  availableConsultants: [],
  consultantDetails: {},
  apointmentData: {},
  apointmentDetails: {},
  apointmentList: [],
  doctorDetails: {} as DoctorDetailsModel,
  physicianPatients: [],
  patientDetails:{},
  latestBookingDetails:{},
  problemDetail:{}
};

const ConsultantReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONSULTANT_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case RESET_CONSULTANT_STATE:
      return { ...initialState };
    default:
      return state;
  }
};
export default ConsultantReducer