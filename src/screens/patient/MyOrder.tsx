import React, { useEffect } from "react";
import { View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import ErrorListView from "../../components/atoms/ErrorListView";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { reset } from "../../navigation/RootNavigation";
import moment from "moment";
import { RootState } from "../../store/reducers";
import { fetchPrescription } from "../../store/actions/UserActions";


const MyOrder = (props) => {
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
        <InnerHeader title="My Orders" backBtn={true} />
        <View style={styles.container}>
          <FlatList 
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={[]}
            ListEmptyComponent={() => <ErrorListView title={'No Orders Found'} />}
            renderItem={ ({item, index}) => {
              return (
                <View style={ commonStyles.cardWithShadow }>
                  <Typography>Consultation #{ 300 - index }</Typography>
                  <Typography size={12}>
                    {`Problem: `}
                    <Typography size={12} color={'#5cb4c8'}>
                      Fever, Flu, Headache, Frequent Urination
                    </Typography>
                  </Typography>
                  <Typography>{
                    moment().subtract( index, 'week' ).format('ll')  
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

export default MyOrder;
