import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import { Colors } from '../../theme/Colors';
import { GeneralStyle } from '../../theme/GeneralStyle';
import { hp, commonFontStyle } from '../../utils/responsiveFn/responsiveFn';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetWorkflowsQuery } from '../../redux/api/apiSlice';
import Loader from '../../components/Loader';

const HomeScreen = () => {
  const { data, isLoading } = useGetWorkflowsQuery({});

  return (
    <SafeAreaView style={GeneralStyle.container}>
      {/* Header with integrated Drawer */}
      <CustomHeader title="Home" workflows={data?.data} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome</Text>
      </View>

      {isLoading && <Loader />}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    ...commonFontStyle(700, 3, Colors.black),
    marginBottom: hp(10),
  },
});
