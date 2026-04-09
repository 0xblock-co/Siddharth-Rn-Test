import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CustomDrawerContent from '../components/CustomDrawerContent';
import {wp} from '../utils/responsiveFn/responsiveFn';
import HomeScreen from '../screens/Home/HomeScreen';
import WorkflowScreen from '../screens/WorkFlow/WorkflowScreen';
import ItemDetailScreen from '../screens/WorkFlow/ItemDetailScreen';
import {SCREENS} from './ScreensName';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const WorkflowStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREENS.WorkflowScreen} component={WorkflowScreen} />
      <Stack.Screen
        name={SCREENS.ItemDetailScreen}
        component={ItemDetailScreen}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
        drawerStyle: {
          width: wp(300),
        },
      }}
      initialRouteName={SCREENS.HomeScreen}>
      <Drawer.Screen name={SCREENS.HomeScreen} component={HomeScreen} />
      <Drawer.Screen name="WorkflowStack" component={WorkflowStack} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
