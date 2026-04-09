import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREENS } from './ScreensName';
import SplashScreen from '../screens/SplashScreen';
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator<any>();

const StackNavigator: FC = () => {
  let screens = [
    { name: SCREENS.Splash, component: SplashScreen },
    { name: SCREENS.Drawer, component: DrawerNavigator },
  ];
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.Splash}
    >
      {screens.map((item: any, index: any) => {
        return (
          <Stack.Screen
            name={item.name}
            key={index.toString()}
            component={item.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};
export default StackNavigator;
