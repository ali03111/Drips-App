export const AUTHENTICATE = "USER_AUTHENTICATE";
export const REGISTER = "USER_REGISTER";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";

export const SOCIAL_AUTH = "SOCIAL_AUTHENTICATE";
export const SOCIAL_REGISTER = "SOCIAL_REGISTER";

export const LOGOUT = "USER_LOGOUT";
export const UPDATE_MY_PROFILE = "UPDATE_MY_PROFILE";
export const MY_PROFILE = "MY_PROFILE";
export const USER_VIEW = "USER_VIEW";
export const USER_UPDATE = "USER_UPDATE";
export const BUSINESS_UPDATE = "BUSINESS_UPDATE";
export const BUSINESS_SERVICE_UPDATE = "BUSINESS_SERVICE_UPDATE";
export const FETCH_PRESCRIPTIONS = "FETCH_PRESCRIPTIONS";
export const FETCH_ORDERS = "FETCH_ORDERS";
export const FETCH_TEST_RESULTS = "FETCH_TEST_RESULTS";
export const UPLOAD_TEST_RESULT = "UPLOAD_TEST_RESULT";
export const DELETE_TEST_RESULT = "DELETE_TEST_RESULT";
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";

export const USER_LIST = "USER_LIST";

export const GET_WALLET = "GET_WALLET";
export const GET_TRANSACTIONS = "GET_TRANSACTIONS";
export const GET_INVOICES = "GET_INVOICES_";
export const GET_INVOICE = "GET_INVOICE";
export const INVOICE_PAY = "INVOICE_PAY";
export const WALLET_TOPUP = "WALLET_TOPUP";

export const CREATE_CARD = "CREATE_CARD";
export const REMOVE_CARD = "REMOVE_CARD";
export const GET_CARDS = "GET_CARDS";

export const GET_SLOTS = "GET_SLOTS";
export const DATE_SLOTS = "DATE_SLOTS";
export const GET_ACTIVITY = "GET_ACTIVITY";

export const UPDATE_STATE = "USER_STATE_UPDATE";
export const RESET_USER_STATE = "RESET_USER_STATE";

export const UPDATE_DEVICE = "UPDATE_DEVICE";

export const RESET_CHAT_STATE = "RESET_CHAT_STATE";
export const UPDATE_CHAT_STATE = "UPDATE_CHAT_STATE";
export const UPDATE_CONSULTANT_STATE = "UPDATE_CONSULTANT_STATE";
export const RESET_CONSULTANT_STATE = "RESET_CONSULTANT_STATE";

export const CREATE_ACCOUNT = "CREATE_ACCOUNT";
export const GET_ACCOUNT = "GET_ACCOUNT";
export const DEL_ACCOUNT = "DEL_ACCOUNT";

export const FETCH_SYPTOMS = "FETCH_SYPTOMS";
export const FETCH_PATIENT_DETAILS = "FETCH_PATIENT_DETAILS";
export const CREATE_CONSULTANT_REQ = "CREATE_CONSULTANT_REQ";
export const FETCH_CONSULTANT_DETAILS = "FETCH_CONSULTANT_DETAILS";
export const CREATE_BOOKING_REQ = "CREATE_BOOKING_REQ";
export const GET_PATIENT_APPOINTMENTS = "GET_PATIENT_APPOINTMENTS";
export const GET_MEDICAL_HISTORY = "GET_MEDICAL_HISTORY";
export const UPDATE_MEDICAL_HISTORY = "UPDATE_MEDICAL_HISTORY";
export const GET_DOCTOR_DETAILS = "GET_DOCTOR_DETAILS";

export const SELECT_DOCTOR_REQUEST = "SELECT_DOCTOR_REQUEST";

export const updateUserStates = (payload) => ({ type: UPDATE_STATE, payload });
export const updateConsultantData = (payload) => ({
  type: UPDATE_CONSULTANT_STATE,
  payload,
});

export const businessUpdateAction = (payload, redirect = true) => ({
  type: BUSINESS_UPDATE,
  payload,
  redirect,
});
export const serviceUpdateAction = (payload) => ({
  type: BUSINESS_SERVICE_UPDATE,
  payload,
});

export const updateDeviceAction = (payload) => ({
  type: UPDATE_DEVICE,
  payload,
});
export const loginAction = (payload) => ({ type: AUTHENTICATE, payload });
export const registerAction = (payload) => ({ type: REGISTER, payload });
export const userUserDataAction = (step, payload, routeName) => ({
  type: UPDATE_USER_DATA,
  step,
  payload,
  routeName,
});
export const fetchPatientDetailsAction = (payload) => ({
  type: FETCH_PATIENT_DETAILS,
  payload,
});
export const fetchDoctorDetailsAction = (payload) => ({
  type: GET_DOCTOR_DETAILS,
  payload,
});

export const fetchSymptomsAction = () => ({ type: FETCH_SYPTOMS });
export const createConsultReqAction = (payload) => ({
  type: CREATE_CONSULTANT_REQ,
  payload,
});
export const getConsultantDetailAction = (payload) => ({
  type: FETCH_CONSULTANT_DETAILS,
  payload,
});
export const createBookingReqAction = (payload) => ({
  type: CREATE_BOOKING_REQ,
  payload,
});
export const getPatientApointmentsAction = () => ({
  type: GET_PATIENT_APPOINTMENTS,
});
export const fetchMedicalHistory = () => ({ type: GET_MEDICAL_HISTORY });
export const updateMedicalHistory = (payload) => ({
  type: UPDATE_MEDICAL_HISTORY,
  payload,
});

export const changePassword = (payload) => ({ type: CHANGE_PASSWORD, payload });
export const forgotPasswordAction = (payload) => ({
  type: FORGOT_PASSWORD,
  payload,
});
export const updateProfileAction = (payload) => ({
  type: UPDATE_MY_PROFILE,
  payload,
});

export const logoutAction = () => ({ type: LOGOUT });

export const fetchPrescription = () => ({ type: FETCH_PRESCRIPTIONS });
export const fetchOrders = () => ({ type: FETCH_ORDERS });
export const fetchTestResults = () => ({ type: FETCH_TEST_RESULTS });
export const uploadTestResult = (payload = {}) => ({
  type: UPLOAD_TEST_RESULT,
  payload,
});
export const deleteTestResult = (id) => ({ type: DELETE_TEST_RESULT, id });

export const requestDoctorAction = (payload) => ({
  type: SELECT_DOCTOR_REQUEST,
  payload,
});

export const userUpdate = (payload = {}) => ({ type: USER_UPDATE, payload });
export const myProfile = () => ({ type: MY_PROFILE });
export const toggleFavorite = (payload = {}) => ({
  type: TOGGLE_FAVORITE,
  payload,
});
export const userView = (id, navigate = "ProviderDetail") => ({
  type: USER_VIEW,
  id,
  navigate,
});
export const userList = (payload = {}) => ({ type: USER_LIST, payload });

export const getWallet = () => ({ type: GET_WALLET });
export const getTransactions = (page = 1) => ({ type: GET_TRANSACTIONS, page });
export const getInvoices = (page = 1) => ({ type: GET_INVOICES, page });
export const getInvoice = (id) => ({ type: GET_INVOICE, id });
export const invoicePay = (payload) => ({ type: INVOICE_PAY, payload });
export const walletTopup = (payload) => ({ type: WALLET_TOPUP, payload });

export const createCard = (payload) => ({ type: CREATE_CARD, payload });
export const removeCard = (id) => ({ type: REMOVE_CARD, id });
export const getCards = () => ({ type: GET_CARDS });

export const getSlots = (id) => ({ type: GET_SLOTS, id });
export const getDateSlots = (payload) => ({ type: DATE_SLOTS, payload });

export const getNotifications = () => ({ type: GET_ACTIVITY });

export const createAccountAction = (payload) => ({
  type: CREATE_ACCOUNT,
  payload,
});
export const getAccountAction = () => ({ type: GET_ACCOUNT });
export const delAccountAction = () => ({ type: DEL_ACCOUNT });
