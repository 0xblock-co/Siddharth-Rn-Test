import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import React, { FC } from 'react';
import StackNavigator from './StackNavigator';
import { Colors } from '../theme/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GeneralStyle } from '../theme/GeneralStyle';

export const navigationRef = createNavigationContainerRef<any>();

const RootContainer: FC = () => {
  return (
    <SafeAreaProvider style={GeneralStyle.flex}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootContainer;
