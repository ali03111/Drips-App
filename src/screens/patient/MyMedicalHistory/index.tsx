import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../constants";
import SafeAreaContainer from "../../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../../components/atoms";
import { commonStyles } from "../../../style";
import { fetchMedicalHistory } from "../../../store/actions/UserActions";
import { RootState } from "../../../store/reducers";
import Icon from "react-native-vector-icons/Ionicons";
import { MedicalHistoryModel } from "../../../store/models/MedicalHistory";
import { isEmpty } from "lodash";
import { navigate } from "../../../navigation/RootNavigation";

const MyMedicalHistory = (props) => {
  const { loader } = useSelector((state: RootState) => state.AppReducer);
  const medicalDetails: MedicalHistoryModel = useSelector(
    (state: RootState) => state.UserReducer.medicalHistory
  );
  console.log("medicalDetails ====> ", medicalDetails);

  const surgicalHistory = (medicalDetails && medicalDetails.Surgeries1) || [];
  const pastMedicalHistory =
    (medicalDetails && medicalDetails.past_medical_history) || [];
  const allergies = (medicalDetails && medicalDetails.allergies) || [];
  const dispatch = useDispatch();
  const _fetchMedicalHistory = () => {
    dispatch(fetchMedicalHistory());
  };

  useEffect(() => {
    _fetchMedicalHistory();
  }, []);

  const onEditPress = (type: string) => {
    navigate("EditMedicalHistory" as never);
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
          {!loader && (
            <ScrollView style={{ padding: 20 }}>
              {pastMedicalHistory && (
                <>
                  <View style={styles.titleContainer}>
                    <Typography color="#fe4e91" size={16}>
                      Past Medical History
                    </Typography>
                    <Icon.Button
                      name="create-outline"
                      color={COLORS.primary}
                      iconStyle={{ marginRight: 0 }}
                      backgroundColor="transparent"
                      onPress={() => onEditPress("medicalHistory")}
                    >
                      Edit
                    </Icon.Button>
                  </View>

                  {pastMedicalHistory.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {pastMedicalHistory.length === 0 && (
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

                  {surgicalHistory.map((i) => (
                    <View style={commonStyles.cardWithShadow}>
                      <Typography>{i}</Typography>
                    </View>
                  ))}
                  {surgicalHistory.length === 0 && (
                    <Typography style={styles.emptyText}>
                      No Surgical History Found
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

export default MyMedicalHistory;