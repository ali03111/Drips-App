import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ImageSourcePropType,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS, IMAGES, IMAGE_URL, screenWidth } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  ImageUploader,
  InnerHeader,
  InputDateTime,
  Typography,
} from "../../components/atoms";
import CheckBox from "@react-native-community/checkbox";
import { commonStyles } from "../../style";
import { RootState } from "../../store/reducers";
import { getPatientApointmentsAction } from "../../store/actions/UserActions";
import { ApointmentItemModel } from "../../store/models";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import { startCase } from "lodash";
const MyConsultantations = (props) => {
  const dispatch = useDispatch();
  const { apointmentList } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );

  const [searchText, setSearchText] = useState("");
  const _fetchConsultations = () => {
    dispatch(getPatientApointmentsAction());
  };

  useEffect(() => {
    _fetchConsultations();
  }, []);

  const getData = () => {
    if (!searchText) return apointmentList;
    return apointmentList.filter((i) => {
      return (
        (i.name && i.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (i.doctorname &&
          i.doctorname.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  };

  const _getImage = (item: ApointmentItemModel): ImageSourcePropType => {
    return { uri: IMAGE_URL + item.doctorimage } || { uri: "" };
    if (item.images && item.images.length > 0) return { uri: item.images[0] };
    else return { uri: "" };
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="My Consultation" drawerBtn={false} backBtn={true} />
        <View style={styles.container}>
          <View style={styles.searchInput}>
            <FaIcon name="search" size={16} color={COLORS.black} />
            <TextInput
              placeholder="Filter By name"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={COLORS.darkGray}
              style={{
                flex: 1,
                fontFamily: FONTS.PoppinsMedium,
                padding: 10,
                color: "black",
              }}
            />
          </View>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={getData()}
            renderItem={({
              item,
              index,
            }: {
              item: ApointmentItemModel;
              index: number;
            }) => (
              <View style={styles.card}>
                <Pressable
                  onPress={() =>
                    props.navigation.navigate("ConsultantDetails", { item })
                  }
                  style={{ flexDirection: "row" }}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={_getImage(item)}
                      defaultSource={IMAGES.avatar_placeholder}
                      style={styles.profileImg}
                      resizeMode={"cover"}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <View style={styles.cardDetail}>
                      <Typography size={14} textType="semiBold">
                        {startCase(item.doctorname)}
                      </Typography>
                      {/* <Typography size={10} numberOfLines={2} color={ COLORS.placeholderColor }>Expertise: {'\n'}{ item.ex }</Typography> */}
                      <Typography>
                        Status: {startCase(item.Is_accept)}
                      </Typography>
                      <Typography>
                        Payment Status:{" "}
                        {item.payment_status ? "Paid" : "UnPaid"}
                      </Typography>
                      <Typography>ID: {item.id}</Typography>
                      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {!item.payment_status ? <Button 
                      label='Pay Now' 
                      backgroundColor='#4cd2fd'
                      onPress={ () => props.navigation.navigate('PhysicianDetail', { item,bookingType:'booking' } ) }
                      btnStyle={{
                        height: 30,
                        paddingHorizontal: 10
                      }}
                    />:
                    <Button 
                      label='Consultation'
                      backgroundColor='#ff2076'
                      btnStyle={{
                        marginLeft: 5,
                        height: 30,
                        paddingHorizontal: 10
                      }}
                    />}
                  </View> */}
                    </View>
                  </View>
                </Pressable>
              </View>
            )}
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
  ribbon: {
    backgroundColor: COLORS.primary,
    marginHorizontal: -20,
  },
  card: {
    // ...commonStyles.boxShadow,
    // backgroundColor: '#fff',
    marginVertical: 15,
    borderRadius: 5,
  },
  imageContainer: {
    width: screenWidth(30),
    ...commonStyles.boxShadow,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  profileImg: {
    borderWidth: 0.5,
    width: screenWidth(30),
    height: 145,
    backgroundColor: COLORS.lightGray,
    resizeMode: "cover",
    borderColor: "#fff",
    // position: 'absolute',
    borderRadius: 10,
  },
  detailsContainer: {
    marginVertical: 5,
    maxHeight: 135,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
    padding: 10,
    ...commonStyles.boxShadow,
    backgroundColor: "#fff",
  },
  cardDetail: {},
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

export default MyConsultantations;

const PHYSICIANS = [
  {
    name: "Dr Calora Mathis",
    specialist: "MD FWACS (Consultant)",
    status: "Available",
    image: IMAGES.doctor1,
  },
  {
    name: "Dr Kimberly Lisa",
    specialist: "MD FWACS (Consultant)",
    status: "Available",
    image: IMAGES.doctor2,
  },
  {
    name: "Dr Adam",
    specialist: "MD FWACS (Consultant)",
    status: "Available",
    image: IMAGES.doctor3,
  },
];
