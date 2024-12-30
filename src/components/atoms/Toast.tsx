import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, Dimensions, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS } from "../../constants";
import { hideToast } from "../../store/actions/AppActions";
const { width } = Dimensions.get("window");

interface ToastProps {}
const Toast = (props: ToastProps) => {
  const navigation = useNavigation();
  const { toast } = useSelector((state: any) => state.AppReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (toast.show) {
      setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
    }
  }, [toast.show]);
  if (!toast || !toast.show) return null;
  return (
    <Animatable.View animation={"fadeIn"} style={styles.container}>
      <Text style={styles.title}>{toast.title}</Text>
    </Animatable.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.toastBg,
    padding: 10,
    margin: 10,
    width: width - 20,
    position: "absolute",
    bottom: 20,
    borderRadius: 5,
    zIndex: 9999,
  },
  title: {
    textAlign: "center",
    fontSize: 13,
    color: COLORS.white,
    fontFamily: FONTS.PoppinsRegular,
  },
});
