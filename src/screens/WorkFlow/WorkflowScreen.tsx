import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralStyle } from '../../theme/GeneralStyle';
import BackHeader from '../../components/BackHeader';
import { Colors } from '../../theme/Colors';
import { hp, commonFontStyle, wp } from '../../utils/responsiveFn/responsiveFn';

const WorkflowScreen = ({ route }: any) => {
  const { item } = route.params || {};

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={item?.title || 'Workflow'} />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Pipeline Key:</Text>
          <Text style={styles.value}>{item?.key}</Text>

          <Text style={[styles.label, { marginTop: hp(20) }]}>Statuses:</Text>
          <View style={styles.statusContainer}>
            {item?.statuses?.map((status: any) => (
              <View key={status.id} style={styles.statusBadge}>
                <Text style={styles.statusText}>{status.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkflowScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: wp(20),
  },
  card: {
    backgroundColor: Colors.white,
    padding: wp(20),
    borderRadius: wp(15),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    ...commonFontStyle(700, 2, Colors.secondary),
    marginBottom: hp(5),
  },
  value: {
    ...commonFontStyle(400, 1.8, Colors.gray_B9),
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(10),
  },
  statusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    marginRight: wp(10),
    marginBottom: hp(10),
  },
  statusText: {
    ...commonFontStyle(600, 1.4, Colors.secondary),
  },
});
