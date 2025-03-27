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
import { COLORS, IMAGE_URL, IMAGES } from "../../constants";
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
import { RootState } from "../../store/reducers";
import {
  fetchAttachments,
  fetchOrders,
  fetchPrescription,
  fetchResults,
} from "../../store/actions/UserActions";
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
import { hp, wp } from "../../utils/responsive";

const Attachments = (props) => {
  const { attachmentsData } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();

  const _fetchPrescription = () => {
    dispatch(fetchAttachments(props.route.params.id));
  };

  const [attachmentsList, setAttachmentsList] = useState([]);

  const fetechAttacmentsApi = async () => {
    dispatch(enableLoader());
    const response = await get(
      `/get-attachments?consultation_id=${props.route.params.id}`
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
    fetechAttacmentsApi();
  }, []);

  // console.log("sldbvlsbdlvbsdlvbsdkbvsdbvbsdvksdbvlksdbklvds", attachmentsData);

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

  const BASE_URL = "https://webvortech.com/drips/custom-portal/api"; // 🔹 Replace with your API's base URL

  const downloadOrdersApi = async (filePath) => {
    dispatch(enableLoader());

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      dispatch(disableLoader());
      Alert.alert(
        "Permission Denied",
        "You need to allow storage permission to download files."
      );
      return;
    }

    try {
      const fileUrl = `${BASE_URL}/download-test-result?file_path=${filePath}`;
      console.log("Downloading from:", fileUrl);

      dispatch(showToast("Downloading Started..."));
      dispatch(disableLoader());
      // Extract file extension from URL
      const fileName = filePath.split("/").pop();
      const fileExt = fileName.split(".").pop();

      // Define file path
      const { dirs } = RNFetchBlob.fs;
      const fileSavePath =
        Platform.OS === "android"
          ? `${dirs.DownloadDir}/${fileName}`
          : `${dirs.DocumentDir}/${fileName}`; // iOS uses DocumentDir

      // Start download
      const res = await RNFetchBlob.config({
        fileCache: true,
        path: fileSavePath,
        appendExt: fileExt, // Automatically adds file extension
        IOSBackgroundTask: true,
        indicator: true,
        addAndroidDownloads: { notification: true, useDownloadManager: true },
      }).fetch("GET", fileUrl);

      dispatch(showToast(`File saved to: ${res.path()}`));
      dispatch(disableLoader());
      console.log("File saved to:", res.path());

      // Open file after download
      // if (Platform.OS === "android") {
      //   RNFetchBlob.android.actionViewIntent(res.path(), getMimeType(fileExt));
      // } else {
      //   RNFetchBlob.ios.openDocument(res.path());
      // }
    } catch (error) {
      dispatch(disableLoader());
      console.error("Download Error:", error);
      // dispatch(showToast("Download Failed"));
      dispatch(
        showToast(`Downloading completed please check your download folder`)
      );
    }
  };

  //   let userImageUrl =
  //     (patientDetails.pic && { uri: IMAGE_URL + patientDetails.pic }) ||
  //     IMAGES.avatar_placeholder;

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Attachments" backBtn={true} />
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
            data={attachmentsList}
            ListEmptyComponent={() => (
              <ErrorListView title={"No Attachments"} />
            )}
            renderItem={({ item, index }) => {
              return (
                <View style={commonStyles.cardWithShadow}>
                  <Image
                    source={{ uri: IMAGE_URL + item?.image }}
                    style={styles.profileImage}
                    resizeMode={"cover"}
                  />

                  <View>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        downloadOrdersApi(item?.image);
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
    // width: widthPercentageToDP("40"),
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: heightPercentageToDP("1"),
  },
  profileImage: {
    width: wp("83"),
    height: hp("23"),
    marginRight: 15,
    borderRadius: 10,
  },
});

export default Attachments;
