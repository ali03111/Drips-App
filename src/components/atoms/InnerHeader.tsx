import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  COLORS,
  FONTSIZE,
  IMAGES,
  headerHeight,
  screenWidth,
} from "../../constants";
import { Typography } from "./Typography";
import { NotificationIcon } from "../icons/NotificationIcon";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/selectors/userSelector";
import { ArrowLeftIcon } from "../icons/ArrowLeftIcon";
import {
  navigate,
  onBack,
  toggleDrawer,
} from "../../navigation/RootNavigation";
import { commonStyles } from "../../style";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import { Platform } from "react-native";

type Props = {
  title?: string;
  backBtn?: boolean;
  drawerBtn?: boolean;
  rightIcons?: JSX.Element;
  fixed?: boolean;
  notificationBtn?: boolean;
  textColor?: string;
  onBackPress?: () => void;
};

export const InnerHeader = (props: Props) => {
  const user = useSelector(selectUser);

  const {
    title,
    fixed = false,
    backBtn = false,
    drawerBtn = false,
    notificationBtn = true,
    rightIcons = null,
    textColor = "#fff",
    style = {},
    onBackPress = null,
  }: any = props;

  return (
    <View
      style={[
        styles.header,
        fixed
          ? {
              position: "absolute",
              zIndex: 10,
            }
          : {},
        style,
      ]}
    >
      <View style={styles.headerContent}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {backBtn && (
            <TouchableOpacity
              style={styles.leftSideStyle}
              onPress={() =>
                props.onBackPress ? props.onBackPress() : onBack()
              }
            >
              <FaIcon name="arrow-left" color="#fff" size={16} />
            </TouchableOpacity>
          )}
          {drawerBtn && (
            <TouchableOpacity
              style={styles.leftSideStyle}
              onPress={() => toggleDrawer()}
            >
              <FaIcon name={"list"} color={"#fff"} size={18} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{ flex: 5, justifyContent: "center", alignItems: "center" }}
        >
          {title && (
            <Typography textType="regular" size={FONTSIZE.M} color={textColor}>
              {title}
            </Typography>
          )}
        </View>

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}
        >
          {rightIcons && rightIcons}
        </View>
      </View>
    </View>
  );
};
let headerHeightPlatform: any = Platform.select({ ios: 20, android: 60 });
const styles = StyleSheet.create({
  header: {
    height: headerHeight + headerHeightPlatform,
    width: screenWidth(100),
    paddingHorizontal: 10,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSideStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
});
