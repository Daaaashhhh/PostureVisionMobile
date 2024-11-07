// ThemeContext.js
import React, {createContext, useContext} from 'react';
import {StyleSheet, Text} from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'HubotSans', // Use your font family name here
    },
  });

  return (
    <ThemeContext.Provider value={styles}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
