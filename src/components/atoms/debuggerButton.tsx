import * as React from "react";
import { Platform, TouchableOpacity, StyleSheet } from "react-native";
import { navigationRef } from "../../navigation/RootNavigation";

interface DebuggerProps {}

const DebuggerButton = (props: DebuggerProps) => {
  return (
    <TouchableOpacity
      style={{
        opacity: 1,
        left: 10,
        bottom: Platform.OS === "ios" ? 150 : 50,
        backgroundColor: "blue",
        position: "absolute",
        zIndex: 99999999,
        elevation: 2,
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 35,
      }}
      onPress={() => {
        navigationRef && navigationRef.navigate("Network" as never);
      }}
    />
  );
};

export default DebuggerButton;
