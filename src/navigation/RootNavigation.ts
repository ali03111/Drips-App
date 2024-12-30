import { CommonActions, createNavigationContainerRef, DrawerActions, StackActions } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef()

export function navigate(name: never, params = {} as never) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function onBack() {
  navigationRef.current?.goBack();
}

export function replace(name: string, params?: object) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}

export function reset(name: string) {
  navigationRef.current?.dispatch( CommonActions.reset({
    index: 0,
    routes: [ { name } ]
  }) );
}

export function toggleDrawer() {
  navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
}