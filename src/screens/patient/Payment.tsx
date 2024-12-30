import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader } from "../../components/atoms";
import { CreditCardInput } from "react-native-credit-card-input";
import { navigate, reset } from "../../navigation/RootNavigation";


const Payment = (props) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Payment Details" drawerBtn={false} backBtn={true} />
        <View style={styles.container}>

          <CreditCardInput 
            onChange={ () => {} }
          />

          <Button 
            label={'Pay Now'} 
            style={{ marginTop: 50 }}
            onPress={ () => navigate('Chat' as never) }
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
    paddingVertical: 40,
    padding: 20
  },
});

export default Payment;
