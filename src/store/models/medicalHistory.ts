export interface MedicalHistoryModel {
  allergies:string[],
  Surgeries1:string[],
  past_medical_history:string[],
}
export interface MedicalHistoryPhysicianSideModel {
  allergies:string[],
  Surgeries1:string[],
  past_medical_history:string[],
}

export interface PrescriptionItemModel {
  "id": number,
  "is_deleted": number,
  "created_at":string
  "updated_at":string
  "patient_id":string
  "doctor_id":string
  "name":string
  "DOB": string,
  "age":string
  "gender":string
  "weight":string
  "lbs": string,
  "height":string
  "bmi":string
  "problem":string
  "Report": string,
  "booking_type":string
  "date":string
  "timing":string
  "Is_accept":string
  "zoom_id": string,
  "images": string,
  "status": number,
  "hour": string,
  "minute": string,
  "seconds": string,
  "notification": string,
  "tracking_id": string,
  "payment_status": string,
  "appointment_type": string
}
export interface OrderItemModel {
  "id": number,
  "is_deleted": number,
  "created_at":string
  "updated_at":string
  "patient_id":string
  "doctor_id":string
  "name":string
  "DOB": string,
  "age":string
  "gender":string
  "weight":string
  "lbs": string,
  "height":string
  "bmi":string
  "problem":string
  "Report": string,
  "booking_type":string
  "date":string
  "timing":string
  "Is_accept":string
  "zoom_id": string,
  "images": string,
  "status": number,
  "hour": string,
  "minute": string,
  "seconds": string,
  "notification": string,
  "tracking_id": string,
  "payment_status": string,
  "appointment_type": string
}
export interface TestResultItemModel {
  "id": number,
  "patient_id": number,
  "title": string,
  "image": string,
  "create_at": string,
  
}