import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/Colors';
import { wp, hp, commonFontStyle } from '../utils/responsiveFn/responsiveFn';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <View style={styles.hamburgerLine} />
        <View style={[styles.hamburgerLine, { width: wp(15) }]} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: wp(30) }} />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: hp(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray_B9,
    paddingHorizontal: wp(20),
  },
  headerTitle: {
    ...commonFontStyle(700, 2.5, Colors.black),
  },
  menuButton: {
    width: wp(40),
    height: wp(40),
    justifyContent: 'center',
    paddingLeft: wp(5),
  },
  hamburgerLine: {
    width: wp(25),
    height: 2,
    backgroundColor: Colors.black,
    marginVertical: 2,
    borderRadius: 2,
  },
});
