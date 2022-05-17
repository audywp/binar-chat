import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../helpers/navigation';
import MainStack from './MainStack';
import {Main} from '../helpers/color';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    primary: Main.turquoise,
    text: Main.darkIndigo,
  },
};

export default function Root() {
  return (
    <NavigationContainer theme={MyTheme} ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
}
