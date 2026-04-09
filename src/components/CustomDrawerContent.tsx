import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Colors} from '../theme/Colors';
import {wp, hp, commonFontStyle} from '../utils/responsiveFn/responsiveFn';
import {GeneralStyle} from '../theme/GeneralStyle';
import CustomImage from './CustomImage';
import {IMAGES} from '../assets/images';
import {useGetWorkflowsQuery} from '../redux/api/apiSlice';
import {SCREENS} from '../navigation/ScreensName';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const {navigation} = props;
  const {data} = useGetWorkflowsQuery({});
  const workflows = data?.data || [];

  const handleWorkflowClick = (item: any) => {
    navigation.navigate('WorkflowStack', {
      screen: SCREENS.WorkflowScreen,
      params: { item },
    });
  };

  const handleHomeClick = () => {
    navigation.navigate(SCREENS.HomeScreen);
  };

  return (
    <SafeAreaView style={[GeneralStyle.flex, {backgroundColor: Colors.white}]}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Menu</Text>
        <CustomImage
          source={IMAGES.close}
          size={wp(20)}
          onPress={() => navigation.closeDrawer()}
          containerStyle={styles.closeButton}
        />
      </View>

      <ScrollView style={styles.menuList}>
        {/* Home Item */}
        <TouchableOpacity style={styles.menuItem} onPress={handleHomeClick}>
          <Text style={styles.menuItemText}>Home</Text>
        </TouchableOpacity>

        {/* Workflow Titles */}
        {workflows.map((item: any, index: number) => (
          <TouchableOpacity
            key={item.id || index}
            style={styles.menuItem}
            onPress={() => handleWorkflowClick(item)}>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerTitle: {
    ...commonFontStyle(700, 2.5, Colors.black),
  },
  closeButton: {
    padding: wp(5),
  },
  menuList: {
    flex: 1,
    paddingTop: hp(10),
  },
  menuItem: {
    paddingVertical: hp(15),
    paddingHorizontal: wp(25),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f9f9f9',
  },
  menuItemText: {
    ...commonFontStyle(500, 1.8, Colors.black),
  },
});
