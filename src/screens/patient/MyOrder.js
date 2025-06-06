import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import { Button, InnerHeader, Typography } from "../../components/atoms";
import { commonStyles } from "../../style";
import ErrorListView from "../../components/atoms/ErrorListView";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-credit-card-input";
import { reset } from "../../navigation/RootNavigation";
import moment from "moment";
import { get } from "../../store/services/Http";
import {
  disableLoader,
  enableLoader,
  showToast,
} from "../../store/actions/AppActions";
import { errorHandler } from "../../utils/utils";
import RNFetchBlob from "rn-fetch-blob";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { fetchOrdersApi } from "../../store/services/Services";

const MyOrder = (props) => {
  const { orderData, user } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.UserReducer);
  const [attachmentsList, setAttachmentsList] = useState([]);
  const _fetchPrescription = async () => {
    dispatch(enableLoader());
    const response = await fetchOrdersApi(user?.user_id);
    console.log(
      "lsdvlsbdlkbsdlbvlsdblkvbsdlkbvlksdblvsbdlvbsbdkbdsklbvklsdvsd",
      response
    );
    if (response.status && response.code === "200") {
      setAttachmentsList(response?.data);
      dispatch(disableLoader());
    } else {
      dispatch(disableLoader());
      errorHandler(response);
    }
  };

  useEffect(() => {
    _fetchPrescription();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download files",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.log("Permission Error:", err);
        return false;
      }
    }
    return true;
  };

  const BASE_URL = "https://dripsmedical.com/custom-portal/api";

  const downloadOrdersApi = async (id, patient_id, doctor_id) => {
    // const hasPermission = await requestStoragePermission();
    // if (!hasPermission) {
    //   Alert.alert(
    //     "Permission Denied",
    //     "You need to allow storage permission to download files."
    //   );
    //   return;
    // }

    dispatch(enableLoader());

    try {
      const fileUrl = `${BASE_URL}/orderpdfview?id=${id}&download=pdf&patient_id=${patient_id}&doctor_id=${doctor_id}`;

      dispatch(showToast("Downloading Started..."));
      dispatch(disableLoader());
      const { dirs } = RNFetchBlob.fs;
      const filePath =
        Platform.OS === "android"
          ? `${dirs.DownloadDir}/order_${id}.pdf`
          : `${dirs.DocumentDir}/order_${id}.pdf`;

      const res = await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
        appendExt: "pdf",
        IOSBackgroundTask: true,
        indicator: true,
        addAndroidDownloads: { notification: true, useDownloadManager: true },
      }).fetch("GET", fileUrl);

      dispatch(disableLoader());
      dispatch(showToast(`File saved to: ${res.path()}`));

      console.log("File saved to:", res.path());
    } catch (error) {
      dispatch(disableLoader());
      console.log("Download Error:", error);
      dispatch(
        showToast(`Downloading completed please check your download folder`)
      );
    }
  };
  console.log("orderDataorderDataorderDataorderDataorderData", orderData);

  function removeCommaFromEnd(text) {
    if (text) {
      if (text.endsWith(",")) {
        return text.slice(0, -1);
      }
      return text;
    }
  }

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="My Orders" backBtn={true} />
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={attachmentsList}
            ListEmptyComponent={() => (
              <ErrorListView title={"No Orders Found"} />
            )}
            renderItem={({ item, index }) => {
              return (
                <View style={commonStyles.cardWithShadow}>
                  <Typography>Consultation #{item?.id}</Typography>
                  <Typography size={12}>
                    {`Problem: `}
                    <Typography size={12} color={"#5cb4c8"}>
                      {removeCommaFromEnd(item?.problem)}
                    </Typography>
                  </Typography>
                  <Typography>
                    {moment().subtract(index, "week").format("ll")}
                  </Typography>

                  <View>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        downloadOrdersApi(
                          item?.id,
                          item?.patient_id,
                          item?.doctor_id
                        );
                      }}
                    >
                      <Typography color="#fff" size={12}>
                        Download
                      </Typography>
                    </TouchableOpacity>
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
  actionBtn: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: heightPercentageToDP("1"),
  },
});

export default MyOrder;
