import React from "react";
import { THEME } from "./constants";

export const ThemeContext = React.createContext({
    theme: {},
    setTheme: () => {}
});