import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  InputDateTime,
  InputText,
  Typography,
} from "../../components/atoms";
import { navigate } from "../../navigation/RootNavigation";
import { updateAppStates } from "../../store/actions/AppActions";
import { RootState } from "../../store/reducers";
import { userUserDataAction } from "../../store/actions/UserActions";
import * as Validator from "../../utils/Validator";
import { startCase } from "lodash";
import DropdownModal from "../../components/atoms/DropdownModal";
import BottomSheet from "../../components/atoms/BottomSheet";
import DropdownListItem from "../../components/atoms/DropdownListItem";

const ContactInfo = (props) => {
  const signupStep = "step1";
  const dispatch = useDispatch();
  const inputRefs: any = useRef([]);
  const [errors, setErrors] = useState({});
  const { user } = useSelector((state: RootState) => state.UserReducer);

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
      label: "Address",
      placeholder: "Address",
      type: "text",
      value: "",
      error: "",
      keyboardType: "default",
      refName: "address",
      focusName: "contact",
      returnKeyType: "next",
      multiline: false,
      maxLength: 255,
      inputProps: {
        // textAlignVertical: 'top',
        // numberOfLines: 5
      },
    },
    {
      label: "Country",
      placeholder: "Country",
      type: "text",
      value: "",
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
      value: "",
      error: "",
      keyboardType: "phone-pad",
      refName: "phone",
      returnKeyType: "done",
    },
  ]);
  useEffect(() => {}, []);

  const _onSubmit = async () => {
    let validateData = {};
    form.map((i) => (validateData[i.refName] = i.value));
    Validator.validate(validateData).then((err) => {
      if (!err) {
        dispatch(userUserDataAction(signupStep, validateData, "AlergyInfo"));
      } else setErrors(err);
    });
  };

  const actionSheet: any = useRef();

  const [modalState, setModalState] = useState(false);

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }} />
          <View style={styles.container}>
            <Image
              source={IMAGES.splash}
              style={{ width: "70%", height: 100 }}
              resizeMode={"contain"}
            />

            <Typography color={COLORS.primary} style={{ marginTop: 10 }}>
              Contact Information
            </Typography>

            {form.map((i: any, index) => {
              switch (i.type) {
                case "text":
                  return (
                    <InputText
                      {...i}
                      isPressable={i.refName.toLowerCase() === "country"}
                      key={index}
                      title={i.label}
                      onPress={() => {
                        setModalState(true);
                      }}
                      onChangeText={(text: string) => {
                        form[index].value = text;
                        setForm([...form]);
                      }}
                      error={errors[i.refName]}
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

            <View style={{ marginTop: 10 }}>
              <Button label={"Next"} onPress={_onSubmit} />
              <Button
                label={"Back"}
                onPress={() => props.navigation.goBack()}
                backgroundColor={"#b8b8b8"}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      <BottomSheet ref={actionSheet} />
      {modalState && (
        <DropdownModal
          title={"Select Country"}
          onClose={() => setModalState(false)}
        >
          <FlatList
            data={countryArry}
            ItemSeparatorComponent={() => <View style={styles.separtor} />}
            renderItem={({ item, index }) => (
              <DropdownListItem
                selected={item === form[1].value}
                title={item}
                onPress={() => {
                  setModalState(false);
                  form[1].value = item;

                  setForm((prev) => {
                    return [
                      prev[0],
                      prev[1],
                      {
                        label: "Phone Number",
                        placeholder: "Phone Number",
                        type: "text",
                        value: `${countryCodeArry[form[1].value]} `,
                        error: "",
                        keyboardType: "phone-pad",
                        refName: "phone",
                        returnKeyType: "done",
                      },
                      // {
                      //   label: "Phone Number",
                      //   placeholder: "Phone Number",
                      //   type: "text",
                      //   value:
                      //     `${countryCodeArry[form2[1].value]} ` ?? user.phone,
                      //   error: "",
                      //   keyboardType: "default",
                      //   refName: "phone",
                      //   // focusName: "dob",
                      //   returnKeyType: "done",
                      //   leftIconVisibility: false,
                      // },
                    ];
                  });
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
  container: {
    backgroundColor: "#fff",
    marginTop: 80,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  separtor: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});

export default ContactInfo;
