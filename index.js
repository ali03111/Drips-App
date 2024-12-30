/**
 * @format
 */

import "react-native-gesture-handler";
import { startNetworkLogging } from "react-native-network-logger";

import { AppRegistry, LogBox, YellowBox } from "react-native";
import App from "./src";
import { name as appName } from "./app.json";
startNetworkLogging();
// LogBox.ignoreAllLogs();
import ZegoUIKitPrebuiltCallService from "@zegocloud/zego-uikit-prebuilt-call-rn";
import * as ZIM from "zego-zim-react-native";
import * as ZPNs from "zego-zpns-react-native";

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
