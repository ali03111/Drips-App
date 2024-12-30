export const GET_PHYSICIAN_PATIENTS = "GET_PHYSICIAN_PATIENTS";

export const fetchPhysicianPatients = (payload) => ({
  type: GET_PHYSICIAN_PATIENTS,
  payload,
});
