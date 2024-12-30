import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

export const getItem = async (key) => {
  try {
    return JSON.parse(await AsyncStorage.getItem(key));
  } catch (e) {}
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {}
};
