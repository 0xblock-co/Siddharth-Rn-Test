import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '../theme/Colors';
import { navigationRef } from '../navigation/RootContainer';
import { SCREENS } from '../navigation/ScreensName';

const SplashScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      navigationRef.navigate(SCREENS.HomeScreen);
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
