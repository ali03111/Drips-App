import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS } from "../../../constants";
import SafeAreaContainer from "../../../containers/SafeAreaContainer";
import { InnerHeader, Typography } from "../../../components/atoms";
import { commonStyles } from "../../../style";
import moment from "moment";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import { navigate } from "../../../navigation/RootNavigation";
import { RootState } from "../../../store/reducers";
import { fetchPhysicianPatients } from "../../../store/actions/PhysicianActions";
import { startCase } from "lodash";
import { getChatDetailsAction } from "../../../store/actions/ChatActions";
import { onUserLogin } from "../../../utils/ZegoCloudConfig";

const Consultations = (props) => {
  const dispatch = useDispatch();
  const [searchText, onSearchText] = useState("");
  const userData = useSelector((state: RootState) => state.UserReducer.user);

  const { physicianPatients } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );

  const _fetchAllPatients = () => {
    onSearchText("");
    dispatch(fetchPhysicianPatients());
  };

  useEffect(() => {
    onUserLogin({
      userID: userData.user_id,
      userName: userData.name,
      userType: "physician",
    });
    _fetchAllPatients();
  }, []);

  const { title = "Scheduled Consultations" } = props.route.params || {};

  const getData = () => {
    if (searchText === "") return physicianPatients;
    return physicianPatients.filter((i) =>
      i.name.toLowerCase().includes(searchText.toLocaleLowerCase())
    );
  };
  const _renderTime = (item: any) => {
    let date = `${item.date} ${item.timing}`;
    return moment(date).format("LLLL");
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title={title} drawerBtn={true} />
        <View style={styles.container}>
          <View style={styles.searchInput}>
            <FaIcon name="search" size={16} />
            <TextInput
              placeholder="Filter By name"
              value={searchText}
              onChangeText={onSearchText}
              style={{
                flex: 1,
                fontFamily: FONTS.PoppinsMedium,
                padding: 10,
              }}
            />
          </View>

          <FlatList
            style={{ flex: 1 }}
            refreshing={false}
            onRefresh={_fetchAllPatients}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Typography color={COLORS.primary} textType={"bold"} size={16}>
                List Of Patients
              </Typography>
            )}
            data={getData()}
            ListEmptyComponent={() => (
              <Typography
                style={{ textAlign: "center", paddingVertical: 10 }}
                color={COLORS.danger}
                textType={"bold"}
                size={16}
              >
                No Patients Found
              </Typography>
            )}
            renderItem={({ item, index }) => {
              const isPaid = item.payment_status === "success";
              let paymentStyle = {
                paddingHorizontal: 20,
                borderRadius: 6,
                overflow: "hidden",
                color: "white",
                ...styles.unPaidText,
              };
              if (isPaid) {
                paymentStyle = { ...paymentStyle, ...styles.paidText };
              }
              return (
                <View style={commonStyles.cardWithShadow}>
                  <Typography>
                    Patient Medical Record DMS - #{item.id}
                  </Typography>
                  <Typography size={12} color={COLORS.halfWhite}>
                    {`Name: `}
                    <Typography size={12} color={"#5cb4c8"}>
                      {(item.name && startCase(item.name)) || "N/A"}
                    </Typography>
                  </Typography>

                  <Typography size={12} color={COLORS.halfWhite}>
                    {`Problem: `}
                    <Typography size={12} color={"#5cb4c8"}>
                      {(item.problem && startCase(item.problem)) || "N/A"}
                    </Typography>
                  </Typography>

                  <Typography size={12} color={COLORS.halfWhite}>
                    {`Consultation Type: `}
                    <Typography size={12} color={"#5cb4c8"}>
                      {item.booking_type}
                    </Typography>
                  </Typography>

                  <Typography size={12} style={{ marginTop: 10 }}>
                    {_renderTime(item)}
                  </Typography>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Typography size={12}>Payment Status: </Typography>
                    <Typography size={12} style={paymentStyle}>
                      {startCase(item.payment_status || "Pending")}
                    </Typography>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#4cd2fd" }]}
                      onPress={() =>
                        navigate("ElectronicCard" as never, { item } as never)
                      }
                    >
                      <Typography color="#fff" size={12}>
                        View
                      </Typography>
                    </TouchableOpacity>
                    {isPaid && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          dispatch(getChatDetailsAction(item));
                        }}
                      >
                        <Typography color="#fff" size={12}>
                          Start Consultation
                        </Typography>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  paidText: {
    backgroundColor: "green",
    // paddingHorizontal: 10,
  },
  unPaidText: {
    backgroundColor: "red",
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
  actionBtn: {
    marginRight: 5,
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2076",
  },
  searchInput: {
    ...commonStyles.inputView,
    ...commonStyles.boxShadow,
    marginVertical: 15,
    marginHorizontal: 20,
    padding: 0,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

export default Consultations;
