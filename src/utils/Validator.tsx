import * as yup from 'yup';

export const validate = async (data: any) => {

  const schema: any = {
    name: yup.string().required().max(255),
    email: yup.string().email().required().max(255),
    username: yup.string().required(),
    address: yup.string().required(),
    phone: yup.string().required().max(20),
    message: yup.string().required(), // CHANGE CONTACT US

    type: yup.string().required(),
    password: yup.string().required(),

    old_password: yup.string().required(), // CHANGE PASSWORD
    new_password: yup.string().required().min(8),
    confirm_password: yup.string().test(
      'passwords-match', 
      'Passwords must match', 
      (value) => data.new_password === value),

    bio: yup.string().required().max(255),
    services: yup.array().required().min(1),
    preferred: yup.array().required().min(1).max(3),

    profile_pic: yup.mixed().required(),
    cv_pic: yup.mixed().required(),
    identity_pic: yup.mixed().required(),

    sort_code:  yup.string().required().max(12),
    account_no:  yup.string().required().max(60),
    medical_history:  yup.string().required().max(60),
    
    /* dob:  yup.date()
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
    .required().typeError('Please seleect date'), */
    dob:  yup.string()
    .required().typeError('Please seleect date'),
    
    //Sign up validations
    bmi: yup.number().typeError('Invalid BMI').required(),
    height: yup.number().typeError('you must specify a number').required(),
    weight: yup.number().typeError('you must specify a number').required('Weight is required'),
    marital_status: yup.string().required(),
    gender: yup.string().required(),

    card_number:  yup.string().required().max(20),
    expiry:  yup.string().required().max(60),
    cvv:  yup.string().required().max(60),

    franchise_id: yup.string().required().max(255),
  };

  const errors: any = {};
  Object.keys(data).forEach((key: string) => {
    try {
      schema[key.toLowerCase() as any].validateSync(data[key as any]);
    } catch ({errors: e}) {
      if( e ){
        errors[key as any] = e?.pop();
      }
    }
  });

  if (!Object.keys(errors).length) {
    return false;
  }

  return errors;
}

export const validateJob = async (data: any) => {

  const schema: any = {
    service_id: yup.string().required().max(255),
    service_category_id: yup.string().required().max(255),
    address: yup.string().required().max(255),
    addressline2: yup.string().required().max(255),
    dates: yup.string().required().max(255),
    start_time: yup.string().required().max(255),
    time_duration: yup.string().required().max(255),
  };

  const errors: any = {};
  Object.keys(data).forEach((key: string) => {
    try {
      schema[key as any].validateSync(data[key as any]);
    } catch ({errors: e}) {
      if( e ){
        errors[key as any] = e?.pop();
      }
    }
  });

  if (!Object.keys(errors).length) {
    return false;
  }

  return errors;
}

export const validateAccount = async (data: any) => {

  const schema: any = {
    id_number: yup.string().required().max(50),
    account_holder_name: yup.string().required().max(255),
    account_number: yup.string().required().max(50),
    routing_number: yup.string().required().max(20),
    dob: yup.string().required(),
    line1: yup.string().required().max(255),
    city: yup.string().required().max(255),
    postal_code: yup.string().required().max(255),
    state: yup.string().required().max(50),
  };

  const errors: any = {};
  Object.keys(data).forEach((key: string) => {
    try {
      schema[key as any].validateSync(data[key as any]);
    } catch ({errors: e}) {
      if( e ){
        errors[key as any] = e?.pop();
      }
    }
  });

  if (!Object.keys(errors).length) {
    return false;
  }

  return errors;
}