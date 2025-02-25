import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
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
import { RootState } from "../../store/reducers";
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
import { wp } from "../../utils/responsive";

const SelectPhysician = (props) => {
  const dispatch = useDispatch();
  const { availableConsultants } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );

  console.log(
    "availableConsultantsavailableConsultantsavailableConsultantsavailableConsultants",
    availableConsultants[1]
  );

  const [modalState, setModalState] = useState(null);
  const [afterFilterConsultants, setAfterFilterConsultants] = useState([]);
  const [typeState, setTypeState] = useState([
    {
      ModalTitle: "Select Speciality",
      type: "Speciality",
      modalArry: [
        "Don't Know",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      selectedVal: null,
    },
    {
      ModalTitle: "Select Gender",
      modalArry: ["Don't know", "AS", "AA", "AC", "CC", "SS", "SC"],
      type: "Gender",
      selectedVal: null,
    },
    {
      ModalTitle: "Select Language",
      modalArry: ["Don't know", "AS", "AA", "AC", "CC", "SS", "SC"],
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
        modalArry: response.specialities,
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
    const response = await get(`/search-filter-data`);
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
      `/search-doctor?speciality_id=${apiBody.Speciality}&language_id=${apiBody.Language}&gender=${apiBody.Gender}`
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
      .toLowerCase() // Convert to lowercase first to ensure proper formatting
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join back into a single string
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
            data={
              apiBody.Speciality ? afterFilterConsultants : availableConsultants
            }
            renderItem={({ item, index }) => {
              const image_url = { uri: IMAGE_URL + item.pic };
              return (
                <View style={styles.card}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={image_url}
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
                            numberOfLines={2}
                            color={COLORS.placeholderColor}
                          >
                            Speciality:
                          </Typography>
                          <Typography
                            size={10}
                            // numberOfLines={2}
                            color={COLORS.placeholderColor}
                          >
                            {item.speciality_name}
                          </Typography>

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
                          {/* <Button
                            label="Consultation"
                            backgroundColor="#ff2076"
                            btnStyle={{
                              marginLeft: 5,
                              height: 30,
                              paddingHorizontal: 10,
                            }}
                          /> */}
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
              height: height * 0.8,
            }}
            onClose={() => {
              setModalState(null);
              setApiBody({
                Speciality: null,
                Gender: null,
                Language: null,
              });
            }}
          >
            <FlatList
              data={typeState}
              ItemSeparatorComponent={() => <View />}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <Typography> {item.ModalTitle} </Typography>
                    {item.modalArry.map((res) => {
                      return (
                        <DropdownListItem
                          selected={apiBody[item.type] == (res?.id || res)}
                          title={capitalizeFirstLetter(res?.name ?? res)}
                          onPress={() => {
                            // typeState[index].selectedVal = res;
                            setApiBody((prev) => ({
                              ...prev,
                              [item.type]: res?.id ?? res,
                            }));
                            // setModalState(null);
                          }}
                        />
                      );
                    })}
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
    // ...commonStyles.boxShadow,
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
    // ...commonStyles.boxShadow,
    backgroundColor: COLORS.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 0.5,
    borderRightColor: "#ccc",
  },
  profileImg: {
    // borderWidth: 0.5,
    width: "100%",
    height: screenHeight(20),
    resizeMode: "cover",
    // borderColor: "#fff",
    // position: 'absolute',
    // borderRadius: 10,
  },
  detailsContainer: {
    marginVertical: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    flex: 1,
    padding: 10,
    // ...commonStyles.boxShadow,
    // backgroundColor: "#fff",
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
