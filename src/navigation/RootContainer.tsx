import React, { FC } from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';
import { Colors } from '../theme/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GeneralStyle } from '../theme/GeneralStyle';

export const navigationRef = createNavigationContainerRef<any>();

const RootContainer: FC = () => {
  return (
    <SafeAreaProvider style={GeneralStyle.flex}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RootContainer;
