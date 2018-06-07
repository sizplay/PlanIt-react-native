import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
// screens
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DrawerNav from './DrawerNav';

// drawer needs to wrap around any nav compoents that will open drawer
export default createSwitchNavigator(
  {
    SignIn: SignInScreen,
    Register: RegisterScreen,
    Main: DrawerNav
  },
  {
    initialRouteName: 'Main',
  }
);