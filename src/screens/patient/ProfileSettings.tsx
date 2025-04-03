import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES, IMAGE_URL } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import * as Validator from "../../utils/Validator";

import {
  Button,
  InnerHeader,
  InputDateTime,
  InputText,
  Typography,
} from "../../components/atoms";
import { commonStyles } from "../../style";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import {
  fetchPatientDetailsAction,
  updateProfileAction,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import BottomSheet from "../../components/atoms/BottomSheet";
import { imageCamera, imagePicker } from "../../utils/utils";
import { startCase } from "lodash";
import moment from "moment";
import DropdownModal from "../../components/atoms/DropdownModal";
import DropdownListItem from "../../components/atoms/DropdownListItem";
import { hp, wp } from "../../utils/responsive";
const ProfileSettings = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const { loader } = useSelector((state: RootState) => state.AppReducer);
  const { userType }: any = useSelector(
    (state: RootState) => state.UserReducer
  );
  const actionSheet: any = useRef();
  const [modalState, setModalState] = useState({
    isCountry: false,
    isGender: false,
  });
  const [bmi, setBmi] = useState( user?.Bmi ?  user?.Bmi.toString() :null);
  console.log("useruseruseruseruseruseruser", user);

  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const [userProfile, setProfile] = useState({
    uri: user?.pic ? IMAGE_URL + user.pic : null,
    type: null,
  });

  const countryArry = [
    "Afghanistan",
    "Aland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo, Democratic Republic of the Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D'Ivoire",
    "Croatia",
    "Cuba",
    "Curacao",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and Mcdonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran, Islamic Republic of",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia, the Former Yugoslav Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory, Occupied",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Barthelemy",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Serbia and Montenegro",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Viet Nam",
    "Virgin Islands, British",
    "Virgin Islands, U.s.",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const countryCodeArry = {
    Afghanistan: "+93",
    "Aland Islands": "+358",
    Albania: "+355",
    Algeria: "+213",
    "American Samoa": "+1684",
    Andorra: "+376",
    Angola: "+244",
    Anguilla: "+1264",
    Antarctica: "+672",
    "Antigua and Barbuda": "+1268",
    Argentina: "+54",
    Armenia: "+374",
    Aruba: "+297",
    Australia: "+61",
    Austria: "+43",
    Azerbaijan: "+994",
    Bahamas: "+1242",
    Bahrain: "+973",
    Bangladesh: "+880",
    Barbados: "+1246",
    Belarus: "+375",
    Belgium: "+32",
    Belize: "+501",
    Benin: "+229",
    Bermuda: "+1441",
    Bhutan: "+975",
    Bolivia: "+591",
    "Bonaire, Sint Eustatius and Saba": "+599",
    "Bosnia and Herzegovina": "+387",
    Botswana: "+267",
    "Bouvet Island": "+55",
    Brazil: "+55",
    "British Indian Ocean Territory": "+246",
    "Brunei Darussalam": "+673",
    Bulgaria: "+359",
    "Burkina Faso": "+226",
    Burundi: "+257",
    Cambodia: "+855",
    Cameroon: "+237",
    Canada: "+1",
    "Cape Verde": "+238",
    "Cayman Islands": "+1345",
    "Central African Republic": "+236",
    Chad: "+235",
    Chile: "+56",
    China: "+86",
    "Christmas Island": "+61",
    "Cocos (Keeling) Islands": "+672",
    Colombia: "+57",
    Comoros: "+269",
    Congo: "+242",
    "Congo, Democratic Republic of the Congo": "+242",
    "Cook Islands": "+682",
    "Costa Rica": "+506",
    "Cote D'Ivoire": "+225",
    Croatia: "+385",
    Cuba: "+53",
    Curacao: "+599",
    Cyprus: "+357",
    "Czech Republic": "+420",
    Denmark: "+45",
    Djibouti: "+253",
    Dominica: "+1767",
    "Dominican Republic": "+1809",
    Ecuador: "+593",
    Egypt: "+20",
    "El Salvador": "+503",
    "Equatorial Guinea": "+240",
    Eritrea: "+291",
    Estonia: "+372",
    Ethiopia: "+251",
    "Falkland Islands (Malvinas)": "+500",
    "Faroe Islands": "+298",
    Fiji: "+679",
    Finland: "+358",
    France: "+33",
    "French Guiana": "+594",
    "French Polynesia": "+689",
    "French Southern Territories": "+262",
    Gabon: "+241",
    Gambia: "+220",
    Georgia: "+995",
    Germany: "+49",
    Ghana: "+233",
    Gibraltar: "+350",
    Greece: "+30",
    Greenland: "+299",
    Grenada: "+1473",
    Guadeloupe: "+590",
    Guam: "+1671",
    Guatemala: "+502",
    Guernsey: "+44",
    Guinea: "+224",
    "Guinea-Bissau": "+245",
    Guyana: "+592",
    Haiti: "+509",
    "Heard Island and Mcdonald Islands": "+0",
    "Holy See (Vatican City State)": "+39",
    Honduras: "+504",
    "Hong Kong": "+852",
    Hungary: "+36",
    Iceland: "+354",
    India: "+91",
    Indonesia: "+62",
    "Iran, Islamic Republic of": "+98",
    Iraq: "+964",
    Ireland: "+353",
    "Isle of Man": "+44",
    Israel: "+972",
    Italy: "+39",
    Jamaica: "+1876",
    Japan: "+81",
    Jersey: "+44",
    Jordan: "+962",
    Kazakhstan: "+7",
    Kenya: "+254",
    Kiribati: "+686",
    "Korea, Democratic People's Republic of": "+850",
    "Korea, Republic of": "+82",
    Kosovo: "+381",
    Kuwait: "+965",
    Kyrgyzstan: "+996",
    "Lao People's Democratic Republic": "+856",
    Latvia: "+371",
    Lebanon: "+961",
    Lesotho: "+266",
    Liberia: "+231",
    "Libyan Arab Jamahiriya": "+218",
    Liechtenstein: "+423",
    Lithuania: "+370",
    Luxembourg: "+352",
    Macao: "+853",
    "Macedonia, the Former Yugoslav Republic of": "+389",
    Madagascar: "+261",
    Malawi: "+265",
    Malaysia: "+60",
    Maldives: "+960",
    Mali: "+223",
    Malta: "+356",
    "Marshall Islands": "+692",
    Martinique: "+596",
    Mauritania: "+222",
    Mauritius: "+230",
    Mayotte: "+269",
    Mexico: "+52",
    "Micronesia, Federated States of": "+691",
    "Moldova, Republic of": "+373",
    Monaco: "+377",
    Mongolia: "+976",
    Montenegro: "+382",
    Montserrat: "+1664",
    Morocco: "+212",
    Mozambique: "+258",
    Myanmar: "+95",
    Namibia: "+264",
    Nauru: "+674",
    Nepal: "+977",
    Netherlands: "+31",
    "Netherlands Antilles": "+599",
    "New Caledonia": "+687",
    "New Zealand": "+64",
    Nicaragua: "+505",
    Niger: "+227",
    Nigeria: "+234",
    Niue: "+683",
    "Norfolk Island": "+672",
    "Northern Mariana Islands": "+1670",
    Norway: "+47",
    Oman: "+968",
    Pakistan: "+92",
    Palau: "+680",
    "Palestinian Territory, Occupied": "+970",
    Panama: "+507",
    "Papua New Guinea": "+675",
    Paraguay: "+595",
    Peru: "+51",
    Philippines: "+63",
    Pitcairn: "+64",
    Poland: "+48",
    Portugal: "+351",
    "Puerto Rico": "+1787",
    Qatar: "+974",
    Reunion: "+262",
    Romania: "+40",
    "Russian Federation": "+70",
    Rwanda: "+250",
    "Saint Barthelemy": "+590",
    "Saint Helena": "+290",
    "Saint Kitts and Nevis": "+1869",
    "Saint Lucia": "+1758",
    "Saint Martin": "+590",
    "Saint Pierre and Miquelon": "+508",
    "Saint Vincent and the Grenadines": "+1784",
    Samoa: "+684",
    "San Marino": "+378",
    "Sao Tome and Principe": "+239",
    "Saudi Arabia": "+966",
    Senegal: "+221",
    Serbia: "+381",
    "Serbia and Montenegro": "+381",
    Seychelles: "+248",
    "Sierra Leone": "+232",
    Singapore: "+65",
    "Sint Maarten": "+1",
    Slovakia: "+421",
    Slovenia: "+386",
    "Solomon Islands": "+677",
    Somalia: "+252",
    "South Africa": "+27",
    "South Georgia and the South Sandwich Islands": "+500",
    "South Sudan": "+211",
    Spain: "+34",
    "Sri Lanka": "+94",
    Sudan: "+249",
    Suriname: "+597",
    "Svalbard and Jan Mayen": "+47",
    Swaziland: "+268",
    Sweden: "+46",
    Switzerland: "+41",
    "Syrian Arab Republic": "+963",
    "Taiwan, Province of China": "+886",
    Tajikistan: "+992",
    "Tanzania, United Republic of": "+255",
    Thailand: "+66",
    "Timor-Leste": "+670",
    Togo: "+228",
    Tokelau: "+690",
    Tonga: "+676",
    "Trinidad and Tobago": "+1868",
    Tunisia: "+216",
    Turkey: "+90",
    Turkmenistan: "+7370",
    "Turks and Caicos Islands": "+1649",
    Tuvalu: "+688",
    Uganda: "+256",
    Ukraine: "+380",
    "United Arab Emirates": "+971",
    "United Kingdom": "+44",
    "United States": "+1",
  };

  const [form, setForm] = useState([
    {
      label: "First Name",
      placeholder: "First Name",
      type: "text",
      value: startCase(user.name),
      error: "",
      keyboardType: "default",
      refName: "name",
      focusName: "lname",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Last Name",
      placeholder: "Last Name",
      type: "text",
      value: startCase(user.lname),
      error: "",
      keyboardType: "default",
      refName: "lname",
      focusName: "phone",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Email",
      placeholder: "Email",
      type: "text",
      value: `${user.email || ""}`,
      error: "",
      editable: false,
      keyboardType: "default",
      refName: "email",
      focusName: "phone",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Date Of Birth",
      placeholder: "Date Of Birth",
      type: "datetime",
      mode: "date",
      value: user?.dob,
      error: "",
      keyboardType: "default",
      refName: "dob",
      focusName: "Gender",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Gender",
      placeholder: "Gender",
      type: "text",
      value: startCase(user?.gender),
      error: "",
      keyboardType: "default",
      refName: "gender",
      focusName: "address",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Marital Status",
      placeholder: "Marital Status",
      type: "text",
      value: user?.marital_status,
      error: "",
      keyboardType: "default",
      refName: "marital_status",
      focusName: "marital_status",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Height (in cm)",
      placeholder: "Height (in cm)",
      type: "text",
      value: user?.height,
      error: "",
      keyboardType: "number-pad",
      refName: "height",
      focusName: "weight",
      returnKeyType: "done",
      leftIconVisibility: false,
    },
    {
      label: "Weight (in Kg)",
      placeholder: "Weight (in Kg)",
      type: "text",
      value:user?.Weight ?  user?.Weight.toString() : "",
      error: "",
      keyboardType: "number-pad",
      refName: "weight",
      returnKeyType: "done",
      leftIconVisibility: false,
    },
  ]);
  const [form2, setForm2] = useState([
    {
      label: "Address",
      placeholder: "Address",
      type: "text",
      value: startCase(user.Address),
      error: "",
      keyboardType: "default",
      refName: "Address",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Country",
      placeholder: "Country",
      type: "text",
      value: startCase(user?.country),
      error: "",
      keyboardType: "default",
      refName: "country",
      focusName: "country",
      returnKeyType: "next",
      leftIconVisibility: false,
    },
    {
      label: "Phone Number",
      placeholder: "Phone Number",
      type: "text",
      value: user.phone,
      error: "",
      keyboardType: "phone-pad",
      refName: "phone",
      // focusName: "dob",
      returnKeyType: "done",
      leftIconVisibility: false,
    },
  ]);

  const _fetchProfile = () => {
    dispatch(fetchPatientDetailsAction());
    setForm2((prev) => {
      return [
        prev[0],
        prev[1],
        {
          label: "Phone Number",
          placeholder: "Phone Number",
          type: "text",
          value: countryCodeArry[form2[1].value] ?? user.phone,
          error: "",
          keyboardType: "phone-pad",
          refName: "phone",
          // focusName: "dob",
          returnKeyType: "done",
          leftIconVisibility: false,
        },
      ];
    });
  };

  const _calculateBMI = () => {
    let height;
    let weight;
    form.map((i) => {
      if (i.refName === "height") height = i.value;
      else if (i.refName === "weight") weight = i.value;
    });
    let bmi = (weight / ((height * height) / 10000)).toFixed(2);
    setBmi(bmi);
  };

  const _onSubmit = () => {
    let validateData = {};
    [...form, ...form2].map((i) => (validateData[i.refName] = i.value));
    validateData["bmi"] = bmi;
    Validator.validate(validateData).then((err) => {
      if (!err) {
        setErrors({});
        let body = new FormData();
        for (const [key, value] of Object.entries<any>(validateData)) {
          body.append(key, value);
        }
        body.append("id", user.user_id);
        body.append("user_type", userType);
        if (userProfile.type) {
          body.append("pic", userProfile as any);
        }
        dispatch(updateProfileAction(body));
      } else {
        console.log("slkdbvklsbdklvbskldbvsdbkvbsdklvb", err);
        setErrors(err);
      }
    });
  };

  useEffect(() => {
    _fetchProfile();
  }, []);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContainer}
      >
        <InnerHeader title="Profile" backBtn={true} />
        {!loader && (
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 20 }}
          >
            <Typography size={20} style={{ textAlign: "center" }}>
              Personal Information
            </Typography>
            <TouchableOpacity
              style={[commonStyles.boxShadow, styles.avatarContainer]}
              onPress={() => {
                actionSheet.current.show({
                  title: "Select Image",
                  options: ["Camera", "Gallery", "Cancel"],
                  cancelButtonIndex: 2,
                  onSelect: (index: any) => {
                    switch (index) {
                      case 0:
                        imageCamera().then((image: any) => {
                          setProfile(image);
                          actionSheet.current.close();
                        });
                        break;

                      case 1:
                        imagePicker({
                          multiple: false,
                          minFiles: 1,
                          maxFiles: 1,
                        }).then((image: any) => {
                          setProfile(image);
                          actionSheet.current.close();
                        });
                        break;

                      default:
                        break;
                    }
                  },
                });
              }}
            >
              <Image
                defaultSource={IMAGES.avatar_placeholder}
                // source={IMAGES.avatar_placeholder}
                source={
                  Boolean(user?.pic || userProfile?.uri)
                    ? userProfile
                    : IMAGES.avatar_placeholder
                }
                style={styles.avatar}
                resizeMode="cover"
              />
              {/* <FaIcon
                name="user-circle"
                size={hp("8")}
                style={{ alignSelf: "center" }}
                // color={COLORS.primary}
              /> */}
              {/* {user?.pic ? (
                <FaIcon
                  name="user-circle"
                  size={5}
                  style={{ alignSelf: "center" }}
                  // color={COLORS.primary}
                />
              ) : (
                <Image
                  defaultSource={IMAGES.avatar_placeholder}
                  // source={IMAGES.avatar_placeholder}
                  source={userProfile}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              )} */}

              {/* <Image
                // source={IMAGES.avatar_placeholder}
                source={userProfile}
                defaultSource={IMAGES.avatar_placeholder}
                style={styles.avatar}
                resizeMode="center"
              /> */}

              <View style={styles.avatarBtn}>
                <FaIcon name="camera" color={COLORS.primary} size={15} />
              </View>
            </TouchableOpacity>

            {form.map((i: any, index) => {
              switch (i.type) {
                case "text":
                  return (
                    <InputText
                      {...i}
                      isPressable={i.refName.toLowerCase() === "gender"}
                      key={index}
                      onPress={() =>
                        setModalState({
                          isCountry: false,
                          isGender: true,
                        })
                      }
                      title={i.label}
                      error={errors[i.refName]}
                      style={{ marginTop: 15 }}
                      onChangeText={(text: string) => {
                        form[index].value = text;
                        setForm([...form]);
                      }}
                      inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                      onSubmitEditing={() => {
                        i.focusName
                          ? inputRefs.current[i.focusName].focus()
                          : Keyboard.dismiss();
                      }}
                    />
                  );
                case "datetime":
                  return (
                    <InputDateTime
                      {...i}
                      key={index}
                      title={i.label}
                      error={errors[i.refName]}
                      style={{ marginVertical: 10, padding: 15 }}
                      onChange={(text: string) => {
                        form[index].value = text; //moment(text).format('YYYY-MM-DD');
                        setForm([...form]);
                      }}
                      inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                      onSubmitEditing={() => {
                        i.focusName && inputRefs.current[i.focusName].focus();
                      }}
                    />
                  );
                default:
                  break;
              }
            })}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <InputText
                placeholder={"BMI"}
                style={{ marginTop: 15, flex: 1 }}
                inputStyle={{ backgroundColor: "#eee" }}
                editable={false}
                value={bmi ?? ( user?.Bmi ?  user?.Bmi.toString() : null)}
                error={errors["bmi"]}
                inputRef={(e: any) => (inputRefs.current["bmi"] = e)}
              />
              <Button
                label="Calculate"
                onPress={_calculateBMI}
                style={{ flex: 1, marginLeft: 20 }}
              />
            </View>
            <Typography size={20} style={{ textAlign: "center" }}>
              Contact Information
            </Typography>
            {form2.map((i: any, index) => {
              switch (i.type) {
                case "text":
                  return (
                    <InputText
                      {...i}
                      isPressable={i.refName.toLowerCase() === "country"}
                      key={index}
                      onPress={() =>
                        setModalState({
                          isCountry: true,
                          isGender: false,
                        })
                      }
                      title={i.label}
                      error={errors[i.refName]}
                      style={{ marginTop: 15 }}
                      onChangeText={(text: string) => {
                        form2[index].value = text;
                        setForm2([...form2]);
                      }}
                      inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                      onSubmitEditing={() => {
                        i.focusName
                          ? inputRefs.current[i.focusName].focus()
                          : Keyboard.dismiss();
                      }}
                    />
                  );
                case "datetime":
                  return (
                    <InputDateTime
                      {...i}
                      key={index}
                      title={i.label}
                      error={errors[i.refName]}
                      style={{ marginVertical: 10, padding: 15 }}
                      onChange={(text: string) => {
                        form[index].value = text; //moment(text).format('YYYY-MM-DD');
                        setForm([...form]);
                      }}
                      inputRef={(e: any) => (inputRefs.current[i.refName] = e)}
                      onSubmitEditing={() => {
                        i.focusName && inputRefs.current[i.focusName].focus();
                      }}
                    />
                  );
                default:
                  break;
              }
            })}
            <Button onPress={_onSubmit} label="Update Profile" />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
      <BottomSheet ref={actionSheet} />
      {Boolean(modalState.isCountry || modalState.isGender) && (
        <DropdownModal
          title={
            (modalState.isCountry && "Select Country") ||
            (modalState.isGender && "Select Gender")
          }
          onClose={() =>
            setModalState({
              isCountry: false,
              isGender: false,
            })
          }
        >
          <FlatList
            data={
              (modalState.isCountry && countryArry) ||
              (modalState.isGender && ["Male", "Female"])
            }
            ItemSeparatorComponent={() => <View style={styles.separtor} />}
            renderItem={({ item, index }) => (
              <DropdownListItem
                selected={
                  item ===
                  ((modalState.isCountry && form2[1]) ||
                    (modalState.isGender && form[4].value))
                }
                title={item}
                onPress={() => {
                  setModalState({
                    isCountry: false,
                    isGender: false,
                  });
                  if (modalState.isGender) {
                    form[4].value = item;

                    setForm([...form]);
                  } else if (modalState.isCountry) {
                    form2[1].value = item;

                    setForm2((prev) => {
                      return [
                        prev[0],
                        prev[1],
                        {
                          label: "Phone Number",
                          placeholder: "Phone Number",
                          type: "text",
                          value:
                            `${countryCodeArry[form2[1].value]} ` ?? user.phone,
                          error: "",
                          keyboardType: "default",
                          refName: "phone",
                          // focusName: "dob",
                          returnKeyType: "done",
                          leftIconVisibility: false,
                        },
                      ];
                    });
                    // setForm2([...form2]);
                  }
                }}
              />
            )}
          />
        </DropdownModal>
      )}
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  separtor: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  avatarContainer: {
    borderWidth: 5,
    borderColor: "#fff",
    // width: 110,
    // height: 110,
    borderRadius: 55,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    borderRadius: Math.round(
      Dimensions.get("window").width + Dimensions.get("window").height
    ),
    width: Dimensions.get("window").width * 0.25,
    height: Dimensions.get("window").width * 0.25,
  },
  avatarBtn: {
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 25,
    zIndex: 2,
    elevation: 2,
  },
});

export default ProfileSettings;
