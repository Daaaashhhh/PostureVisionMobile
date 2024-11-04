/**
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import Navigation from './navigation/Navigation'; // Import your separate navigation component

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </NavigationContainer>
  );
}

export default App;
