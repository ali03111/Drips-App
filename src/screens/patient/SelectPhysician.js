import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES, IMAGE_URL, screenHeight } from "../../constants";
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
import { updateConsultantData } from "../../store/actions/UserActions";
import { errorHandler, renderStars } from "../../utils/utils";
import Icon from "react-native-vector-icons/FontAwesome";
import DropdownModal from "../../components/atoms/DropdownModal";
import DropdownListItem from "../../components/atoms/DropdownListItem";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { get } from "../../store/services/Http";
import { disableLoader, enableLoader } from "../../store/actions/AppActions";
import { EmptyList } from "../../components/atoms/EmptyList";
import { hp, wp } from "../../utils/responsive";
import { useFocusEffect } from "@react-navigation/native";

const SelectPhysician = (props) => {
  const dispatch = useDispatch();
  const { availableConsultants } = useSelector(
    (state) => state.ConsultantReducer
  );

  console.log(
    "availableConsultantsavailableConsultantsavailableConsultantsavailableConsultants",
    availableConsultants[1]
  );

  useLayoutEffect(() => setModalState(true), []);

  const [modalState, setModalState] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [afterFilterConsultants, setAfterFilterConsultants] = useState([]);
  const [typeState, setTypeState] = useState([
    {
      ModalTitle: "Select Speciality",
      type: "Speciality",
      modalArry: [],
      selectedVal: null,
    },
    {
      ModalTitle: "Select Gender",
      modalArry: [],
      type: "Gender",
      selectedVal: null,
    },
    {
      ModalTitle: "Select Language",
      modalArry: [],
      type: "Language",
      selectedVal: null,
    },
  ]);
  const [apiBody, setApiBody] = useState({
    Speciality: null,
    Gender: null,
    Language: null,
  });

  const updateTypeState = (response) => {
    return [
      {
        ModalTitle: "Select Speciality",
        type: "Speciality",
        modalArry: [
          ...response.specialities,
          {
            id: 113131113,
            created_at: "2021-07-08 00:47:27",
            updated_at: "2021-07-30 01:07:54",
            name: "Other",
            symtom: "other",
          },
        ],
        selectedVal: null,
      },
      {
        ModalTitle: "Select Gender",
        type: "Gender",
        modalArry: response.genders,
        selectedVal: null,
      },
      {
        ModalTitle: "Select Language",
        type: "Language",
        modalArry: response.languages,
        selectedVal: null,
      },
    ];
  };

  const fetchFilterDataApi = async () => {
    dispatch(enableLoader());
    const response = await get("/search-filter-data");
    if (response.status && response.code === "200") {
      setTypeState(updateTypeState(response));
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  const fetchFilterDoctorsApi = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/search-doctor?speciality_id=${
        apiBody.Speciality != "113131113" ? apiBody.Speciality : null
      }&language_id=${apiBody.Language}&gender=${apiBody.Gender}`
    );
    if (response.status && response.code === "200") {
      setAfterFilterConsultants(response.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  useEffect(() => {
    fetchFilterDataApi();
  }, []);

  function capitalizeFirstLetter(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const { width, height } = Dimensions.get("window");
  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader
          title="Physicians"
          drawerBtn={false}
          backBtn={true}
          rightIcons={
            <Icon
              name="filter"
              color={COLORS.white}
              size={20}
              onPress={() => setModalState(true)}
            />
          }
        />
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={isFilter ? afterFilterConsultants : availableConsultants}
            renderItem={({ item, index }) => {
              const image_url = { uri: IMAGE_URL + item.pic };
              return (
                <View style={styles.card}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={image_url}
                        // source={IMAGES.avatar_placeholder}
                        defaultSource={IMAGES.avatar_placeholder}
                        style={styles.profileImg}
                        resizeMode={"cover"}
                      />
                    </View>
                    <View style={styles.detailsContainer}>
                      <View style={styles.cardDetail}>
                        <View style={{ flex: 1 }}>
                          <Typography size={14} textType="semiBold">
                            {item.name}
                          </Typography>
                          <Typography
                            size={10}
                            numberOfLines={3}
                            color={COLORS.placeholderColor}
                          >
                            Speciality: {item.speciality_name}
                          </Typography>
                          {/* <Typography size={10} color={COLORS.placeholderColor}>
                            {item.speciality_name}
                          </Typography> */}

                          <Typography>{item.status}</Typography>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Typography size={12} color={COLORS.rating}>
                            {" "}
                            {item.customer_status || 1} (100){" "}
                          </Typography>
                          {renderStars(item.customer_status || 1)}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            label="View"
                            backgroundColor="#4cd2fd"
                            onPress={() => {
                              dispatch(
                                updateConsultantData({
                                  latestBookingId: undefined,
                                })
                              );
                              props.navigation.navigate("PhysicianDetail", {
                                item,
                                bookingType: "booking",
                              });
                            }}
                            btnStyle={{
                              height: 30,
                              paddingHorizontal: 10,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => <EmptyList />}
          />
        </View>
        {modalState != null && (
          <DropdownModal
            title={"Filter"}
            innerViewStyles={{
              height: height * 0.9,
            }}
            onClose={() => {
              setModalState(null);
              setIsFilter(false);
              setApiBody({
                Speciality: null,
                Gender: null,
                Language: null,
              });
            }}
          >
            <FlatList
              data={typeState}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <Typography style={{ marginBottom: hp("1") }}>
                      {" "}
                      {item.ModalTitle}{" "}
                    </Typography>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        marginBottom: hp("3"),
                      }}
                    >
                      {item.modalArry.map((res) => {
                        const isSelected = Boolean(
                          apiBody[item.type] == (res?.id || res)
                        );
                        return (
                          <Text
                            style={{
                              paddingVertical: hp("1"),
                              paddingHorizontal: wp("2"),
                              backgroundColor: isSelected
                                ? COLORS.primary
                                : COLORS.gray,
                              marginVertical: hp("0.5"),
                              width: "auto",
                              textAlign: "center",
                              borderRadius: 16,
                              overflow: "hidden",
                              marginRight: wp("1"),
                              color: isSelected
                                ? COLORS.white
                                : COLORS.lightBlack,
                            }}
                            onPress={() => {
                              setApiBody((prev) => ({
                                ...prev,
                                [item.type]: res?.id ?? res,
                              }));
                            }}
                          >
                            {capitalizeFirstLetter(res?.name ?? res)}
                          </Text>
                        );
                      })}
                    </View>
                  </>
                );
              }}
            />

            <View
              style={{
                flexDirection: "row",
                width: wp("80"),
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  fetchFilterDoctorsApi();
                  setModalState(null);
                  setIsFilter(true);
                }}
              >
                <Typography color="#fff" size={12}>
                  Apply filter
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setModalState(null);
                  setIsFilter(false);
                  setAfterFilterConsultants([]);
                  setApiBody({
                    Speciality: null,
                    Gender: null,
                    Language: null,
                  });
                }}
              >
                <Typography color="#fff" size={12}>
                  Clear filter
                </Typography>
              </TouchableOpacity>
            </View>
          </DropdownModal>
        )}
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
    height: screenHeight(20),
    backgroundColor: "#fff",
    borderColor: "#ddd",
    overflow: "hidden",
    borderWidth: 1,
    marginVertical: 15,
    borderRadius: 10,
  },
  imageContainer: {
    width: "32%",
    height: screenHeight(20),
    overflow: "hidden",
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0.5,
    borderRightColor: "#ccc",
  },
  profileImg: {
    width: wp("40"),
    height: hp("20"),
    resizeMode: "cover",
  },
  detailsContainer: {
    marginVertical: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
    padding: 10,
  },
  cardDetail: {
    flex: 1,
  },
  actionBtn: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: heightPercentageToDP("1"),
    marginBottom: heightPercentageToDP("2"),
    width: widthPercentageToDP("39"),
    alignSelf: "center",
  },
});

export default SelectPhysician;

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
