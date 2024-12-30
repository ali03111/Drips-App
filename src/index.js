/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// import "react-native-gesture-handler";

import React from "react";
import MainNavigation from "./navigation/MainNavigation";
// import ZegoNavigation from "./navigation/Navigation";
import { Provider } from "react-redux";
import store from "./store";
import Loader from "./components/atoms/Loader";
// import { LogBox } from 'react-native';

// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  // const loader = store.getState().AppReducer.loader;
  return (
    <Provider store={store}>
      <>
        <MainNavigation />
        <Loader />
      </>
    </Provider>
  );
};

export default App;
