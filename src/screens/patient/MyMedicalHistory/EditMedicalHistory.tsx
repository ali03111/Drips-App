import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../constants";
import SafeAreaContainer from "../../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../../components/atoms";
import { commonStyles } from "../../../style";
import {
  fetchMedicalHistory,
  updateMedicalHistory,
} from "../../../store/actions/UserActions";
import { RootState } from "../../../store/reducers";
import Icon from "react-native-vector-icons/Ionicons";
import { MedicalHistoryModel } from "../../../store/models/MedicalHistory";
import { isEmpty } from "lodash";
import { cloneDeep } from "lodash";
const initialState = {
  surgicalHistory: [] as string[],
  pastMedicalHistory: [] as string[],
  allergies: [] as string[],
};
const EditMedicalHistory = (props) => {
  const medicalDetails: MedicalHistoryModel = useSelector(
    (state: RootState) => state.UserReducer.medicalHistory
  );
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const [{ surgicalHistory, pastMedicalHistory, allergies }, setState] =
    useState(initialState);
  const updateState = (newState: {}) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const dispatch = useDispatch();
  /* const [
    localMedicalHistory,
    setMedicalHistory
  ] = useState<MedicalHistoryModel>(medicalDetails); */
  const _fetchMedicalHistory = () => {
    dispatch(fetchMedicalHistory());
  };

  console.log(
    "medicalDetailsmedicalDetailsmedicalDetailsmedicalDetailsmedicalDetails",
    medicalDetails
  );

  function flattenArray<T>(arr: T): T {
    if (Array.isArray(arr) && arr.length === 1 && Array.isArray(arr[0])) {
      return arr[0] as T;
    }
    return arr;
  }

  useEffect(() => {
    updateState({
      surgicalHistory:
        (medicalDetails.Surgeries1.length > 0 &&
          flattenArray(medicalDetails.Surgeries1)) ||
        [],
      pastMedicalHistory:
        (medicalDetails.past_medical_history &&
          flattenArray(medicalDetails.past_medical_history)) ||
        [],
      allergies:
        (medicalDetails.allergies && flattenArray(medicalDetails.allergies)) ||
        [],
    });
  }, []);

  const onSubmit = () => {
    console.log(allergies);

    let body = new FormData();
    body.append("Surgeries1", surgicalHistory);
    body.append("past_medical_history", pastMedicalHistory);
    body.append("allergies", allergies);
    /* let localMedicalHistory = {
      surgicalHistory,pastMedicalHistory,allergies
    }
    for (const prop in localMedicalHistory) {
      for (let i = 0; i < localMedicalHistory[prop].length; i++) {
        let title = prop
        title = prop === 'surgicalHistory' && 'Surgeries1' || 
        prop === 'pastMedicalHistory' && 'past_medical_history' || prop;
        body.append(`${title}[${i}]`, localMedicalHistory[prop][i]);
      }
    } */
    body.append("patient_id", user.user_id);
    console.log(
      "sdlkvbklasdbvklsdbvklbsvbsvbsklvbsklvbklds",
      JSON.stringify(body)
    );
    dispatch(updateMedicalHistory(body));
  };

  const onAddMore = (type: number) => {
    switch (type) {
      case 1:
        let _pastMedicalHistory = [...pastMedicalHistory];
        _pastMedicalHistory.push("");
        updateState({ pastMedicalHistory: _pastMedicalHistory });
        break;
      case 2:
        let _allergies = [...allergies];
        _allergies.push("");
        updateState({ allergies: _allergies });
        break;
      default:
        let _surgicalHistory = [...surgicalHistory];
        _surgicalHistory.push("");
        updateState({ surgicalHistory: _surgicalHistory });
        break;
    }
    // setMedicalHistory(historyItems);
  };

  const updateItemValue = (value: string, index: number, type: number) => {
    let _pastMedicalHistory: any = cloneDeep(pastMedicalHistory);
    let _surgicalHistory: any = cloneDeep(surgicalHistory);
    let _allergies: any = cloneDeep(allergies);
    switch (type) {
      case 1:
        _pastMedicalHistory[index] = value;
        updateState({
          pastMedicalHistory: _pastMedicalHistory,
        });
        break;
      case 2:
        _allergies[index] = value;
        updateState({
          allergies: _allergies,
        });
        break;
      default:
        _surgicalHistory[index] = value;
        updateState({
          surgicalHistory: _surgicalHistory,
        });
        break;
    }
  };

  const deleteItem = (index: number, type: number) => {
    switch (type) {
      case 1:
        let _pastMedicalHistory = [...pastMedicalHistory];
        _pastMedicalHistory.splice(index, 1);
        updateState({ pastMedicalHistory: _pastMedicalHistory });
        break;
      case 2:
        let _allergies = [...allergies];
        _allergies.splice(index, 1);
        updateState({ allergies: _allergies });
        break;
      default:
        let _surgicalHistory = [...surgicalHistory];
        _surgicalHistory.splice(index, 1);
        updateState({ surgicalHistory: _surgicalHistory });
        break;
    }
  };

  console.log(
    "surgicalHistorysurgicalHistorysurgicalHistorysurgicalHistorysurgicalHistorysurgicalHistorysurgicalHistory",
    pastMedicalHistory,
    surgicalHistory,
    allergies
  );

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader
          title="My Medical History"
          drawerBtn={false}
          backBtn={true}
        />
        <View style={styles.container}>
          <ScrollView style={{ padding: 20 }}>
            {pastMedicalHistory && (
              <>
                <View style={styles.titleContainer}>
                  <Typography color="#fe4e91" size={16}>
                    Past Medical History
                  </Typography>
                  <Icon.Button
                    name="add"
                    color={COLORS.primary}
                    iconStyle={{ marginRight: 0 }}
                    backgroundColor="transparent"
                    onPress={() => onAddMore(1)}
                  >
                    Add More
                  </Icon.Button>
                </View>

                {pastMedicalHistory.map((i, index) => (
                  <View
                    style={[commonStyles.cardWithShadow, styles.inputContainer]}
                  >
                    <View style={styles.itemInputContainer}>
                      <TextInput
                        value={i}
                        style={styles.itemInput}
                        onChangeText={(value) =>
                          updateItemValue(value, index, 1)
                        }
                        placeholder={"Please enter details"}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => deleteItem(index, 1)}
                    >
                      <Icon name={"trash"} size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {allergies && (
              <>
                <View style={{ height: 10 }} />
                <View style={styles.titleContainer}>
                  <Typography color="#fe4e91" size={16}>
                    Allergies
                  </Typography>
                  <Icon.Button
                    name="add"
                    color={COLORS.primary}
                    iconStyle={{ marginRight: 0 }}
                    backgroundColor="transparent"
                    onPress={() => onAddMore(2)}
                  >
                    Add More
                  </Icon.Button>
                </View>

                {allergies.map((i, index) => (
                  <View
                    style={[commonStyles.cardWithShadow, styles.inputContainer]}
                  >
                    <View style={styles.itemInputContainer}>
                      <TextInput
                        value={i}
                        style={styles.itemInput}
                        onChangeText={(value) =>
                          updateItemValue(value, index, 2)
                        }
                        placeholder={"Please enter details"}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => deleteItem(index, 2)}
                    >
                      <Icon name={"trash"} size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {surgicalHistory && (
              <>
                <View style={{ height: 10 }} />
                <View style={styles.titleContainer}>
                  <Typography color="#fe4e91" size={16}>
                    Surgical History
                  </Typography>
                  <Icon.Button
                    name="add"
                    color={COLORS.primary}
                    iconStyle={{ marginRight: 0 }}
                    backgroundColor="transparent"
                    onPress={() => onAddMore(3)}
                  >
                    Add More
                  </Icon.Button>
                </View>

                {surgicalHistory.map((i, index) => (
                  <View
                    style={[commonStyles.cardWithShadow, styles.inputContainer]}
                  >
                    <View style={styles.itemInputContainer}>
                      <TextInput
                        value={i}
                        style={styles.itemInput}
                        onChangeText={(value) =>
                          updateItemValue(value, index, 3)
                        }
                        placeholder={"Please enter details"}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => deleteItem(index, 3)}
                    >
                      <Icon name={"trash"} size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
            <View style={{ marginVertical: 20 }}>
              <Button label={"Submit"} onPress={onSubmit} />
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyText: {
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 0,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  itemInputContainer: {
    flex: 1,
  },
  itemInput: {
    width: "100%",
    paddingVertical: 15,
    color: "black",
  },
});

export default EditMedicalHistory;
