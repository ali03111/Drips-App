import { deleting, get, post } from "./Http";

export const loginApi = (data: any) => post(`/login`, JSON.stringify(data) );
export const registerApi = (data: any) => post(`/register`, JSON.stringify(data) );
export const userUserData = (step:string,data: any) => post(`/${step}`, JSON.stringify(data) );
export const userUserDataUploadImage = (step:string,data: any) => post(`/${step}`, data,{},true );
export const updateProfileApi = (data: any) => post(`/profile-update`, data,{},true );
export const updateDeviceDetailsApi = ( data: any ) => get(`/user-firebase-token?${data}` );

export const logoutApi = (data: any) => post(`/logout`, JSON.stringify(data) );

export const getInfoApi = () => get(`/info`);
export const getFranchiseApi = () => get(`/franchises`);
export const getServiceApi = ( detailed = 0 ) => get(`/services?detailed=${detailed}`);


export const userUpdateApi = ( data: any ) => post(`/user/update`, data, {}, true );
export const getMyProfileApi = () => get(`/me`);
export const getUserApi = ( id: string ) => get(`/user/${id}`);
export const getUsersApi = ( data:any ) => get(`/users`, data);

export const updateBusinessApi = ( data:any ) => post(`/business`, data, {}, true);
export const updateServiceApi = ( data:any ) => post(`/business/categories`, JSON.stringify(data));

export const customerHomeApi = () => get(`/home` );

export const changePasswordApi = ( data:any ) => post(`/change-password`, JSON.stringify(data));
export const forgotPasswordApi = ( data:any ) => post(`/forget/password`, JSON.stringify(data));
export const getPatientProfileApi = (data:any) => post(`/patient-detail`, JSON.stringify(data));

export const getSymptomsApi = ( ) => get(`/symtoms`);
export const getConsultantDetailsApi = ( data: any ) => post(`/getAppointment`, JSON.stringify(data));
export const consultationReqApi = ( data: any ) => post(`/consultation`, data,{},true );
export const bookApointmentApi = ( data: any ) => post(`/bookAppointment`, data,{},true );
export const getPatientApointmentApi = ( data: any ) => post(`/getallAppointment`, JSON.stringify(data));
export const getDoctorDetailsApi = ( data: any ) => post(`/doctor-detail`, JSON.stringify(data));
export const getMedicalHistoryApi = ( data: any ) => get(`/patient_medical_history?patient_id=${data.patient_id}`);
export const updateMedicalHistoryApi = ( data: any ) => post(`/patient-medical-history-edit`,data,{},true);
export const fetchPrescriptionsApi = ( id: any ) => get(`/my-prescription?patient_id=${id}`);
export const fetchOrdersApi = ( id: any ) => get(`/my-orders?patient_id=${id}`);
export const fetchTestResultsApi = ( id: any ) => get(`/my-prescription?patient_id=${id}`);
export const getAllTestResultApi = ( id: any ) => get(`/getall-test-result?patient_id=${id}`);
export const addTestResultApi = ( data: any ) => post(`/upload-test-result`,data,{},true);
export const deleteTestResultApi = ( id: any ) => get(`/delete-result?result_id=${id}`);

export const getNotificationsApi = () => get(`/notifications` );
export const getContentApi = (type: string) => get(`/content/${type}` );

export const messageApi = (consultantId:any) => get(`/chat-detail/${consultantId}`);
export const createMessageApi = (data: any) => post(`/send-message`, data,{},true );

export const getAccountApi = () => get(`/account` );
export const accountApi = (data: any) => post(`/account`, JSON.stringify(data) );
export const removeAccountApi = () => deleting(`/account`);

export const fetchPhysicianPatientsApi = (data: any) =>{
    console.log("slkdbvlksdbvl;sbdlvbsd.",data)
  return  post(data?.url, JSON.stringify(data) )}

export const requestDoctorApi = (data: any) => post(`/consultant-request`, JSON.stringify(data) );

