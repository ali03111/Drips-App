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
import { TestResultItemModel } from "../../store/models/MedicalHistory";
import FontAwesomeIcon from "react-native-vector-icons/dist/FontAwesome5";
import { startCase } from "lodash";
import { converImageToPDF } from "../../utils/utils";
const initialState = {
  selectedImage: null,
  title: "",
  isVisible: false,
  newTitle: "",
};
const TestResults = (props) => {
  const [{ selectedImage, newTitle, title, isVisible }, setState] =
    useState(initialState);
  const updateState = (state: {}) =>
    setState((prevState) => ({ ...prevState, ...state }));
  const { testResults, user: userData } = useSelector(
    (state: RootState) => state.UserReducer
  );

  const dispatch = useDispatch();

  const _fetchTestResults = () => {
    dispatch(fetchTestResults());
  };

  const _onModalClose = () => {
    updateState({
      selectedImage: null,
      newTitle: "",
      isVisible: false,
    });
  };
  const deleteItem = (id: any) => {
    Alert.alert("DELETE!", "Are you sure you want to delete?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "cancel",
        onPress: () => {
          dispatch(deleteTestResult(id));
        },
      },
    ]);
  };

  const _onSubmit = (item?: TestResultItemModel, isDelete?: boolean) => {
    if (item && isDelete) {
      deleteItem(item.id);
    } else {
      let body = new FormData();
      selectedImage && body.append("image", selectedImage);
      body.append("title", newTitle);
      body.append("patient_id", userData.user_id);
      _onModalClose();
      dispatch(uploadTestResult(body));
    }
  };

  const onItemDownload = (item: TestResultItemModel) => {
    converImageToPDF(item);
  };

  useEffect(() => {
    _fetchTestResults();
  }, []);
  return (
    <SafeAreaContainer safeArea={true} mode={"light"}>
      <View style={styles.mainContainer}>
        <InnerHeader title="Test Results" drawerBtn={false} backBtn={true} />
        <View style={styles.container}>
          <FlatList
            style={{ flex: 1 }}
            refreshing={false}
            onRefresh={() => _fetchTestResults()}
            contentContainerStyle={{ padding: 20 }}
            data={testResults}
            ListEmptyComponent={
              <ErrorListView title="No Test Results Found!" />
            }
            renderItem={({ item, index }) => {
              return (
                <View
                  style={[
                    commonStyles.cardWithShadow,
                    { flexDirection: "row" },
                  ]}
                >
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Typography size={12}>
                      <Typography size={18} color={"#5cb4c8"}>
                        {startCase(item.title) || "N/A"}
                      </Typography>
                    </Typography>
                    <Typography>
                      {moment(item.create_at).format("ll")}
                    </Typography>
                    <View>
                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => _onSubmit(item, true)}
                      >
                        <Typography color="#fff" size={12}>
                          Delete
                        </Typography>
                      </TouchableOpacity>

                      {/* Download Button */}
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          {
                            // marginLeft: 10,
                            backgroundColor: COLORS.successGreen,
                          },
                        ]}
                        onPress={() => onItemDownload(item)}
                      >
                        <Typography color="#fff" size={12}>
                          Download
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.testResultImageContainer}>
                    <Image
                      defaultSource={IMAGES.logo}
                      style={styles.testResultImage}
                      source={{ uri: IMAGE_URL + item.image }}
                    />
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
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
      <TouchableOpacity
        onPress={() => updateState({ isVisible: true })}
        style={styles.addIconButton}
      >
        <FontAwesomeIcon name="plus" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
  },
  addIconButton: {
    position: "absolute",
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: COLORS.primary,
    zIndex: 999,
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
    width: 100,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff2076",
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
  modalView: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.modalBg,
  },
  modalInnerContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
  },
  testResultImageContainer: {},
  testResultImage: {
    borderRadius: 10,
    width: 100,
    height: 100,
    resizeMode: "cover",
    backgroundColor: COLORS.lightGray,
  },
});

export default TestResults;
