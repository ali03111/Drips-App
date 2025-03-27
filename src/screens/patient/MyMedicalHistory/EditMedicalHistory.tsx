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
  Current_medication1: [] as string[],
  family_medical_condition: [] as string[],
};

const EditMedicalHistory = (props) => {
  const medicalDetails: MedicalHistoryModel = useSelector(
    (state: RootState) => state.UserReducer.medicalHistory
  );
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const [
    {
      surgicalHistory,
      pastMedicalHistory,
      allergies,
      Current_medication1,
      family_medical_condition,
    },
    setState,
  ] = useState(initialState);

  const updateState = (newState: {}) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  const dispatch = useDispatch();

  const _fetchMedicalHistory = () => {
    dispatch(fetchMedicalHistory());
  };

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
      Current_medication1:
        (medicalDetails.Current_medication1 &&
          flattenArray(medicalDetails.Current_medication1)) ||
        [],
      family_medical_condition:
        (medicalDetails.family_medical_condition &&
          flattenArray(medicalDetails.family_medical_condition)) ||
        [],
    });
  }, [medicalDetails]);

  const onSubmit = () => {
    let body = new FormData();
    body.append("Surgeries1", surgicalHistory);
    body.append("past_medical_history", pastMedicalHistory);
    body.append("allergies", allergies);
    body.append("Current_medication1", Current_medication1);
    body.append("family_medical_condition", family_medical_condition);
    body.append("patient_id", user.user_id);
    dispatch(updateMedicalHistory(body));
  };

  const onAddMore = (type: number) => {
    switch (type) {
      case 1:
        updateState({ pastMedicalHistory: [...pastMedicalHistory, ""] });
        break;
      case 2:
        updateState({ allergies: [...allergies, ""] });
        break;
      case 3:
        updateState({ surgicalHistory: [...surgicalHistory, ""] });
        break;
      case 4:
        updateState({ Current_medication1: [...Current_medication1, ""] });
        break;
      case 5:
        updateState({
          family_medical_condition: [...family_medical_condition, ""],
        });
        break;
    }
  };

  const updateItemValue = (value: string, index: number, type: number) => {
    switch (type) {
      case 1:
        const newPastMedicalHistory = [...pastMedicalHistory];
        newPastMedicalHistory[index] = value;
        updateState({ pastMedicalHistory: newPastMedicalHistory });
        break;
      case 2:
        const newAllergies = [...allergies];
        newAllergies[index] = value;
        updateState({ allergies: newAllergies });
        break;
      case 3:
        const newSurgicalHistory = [...surgicalHistory];
        newSurgicalHistory[index] = value;
        updateState({ surgicalHistory: newSurgicalHistory });
        break;
      case 4:
        const newCurrentMedication = [...Current_medication1];
        newCurrentMedication[index] = value;
        updateState({ Current_medication1: newCurrentMedication });
        break;
      case 5:
        const newFamilyMedicalCondition = [...family_medical_condition];
        newFamilyMedicalCondition[index] = value;
        updateState({ family_medical_condition: newFamilyMedicalCondition });
        break;
    }
  };

  const deleteItem = (index: number, type: number) => {
    switch (type) {
      case 1:
        updateState({
          pastMedicalHistory: pastMedicalHistory.filter((_, i) => i !== index),
        });
        break;
      case 2:
        updateState({ allergies: allergies.filter((_, i) => i !== index) });
        break;
      case 3:
        updateState({
          surgicalHistory: surgicalHistory.filter((_, i) => i !== index),
        });
        break;
      case 4:
        updateState({
          Current_medication1: Current_medication1.filter(
            (_, i) => i !== index
          ),
        });
        break;
      case 5:
        updateState({
          family_medical_condition: family_medical_condition.filter(
            (_, i) => i !== index
          ),
        });
        break;
    }
  };

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
                  <Typography color={COLORS.primary} size={16}>
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
                    key={index}
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
                  <Typography color={COLORS.primary} size={16}>
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
                    key={index}
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
                  <Typography color={COLORS.primary} size={16}>
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
                    key={index}
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

            {Current_medication1 && (
              <>
                <View style={{ height: 10 }} />
                <View style={styles.titleContainer}>
                  <Typography color={COLORS.primary} size={16}>
                    Current Medication
                  </Typography>
                  <Icon.Button
                    name="add"
                    color={COLORS.primary}
                    iconStyle={{ marginRight: 0 }}
                    backgroundColor="transparent"
                    onPress={() => onAddMore(4)}
                  >
                    Add More
                  </Icon.Button>
                </View>

                {Current_medication1.map((i, index) => (
                  <View
                    key={index}
                    style={[commonStyles.cardWithShadow, styles.inputContainer]}
                  >
                    <View style={styles.itemInputContainer}>
                      <TextInput
                        value={i}
                        style={styles.itemInput}
                        onChangeText={(value) =>
                          updateItemValue(value, index, 4)
                        }
                        placeholder={"Please enter details"}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => deleteItem(index, 4)}
                    >
                      <Icon name={"trash"} size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {family_medical_condition && (
              <>
                <View style={{ height: 10 }} />
                <View style={styles.titleContainer}>
                  <Typography color={COLORS.primary} size={16}>
                    Family Medical Condition
                  </Typography>
                  <Icon.Button
                    name="add"
                    color={COLORS.primary}
                    iconStyle={{ marginRight: 0 }}
                    backgroundColor="transparent"
                    onPress={() => onAddMore(5)}
                  >
                    Add More
                  </Icon.Button>
                </View>

                {family_medical_condition.map((i, index) => (
                  <View
                    key={index}
                    style={[commonStyles.cardWithShadow, styles.inputContainer]}
                  >
                    <View style={styles.itemInputContainer}>
                      <TextInput
                        value={i}
                        style={styles.itemInput}
                        onChangeText={(value) =>
                          updateItemValue(value, index, 5)
                        }
                        placeholder={"Please enter details"}
                      />
                    </View>
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => deleteItem(index, 5)}
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
