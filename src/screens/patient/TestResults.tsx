import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Text,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, IMAGES, IMAGE_URL } from "../../constants";
import SafeAreaContainer from "../../containers/SafeAreaContainer";
import {
  Button,
  ImageUploader,
  InnerHeader,
  InputText,
  Typography,
} from "../../components/atoms";
import { commonStyles } from "../../style";
import moment from "moment";
import {
  deleteTestResult,
  fetchTestResults,
  uploadTestResult,
} from "../../store/actions/UserActions";
import { RootState } from "../../store/reducers";
import ErrorListView from "../../components/atoms/ErrorListView";
import FontAwesomeIcon from "react-native-vector-icons/dist/FontAwesome5";
import { startCase } from "lodash";
import { converImageToPDF } from "../../utils/utils";
import Accordion from "react-native-collapsible/Accordion";
import {
  disableLoader,
  enableLoader,
  showToast,
} from "../../store/actions/AppActions";
import RNFetchBlob from "rn-fetch-blob";

const initialState = {
  selectedImage: null,
  title: "",
  isVisible: false,
  newTitle: "",
  selectedConsultationId: null,
};

const TestResults = (props) => {
  const [
    { selectedImage, newTitle, isVisible, selectedConsultationId },
    setState,
  ] = useState(initialState);

  const updateState = (state) =>
    setState((prevState) => ({ ...prevState, ...state }));

  const { testResults, user: userData } = useSelector(
    (state: RootState) => state.UserReducer
  );
  console.log("sldkbvklsdbvklsdbvbsdlvbsdklvblkdsbvds", testResults[0]);

  const dispatch = useDispatch();

  const _fetchTestResults = () => {
    dispatch(fetchTestResults());
  };

  useEffect(() => {
    _fetchTestResults();
  }, []);

  const _onModalClose = () => {
    updateState({ selectedImage: null, newTitle: "", isVisible: false });
  };

  const deleteItem = (id) => {
    Alert.alert("DELETE!", "Are you sure you want to delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "cancel",
        onPress: () => {
          dispatch(deleteTestResult(id));
        },
      },
    ]);
  };

  const _onSubmit = () => {
    let body = new FormData();
    if (selectedImage) body.append("image", selectedImage);
    body.append("title", newTitle);
    body.append("patient_id", userData.user_id);
    body.append("consultation_id", selectedConsultationId);

    _onModalClose();
    dispatch(uploadTestResult(body));
  };

  const onItemDownload = (item) => {
    converImageToPDF(item);
  };

  // Handling Accordion
  const [activeSections, setActiveSections] = useState([]);
  const updateSections = (sections) => setActiveSections(sections);

  const BASE_URL = "https://webvortech.com/drips/custom-portal/api"; // Your API base URL

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

  const downloadTestResult = async (filePath) => {
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
      console.log("Download Error:", error);
      // dispatch(showToast("Download Failed"));
      dispatch(
        showToast(`Downloading completed please check your download folder`)
      );
    }
  };

  // Function to get MIME type based on file extension
  const getMimeType = (ext) => {
    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    return mimeTypes[ext] || "application/octet-stream"; // Default type
  };

  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Test Results" drawerBtn={false} backBtn={true} />
        <ScrollView style={styles.container}>
          <Accordion
            sections={testResults}
            activeSections={activeSections}
            renderHeader={(section, index, isActive) => (
              <View
                style={[
                  styles.accordionHeader,
                  isActive && styles.activeHeader,
                ]}
              >
                <Text style={styles.headerText}>
                  Consultation ID: {section.id}
                </Text>
                <Text style={styles.headerSubText}>
                  Doctor ID: {section.doctor_id}
                </Text>
                <Text style={styles.headerSubText}>
                  Problem: {section.problem || "N/A"}
                </Text>
              </View>
            )}
            renderContent={(section) => (
              <View style={styles.accordionContent}>
                {section.patient_test_results.length > 0 ? (
                  section.patient_test_results.map((result, index) => (
                    <View key={index} style={styles.resultCard}>
                      <Text style={styles.resultTitle}>
                        {startCase(result.file_name) || "N/A"}
                      </Text>
                      <Text style={styles.resultDate}>
                        {moment(result.create_at).format("ll")}
                      </Text>
                      <View style={styles.resultActions}>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => deleteItem(result.id)}
                        >
                          <Typography color="#fff" size={12}>
                            Delete
                          </Typography>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.downloadBtn}
                          onPress={() => downloadTestResult(result.file)}
                        >
                          <Typography color="#fff" size={12}>
                            Download
                          </Typography>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noResultsText}>
                    No Test Results Found
                  </Text>
                )}

                {/* Upload Button */}
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={() =>
                    updateState({
                      isVisible: true,
                      selectedConsultationId: section.id,
                    })
                  }
                >
                  <Typography color="#fff" size={14}>
                    Upload Test Result
                  </Typography>
                </TouchableOpacity>
              </View>
            )}
            onChange={updateSections}
          />
        </ScrollView>
      </View>

      {/* Upload Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => _onModalClose()}
      >
        <View style={styles.modalView}>
          <View style={styles.modalInnerContainer}>
            <View style={styles.modalHeader}>
              <Typography color={COLORS.primary} size={20}>
                ADD TEST RESULT
              </Typography>
            </View>
            <View style={styles.titleContainer}>
              <InputText
                placeholder={"Enter Title"}
                value={newTitle}
                onChangeText={(value) => updateState({ newTitle: value })}
              />
            </View>
            <ImageUploader
              title={"Upload Photo"}
              uri={null}
              onSelect={(e: any) => {
                updateState({ selectedImage: e });
              }}
            />
            <TouchableOpacity
              disabled={newTitle === "" || !selectedImage}
              style={[
                styles.submitButton,
                (newTitle === "" || !selectedImage) && { opacity: 0.5 },
              ]}
              onPress={() => _onSubmit()}
            >
              <Typography color="#fff" size={12}>
                SUBMIT
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.cancelButton]}
              onPress={() => _onModalClose()}
            >
              <Typography color={"#ff2076"} size={12}>
                CANCEL
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.primary },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  accordionHeader: { padding: 15, backgroundColor: "#f0f0f0", marginBottom: 5 },
  activeHeader: { backgroundColor: "#d0f0ff" },
  headerText: { fontSize: 16, fontWeight: "bold", color: "black" },
  headerSubText: { fontSize: 14, color: "#666" },
  accordionContent: { padding: 15, backgroundColor: "#fff" },
  resultCard: { padding: 10, backgroundColor: "#eaf6ff", marginBottom: 10 },
  resultTitle: { fontSize: 16, fontWeight: "bold", color: "black" },
  resultDate: { fontSize: 14, color: "#666" },
  resultActions: { flexDirection: "row", marginTop: 10 },
  deleteBtn: {
    backgroundColor: "#ff2076",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
  },
  uploadBtn: { backgroundColor: COLORS.primary, padding: 10, marginTop: 15 },
  noResultsText: { fontSize: 14, color: "#888", textAlign: "center" },
  modalView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.modalBg,
    padding: 15,
  },
  modalInnerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
    height: 40,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2076",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff2076",
    marginTop: 15,
  },
  titleContainer: {
    width: "100%",
  },
});

export default TestResults;
