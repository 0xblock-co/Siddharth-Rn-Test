import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomDrawer from '../../components/CustomDrawer';
import CustomHeader from '../../components/CustomHeader';
import { Colors } from '../../theme/Colors';
import { GeneralStyle } from '../../theme/GeneralStyle';
import { hp, commonFontStyle } from '../../utils/responsiveFn/responsiveFn';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  return (
    <SafeAreaView style={GeneralStyle.container}>
      {/* Reusable Header Component */}
      <CustomHeader title="Home" onMenuPress={toggleDrawer} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Siddharth</Text>
        <Text style={styles.subtitle}>Tap the menu to see the drawer</Text>
      </View>

      {/* Reusable Drawer Component */}
      <CustomDrawer isVisible={isDrawerVisible} onClose={toggleDrawer} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    ...commonFontStyle(700, 3, Colors.black),
    marginBottom: hp(10),
  },
  subtitle: {
    ...commonFontStyle(400, 1.8, Colors.gray_B9),
  },
});
