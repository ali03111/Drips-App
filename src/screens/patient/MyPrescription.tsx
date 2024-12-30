import React, { useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import moment from "moment";
import { fetchPrescription } from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import ErrorListView from "../../components/atoms/ErrorListView";

const MyPrescription = (props) => {
  const {
    prescriptionData
  } = useSelector((state:RootState) => state.UserReducer);
  const dispatch = useDispatch();

  const _fetchPrescription = () => {
    dispatch(fetchPrescription())
  }

  useEffect(() => {
    _fetchPrescription();
  }, []);

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="My Prescriptions" backBtn />
        <View style={styles.container}>

          <FlatList 
            style={{ flex: 1 }}
            refreshing={false}
            onRefresh={()=>_fetchPrescription()}
            contentContainerStyle={{ padding: 20 }}
            data={prescriptionData}
            ListEmptyComponent={<ErrorListView title="No Prescriptions Found!" />}
            renderItem={ ({item, index}) => {
              return (
                <View style={ commonStyles.cardWithShadow }>
                  <Typography>Consultation #{item.id}</Typography>
                  <Typography size={12}>
                    {`Problem: `}
                    <Typography size={12} color={'#5cb4c8'}>
                      {item.problem || 'N/A'}
                    </Typography>
                  </Typography>
                  <Typography>{
                    moment(item.date).format('ll')  
                  }</Typography>

                  <View>
                    <TouchableOpacity
                      style={ styles.actionBtn }
                      onPress={ () => {} }
                    >
                      <Typography color="#fff" size={12}>
                        Download
                      </Typography>
                    </TouchableOpacity>
                  </View>

                </View>
              )
            } }
          />


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
  actionBtn: {
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2076"
  },
});

export default MyPrescription;
