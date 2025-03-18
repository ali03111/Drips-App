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
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IMAGES, COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InputText, Typography } from "../../components/atoms";
import * as Validator from "../../utils/Validator";
import { userUserDataAction } from "../../store/actions/UserActions";
import { CheckBox } from "../../components/icons";
import { get } from "../../store/services/Http";
import { errorHandler } from "../../utils/utils";
import { disableLoader, enableLoader } from "../../store/actions/AppActions";

const SocialInfo = (props) => {
  const { user } = useSelector((state) => state.UserReducer);
  console.log("sldjkbvlksbdklvbsdklbvsdbvkbs.d", user);

  const populateSelectedValues = (
    queries,
    firstOpQes,
    secondOpQes,
    thirdOpQes,
    forthOpQes,
    data
  ) => {
    const updateSelectedValues = (array) =>
      array.map((item) => ({
        ...item,
        selected: data[item.refName] || "", // Assign the value from the data object if available
      }));

    setQueires(updateSelectedValues(queries));

    const updatedFirstOpQes = updateSelectedValues(firstOpQes);
    const updatedSecondOpQes = updateSelectedValues(secondOpQes);
    const updatedThirdOpQes = updateSelectedValues(thirdOpQes);
    const updatedForthOpQes = updateSelectedValues(forthOpQes);

    console.log("Updated Queries:", updateSelectedValues(queries));
    console.log("Updated FirstOpQes:", updatedFirstOpQes);
    console.log("Updated SecondOpQes:", updatedSecondOpQes);
    console.log("Updated ThirdOpQes:", updatedThirdOpQes);
    console.log("Updated ForthOpQes:", updatedForthOpQes);
  };

  const getSocialData = async () => {
    dispatch(enableLoader());
    // const response = await get(`patient-detail?id=1810`);
    const response = await get(`/patient-detail?id=${user?.user_id}`);
    console.log("responseresponseresponseresponseresponse", response);
    if (response.status && response.code === "200") {
      populateSelectedValues(
        queries,
        firstOpQes,
        secondOpQes,
        thirdOpQes,
        forthOpQes,
        response?.patientinfo[0]
      );

      // setQueires(prev=>(

      // ))
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  // useEffect(() => {
  //   if (isEdit) getSocialData();
  // }, []);

  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }

  const dispatch = useDispatch();
  const [select, setSelect] = useState(null);
  const [queries, setQueires] = useState([
    {
      refName: "do_you_smoke",
      label: `Have you ever smoked?`,
      selected: "",
      options: ["yes", "no"],
      childOption: [],
    },
    {
      refName: "do_u_Alcohol",
      label: `Do you drink Alcohol?`,
      selected: "",
      options: ["yes", "no"],
    },
    {
      refName: "do_u_marijuana",
      label: `Do you use any Recreational Drugs Like Marijuana?`,
      selected: "",
      options: ["yes", "no"],
    },
    {
      refName: "are_you_employed",
      label: `Are you Employed?`,
      selected: "",
      options: ["yes", "no"],
    },
  ]);

  const firstOpQes = [
    {
      refName: "currently_smoking",
      label: `Do you currently smoke tobacco?`,
      selected: "",
      options: ["yes", "no"],
      type: "option",
    },
    {
      refName: "packs_per_day",
      label: `How many packs do you smoke in a day?`,
      selected: "",
      options: ["Less than one", "1", "2", "Greater than 2"],
      type: "option",
    },
    {
      refName: "start_age",
      label: `At what age did you start smoking?`,
      selected: "",
      type: "input",
      options: ["12"],
      placeholder: "12",
      inputTyep: "number-pad",
    },
  ];
  const secondOpQes = [
    {
      refName: "alcohol_detail",
      label: `How often do you drink?`,
      selected: "",
      options: [
        "Daily",
        "Two to three times weekly",
        "Once a week",
        "Monthly or Less",
      ],
      type: "option",
    },
  ];

  const thirdOpQes = [
    {
      refName: "marijuana_drug",
      label: `What Drug Did You Use?`,
      selected: "",
      type: "input",
      options: ["Drug Name"],
      placeholder: "Drug Name",
      inputTyep: "number-pad",
    },
  ];
  const forthOpQes = [
    {
      refName: "job_title",
      label: `Job Title`,
      selected: "",
      type: "input",
      options: ["Senior Engineer"],
      // placeholder: "Senior Engineer",
    },
    {
      refName: "employee_name",
      label: `Employer name`,
      selected: "",
      type: "input",
      options: ["Google.com"],
      // placeholder: "Google.com",
    },
  ];
  const updateChildLabels = () => {
    setQueires((prevQueries) => {
      const updatedQueries = [...prevQueries];
      const smokingQuery = updatedQueries[0];
      const currentlySmoking = smokingQuery.childOption[0].selected === "yes";

      smokingQuery.childOption[1].label = currentlySmoking
        ? "How many packs do you smoke in a day?"
        : "How many packs did you smoke when you smoked?";

      smokingQuery.childOption[2].refName = currentlySmoking
        ? "packs_per_day"
        : "packs_per_day_former";

      smokingQuery.childOption[2].label = currentlySmoking
        ? "At what age did you start smoking?"
        : "When did you quit smoking (age)?";
      smokingQuery.childOption[2].refName = currentlySmoking
        ? "start_age"
        : "quit_age";

      smokingQuery.childOption[2].placeholder = currentlySmoking ? "12" : "6";

      return updatedQueries;
    });
  };

  // Example of how to trigger the updateChildLabels function when a selection changes
  const handleOptionSelect = (index, option, childInd) => {
    setQueires((prev) => {
      const updated = [...prev];
      updated[index].childOption[childInd].selected = option;
      if (index === 0) {
        updateChildLabels();
      }
      return updated;
    });
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleOptionSelect();
  //   }, 1000);
  // }, []);

  const signupStep = "step6";
  const [errors, setErrors] = useState({});

  const createSelectedObject = (data) => {
    const result = {};

    data.forEach((item) => {
      // Add the main object 'refName' and 'selected' to the result
      result[item.refName] = item.selected.toLowerCase();

      // If the object has 'childOption', iterate through the child options
      if (item.childOption && Array.isArray(item.childOption)) {
        item.childOption.forEach((child) => {
          result[child.refName] = child.selected.toLowerCase();
        });
      }
    });

    return result;
  };

  const _onSubmit = async () => {
    let validateData = {};
    const payloadData = createSelectedObject(queries);
    // allRefNames.forEach(
    //   (i) => (validateData[i.refName] = i.selected.toLowerCase())
    // );

    Validator.validate(validateData).then((err) => {
      console.log(
        "validateDafcxslknvklsdnkldsnkldsnklndsklndfslkcvbcxvbcvxbxcvbta",
        payloadData
      );
      if (!err) {
        dispatch(userUserDataAction(signupStep, payloadData, "Medication"));
      } else {
        setErrors(err);
      }
    });
  };

  const isInValid = () => {
    // Check if any main query item has an empty 'selected' value
    const mainQueriesInvalid = queries.some((query) => query.selected === "");

    // Check if any child option within each query has an empty 'selected' value
    const childQueriesInvalid = queries.some(
      (query) =>
        Array.isArray(query.childOption) &&
        query.childOption.some((child) => child.selected === "")
    );

    // Return true if any main or child queries are invalid
    return mainQueriesInvalid || childQueriesInvalid;
  };

  const handleParentOptionSelect = (index, o) => {
    setQueires((prev) => {
      prev[index].selected = o;
      if (index == 0) {
        prev[index].childOption = o == "yes" ? firstOpQes : [];
      } else if (index == 1) {
        prev[index].childOption = o == "yes" ? secondOpQes : [];
      } else if (index == 2) {
        prev[index].childOption = o == "yes" ? thirdOpQes : [];
      } else if (index == 3) {
        prev[index].childOption = o == "yes" ? forthOpQes : [];
      }
      return [...prev];
    });
  };

  const toLowerCase = (str) => {
    if (typeof str !== "string") {
      console.error("Input must be a string");
      return "";
    }
    return str.toLowerCase();
  };

  return (
    <SafeAreaContainer safeArea={false}>
      <ImageBackground source={IMAGES.imgbg} style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexGrow: 1, marginTop: 30 }}
          // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset if needed
        >
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }} />
          {/* <View style={{ flex: 1 }} /> */}
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={IMAGES.splash}
              style={{ width: "70%", height: 100 }}
              resizeMode={"contain"}
            />

            <Typography color={COLORS.primary} style={{ marginVertical: 10 }}>
              Social History
            </Typography>
            {/* <View
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            > */}
            {queries.map((i, index) => (
              <>
                <View style={styles.queryCard} key={index}>
                  <Typography textType="light">{i.label}</Typography>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    {i.options.map((o) => (
                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.options}
                        onPress={() => {
                          handleParentOptionSelect(index, o);
                        }}
                        key={o}
                      >
                        <CheckBox
                          selected={toLowerCase(o) == toLowerCase(i.selected)}
                        />
                        <Typography>{` ${capitalizeFirstLetter(
                          o
                        )}`}</Typography>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {i?.childOption &&
                  i.childOption.map((res, ind) => {
                    return (
                      <View style={styles.queryCard}>
                        <Typography textType="light">{res.label}</Typography>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          {res?.options &&
                            res.options.map((o) =>
                              res?.type == "option" ? (
                                <TouchableOpacity
                                  activeOpacity={1}
                                  style={{ ...styles.options, marginTop: 1 }}
                                  onPress={() => {
                                    if (index == 0 && ind == 0) {
                                      const smokingQuery = queries[0];
                                      smokingQuery.childOption[2].selected = "";
                                    }
                                    handleOptionSelect(index, o, ind);
                                  }}
                                  key={o}
                                >
                                  <CheckBox selected={o == res.selected} />
                                  <Typography>{` ${capitalizeFirstLetter(
                                    o
                                  )}`}</Typography>
                                </TouchableOpacity>
                              ) : (
                                <InputText
                                  placeholder={res?.placeholder}
                                  onChangeText={(text) => {
                                    handleOptionSelect(index, text, ind);
                                  }}
                                  value={res?.selected}
                                  autoCapitalize={"none"}
                                  returnKeyType={"done"}
                                  style={{ width: "98%" }}
                                  allowSpacing={false}
                                />
                              )
                            )}
                        </View>
                      </View>
                    );
                  })}
              </>
            ))}
            {/* </View> */}

            <View style={{ marginTop: 10, marginBottom: 10 }}>
              <Button
                disabled={isInValid()}
                label={"Next"}
                onPress={_onSubmit}
              />
              <Button
                label={"Back"}
                onPress={() => props.navigation.goBack()}
                backgroundColor={"#b8b8b8"}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // top: 40,
    padding: 20,
    borderRadius: 20,
  },
  queryCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default SocialInfo;
