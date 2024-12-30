export interface ConsultantItem {
  "id": number,
  "user_id": number,
  "customer_status":string
  "bio": string,
  "name":string
  "email":string
  "license_number": number,
  "DOB":string
  "phone":string
  "pic":string
  "country": string,
  "state": string,
  "city": string,
  "address": string,
  "postal": string,
  "Speciality":string
  "created_at":string
  "updated_at":string
  "gender":string
  "language":string
  "expertise":string
  "Is_online": boolean,
  "medical_school":string
  "residency":string
  "price":string
  "MDCN":string
}

export interface ApointmentItemModel {
  "id": number,
  "is_deleted": number,
  "created_at": string
  "updated_at": string
  "patient_id": string
  "doctor_id": string
  "name": string,
  "DOB": string,
  "age": string,
  "gender": string,
  "weight": string,
  "lbs": string,
  "height": string,
  "bmi": string,
  "problem": string,
  "Report": string,
  "booking_type": string
  "date": string
  "timing": string
  "Is_accept": string
  "zoom_id": string,
  "images": string,
  "status": 1,
  "hour": string,
  "minute": string,
  "seconds": string,
  "notification": string,
  "tracking_id": string,
  "payment_status": string,
  "appointment_type": string
  "doctorname":string
  "doctoremail":string
  "doctorphone":string
  "doctorimage":string
}