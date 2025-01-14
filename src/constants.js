import { Dimensions, Platform } from "react-native";

// export const BASEURL = 'https://dripsmedical.com/portal/api';
// export const IMAGE_URL = "https://dripsmedical.com/portal/public/";
export const BASEURL = "https://webvortech.com/drips/custom-portal/api";
export const IMAGE_URL = "https://webvortech.com/drips/custom-portal/public/";
export const PAYMENT_URL = "https://webvortech.com/drips/custom-portal/paynow";
export const MAP_KEY = "AIzaSyAquzgo847shlU-SpPXLZMgShv6EW9pQmw";
export const SRTIPE_PK =
  "pk_test_51KxRBHEcLpIir0EoFjCv1Z3T7EAF2kPfyVXZWr6P1Y1RJi2kaow1tElS37tVxFK6qt1VK9pnmkMjAyrjW7xvKBFE00vwvkxGZD";

export const headerHeight = 50;
export const consultFormDateFormat = "YYYY-MM-DD";
export const consultFormTimingFormat = "HH:mm";
export const screenHeight = (percent) => {
  const windowHeight = Dimensions.get("window").height;
  return (windowHeight * percent) / 100;
};

export const screenWidth = (percent) => {
  const windowWidth = Dimensions.get("window").width;
  return (windowWidth * percent) / 100;
};

export const COLORS = {
  primary: "#0679BF",
  secondary: "#D24F90",
  placeholderColor: "#677294",
  modalBg: "rgba(0,0,0,.6)",

  secondaryGradient: ["#D24F90", "#6A59E2"],
  toastBg: "rgba(0,0,0,.8)",
  onPrimary: "#fff",
  onSecondary: "#333258",
  secondaryLight: "#0fbbe4",

  surface: "#fff",
  surfaceInv: "#101420",
  onSurface: "#000",
  background: "#fff",
  text: "#262460",

  muted: "#b2b4b7",
  disable: "#989799",
  // overlay: "#00000040",
  rating: "#ffb301",
  // border: "#e5e5e5",
  border: "#EDEBFF",
  danger: "#FA3C48",

  black: "#000",
  lightBlack: "#3B4045",
  white: "#fff",
  halfWhite: "#A1A1A3",
  gray: "#e5e5e5",
  darkGray: "#999B9F",
  lightGray: "#E1E1E1",
  successGreen: "rgb(114,231,111)",
};

export const FONTS = {
  PoppinsBold: "Poppins-Bold",
  PoppinsSemiBold: "Poppins-SemiBold",
  PoppinsRegular: "Poppins-Regular",
  PoppinsMedium: "Poppins-Medium",
};

export const FONTSIZE = {
  XXL: 22,
  XL: 20,
  L: 18,
  M: 16,
  S: 14,
  XS: 12,
  XXS: 10,
};

export const IMAGES = {
  bg: require("../src/assets/images/bg.png"),
  splash: require("../src/assets/images/splash.png"),
  logo: require("../src/assets/images/logo.png"),
  imgbg: require("../src/assets/images/imgBg.png"),
  mailbox: require("../src/assets/images/mailbox.png"),
  tick: require("../src/assets/images/tick.png"),
  avatar: require("../src/assets/images/avatar.png"),
  avatar_placeholder: require("../src/assets/images/avatar_placeholder.png"),

  doctor1: require("../src/assets/images/doctor1.png"),
  doctor2: require("../src/assets/images/doctor2.png"),
  doctor3: require("../src/assets/images/doctor3.png"),
  patient: require("../src/assets/images/patient.png"),
};
