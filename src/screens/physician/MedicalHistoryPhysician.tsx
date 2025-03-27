import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import { fetchMedicalHistory } from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import Icon from "react-native-vector-icons/Ionicons";
import { MedicalHistoryModel } from "../../store/models/MedicalHistory";
import { isEmpty } from "lodash";
import { navigate } from "../../navigation/RootNavigation";
import { disableLoader, enableLoader } from "../../store/actions/AppActions";
import { errorHandler } from "../../utils/utils";
import { post, get } from "../../store/services/Http";

const MedicalHistoryPhysician = (props) => {
  const item = props.route.params;
  const { loader } = useSelector((state: RootState) => state.AppReducer);
  // const medicalDetails: MedicalHistoryModel = useSelector(
  //   (state: RootState) => state.UserReducer.medicalHistory
  // );
  const [medicalDetails, setMedicalDetails] = useState({
    surgicalHistory: [],
    MedicalHistory: [],
    allergies: [],
    Current_medication1: [],
    family_medical_condition: [],
  });

  const {
    Current_medication1,
    MedicalHistory,
    allergies,
    family_medical_condition,
    surgicalHistory,
  } = medicalDetails;

  console.log("medicalDetails ====> ", medicalDetails);

  // const surgicalHistory = (medicalDetails && medicalDetails.Surgeries1) || [];
  // const pastMedicalHistory =
  //   (medicalDetails && medicalDetails.past_medical_history) || [];
  // const allergies = (medicalDetails && medicalDetails.allergies) || [];
  // const currentMedication = (medicalDetails && medicalDetails.allergies) || [];
  // const familyMedication = (medicalDetails && medicalDetails.family_medical_condition) || [];
  const dispatch = useDispatch();
  const _fetchMedicalHistory = () => {
    fetchOrders();
  };

  const fetchOrders = async () => {
    dispatch(enableLoader());
    const response = await get(`/patient-detail-1?patient_id=${item.user_id}`);
    console.log("sdlkvbklasdbvklsdbklbsdlvbsklvbsdklvbskldlvbs", response);
    if (response.status && response.code === "200") {
      setMedicalDetails(response.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  useEffect(() => {
    _fetchMedicalHistory();
  }, []);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Medical History" drawerBtn={false} backBtn={true} />
        <View style={styles.container}>
          {!loader && (
            <ScrollView style={{ padding: 20 }}>
              {MedicalHistory && (
                <>
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Past Medical History
                    </Typography>
                  </View>

                  {MedicalHistory.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {MedicalHistory?.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Past Medical History Found
                    </Typography>
                  )}
                </>
              )}

              {allergies && (
                <>
                  <View style={{ height: 10 }} />
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Allergies
                    </Typography>
                  </View>

                  {allergies.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {allergies.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Allergies Found
                    </Typography>
                  )}
                </>
              )}

              {surgicalHistory && (
                <>
                  <View style={{ height: 10 }} />
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Surgical History
                    </Typography>
                  </View>

                  {surgicalHistory?.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {surgicalHistory?.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Surgical History Found
                    </Typography>
                  )}
                </>
              )}
              {family_medical_condition && (
                <>
                  <View style={{ height: 10 }} />
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Family History
                    </Typography>
                  </View>

                  {family_medical_condition?.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {family_medical_condition?.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Family History Found
                    </Typography>
                  )}
                </>
              )}
              {Current_medication1 && (
                <>
                  <View style={{ height: 10 }} />
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Current medication
                    </Typography>
                  </View>

                  {Current_medication1?.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {Current_medication1?.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Current History Found
                    </Typography>
                  )}
                </>
              )}
              <View style={{ height: 50 }} />
            </ScrollView>
          )}
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
});

export default MedicalHistoryPhysician;
