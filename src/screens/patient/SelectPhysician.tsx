import React from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
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

const SelectPhysician = (props) => {
  const dispatch = useDispatch();
  const { availableConsultants } = useSelector(
    (state: RootState) => state.ConsultantReducer
  );
  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Physicians" drawerBtn={false} backBtn={true} />
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={availableConsultants}
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
                            Expertise: {"\n"}
                            {item.expertise}
                          </Typography>
                          <Typography>{item.status}</Typography>
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
