import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralStyle } from '../../theme/GeneralStyle';
import BackHeader from '../../components/BackHeader';
import {
  useGetItemByIdQuery,
  useUpdateItemMutation,
  useGetWorkflowByIdQuery,
} from '../../redux/api/apiSlice';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/Colors';
import { wp, hp, commonFontStyle } from '../../utils/responsiveFn/responsiveFn';
import UserSelectionModal from '../../components/UserSelectionModal';
import StatusSelectionModal from '../../components/StatusSelectionModal';

const ItemDetailScreen = ({ route }: any) => {
  const { itemId, itemTitle } = route.params || {};
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);

  const { data, isLoading } = useGetItemByIdQuery({ id: itemId });
  const [updateItem] = useUpdateItemMutation();

  const item = data?.data;

  // Fetch workflow to get all available statuses
  const { data: workflowData } = useGetWorkflowByIdQuery(
    { id: item?.workflowId },
    { skip: !item?.workflowId },
  );

  const handleAssigneeUpdate = async (user: any) => {
    try {
      await updateItem({
        id: itemId,
        body: { assignedToId: user.id },
      }).unwrap();
    } catch (error) {
      console.error('Failed to update assignee:', error);
    }
  };

  const handleStatusUpdate = async (status: any) => {
    try {
      await updateItem({
        id: itemId,
        body: {
          statusId: status.id,
          assignedToId: item.assignedToId,
          data: item.data,
        },
      }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderDetailRow = (
    label: string,
    value: any,
    onPress?: () => void,
    isClickable?: boolean,
  ) => (
    <TouchableOpacity
      style={styles.detailRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.detailValue}>{value || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={itemTitle || 'Item Details'} />

      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {renderDetailRow('Name', item?.data?.name)}
            {renderDetailRow(
              'Deal Value',
              item?.data?.value
                ? `$${item.data.value.toLocaleString()}`
                : 'N/A',
            )}
            {renderDetailRow('Source', item?.data?.source)}
            {renderDetailRow('Contact Person', item?.data?.contactPerson)}
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={() => setUserModalVisible(true)}
          >
            <Text style={styles.sectionTitle}>Assignee Details</Text>
            <View style={styles.assigneeInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item?.assignedToUser?.firstname?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.assigneeName}>
                  {item?.assignedToUser?.firstname}{' '}
                  {item?.assignedToUser?.lastname}
                </Text>
                <Text style={styles.assigneeEmail}>
                  {item?.assignedToUser?.email}
                </Text>
              </View>
              <Text style={styles.editLabel}>Change</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Workflow Status</Text>
            {renderDetailRow('Workflow Key', item?.workflowKey)}
            {renderDetailRow(
              'Status',
              item?.statusKey?.replace('_', ' ').toUpperCase(),
              () => setStatusModalVisible(true),
              true,
            )}
            {renderDetailRow(
              'Created At',
              new Date(item?.createdAt).toLocaleString(),
            )}
            {renderDetailRow(
              'Last Updated',
              new Date(item?.updatedAt).toLocaleString(),
            )}
          </View>
        </ScrollView>
      )}

      <UserSelectionModal
        isVisible={isUserModalVisible}
        onClose={() => setUserModalVisible(false)}
        onSelect={handleAssigneeUpdate}
      />

      <StatusSelectionModal
        isVisible={isStatusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        statuses={workflowData?.data?.statuses || []}
        onSelect={handleStatusUpdate}
        currentStatusId={item?.statusId}
      />
    </SafeAreaView>
  );
};

export default ItemDetailScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: wp(20),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(15),
    padding: wp(20),
    marginBottom: hp(20),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    ...commonFontStyle(700, 2, Colors.primary),
    marginBottom: hp(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: hp(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(12),
    paddingVertical: hp(4),
  },
  detailLabel: {
    ...commonFontStyle(500, 1.6, Colors.gray_B9),
    flex: 1,
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  detailValue: {
    ...commonFontStyle(600, 1.6, Colors.black),
    textAlign: 'right',
  },
  smallEdit: {
    ...commonFontStyle(600, 1.2, Colors.primary),
    marginLeft: wp(8),
    textDecorationLine: 'underline',
  },
  assigneeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(15),
  },
  avatarText: {
    ...commonFontStyle(700, 2.2, Colors.white),
  },
  assigneeName: {
    ...commonFontStyle(700, 1.8, Colors.black),
  },
  assigneeEmail: {
    ...commonFontStyle(400, 1.4, Colors.gray_B9),
  },
  flex1: {
    flex: 1,
  },
  editLabel: {
    ...commonFontStyle(600, 1.4, Colors.primary),
    textDecorationLine: 'underline',
  },
});
