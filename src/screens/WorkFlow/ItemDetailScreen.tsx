import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralStyle } from '../../theme/GeneralStyle';
import BackHeader from '../../components/BackHeader';
import {
  useGetItemByIdQuery,
  useUpdateItemMutation,
  useGetWorkflowByIdQuery,
  useDeleteItemMutation,
} from '../../redux/api/apiSlice';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/Colors';
import { wp, hp, commonFontStyle } from '../../utils/responsiveFn/responsiveFn';
import UserSelectionModal from '../../components/UserSelectionModal';
import StatusSelectionModal from '../../components/StatusSelectionModal';
import DynamicFormModal from '../../components/DynamicFormModal';

const ItemDetailScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { itemId, itemTitle } = route.params || {};
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const { data, isLoading } = useGetItemByIdQuery({ id: itemId });
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  const item = data?.data;
  const itemName =
    item?.data?.name || item?.data?.companyName || item?.data?.role;
  const headerTitle = itemName || itemTitle || 'Item Details';

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

  const handleDataUpdate = async (updatedData: any) => {
    try {
      await updateItem({
        id: itemId,
        body: {
          statusId: item.statusId,
          assignedToId: item.assignedToId,
          data: updatedData,
        },
      }).unwrap();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Failed to update item data:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem({ id: itemId }).unwrap();
              navigation.goBack();
            } catch (error) {
              console.error('Failed to delete item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          },
        },
      ],
    );
  };

  const renderDetailRow = (
    key: string,
    label: string,
    value: any,
    onPress?: () => void,
    isClickable?: boolean,
  ) => (
    <TouchableOpacity
      key={key}
      style={styles.detailRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.detailValue}>{value || 'N/A'}</Text>
        {isClickable && <Text style={styles.smallEdit}>Edit</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={headerTitle} />

      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                <Text style={styles.editLink}>Edit Info</Text>
              </TouchableOpacity>
            </View>
            {(workflowData?.data?.fields || []).map((field: any) => {
              let value = item?.data?.[field.key];
              if (field.key === 'value' && typeof value === 'number') {
                value = `$${value.toLocaleString()}`;
              }
              return renderDetailRow(field.key, field.label, value, undefined, false);
            })}
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={() => setUserModalVisible(true)}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  paddingBottom: hp(8),
                },
              ]}
            >
              Assignee Details
            </Text>
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
            <Text
              style={[
                styles.sectionTitle,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  paddingBottom: hp(8),
                },
              ]}
            >
              Workflow Status
            </Text>
            {renderDetailRow('workflowKey', 'Workflow Key', item?.workflowKey)}
            {renderDetailRow(
              'status',
              'Status',
              item?.statusKey?.replace('_', ' ').toUpperCase(),
              () => setStatusModalVisible(true),
              true,
            )}
            {renderDetailRow(
              'createdAt',
              'Created At',
              new Date(item?.createdAt).toLocaleString(),
            )}
            {renderDetailRow(
              'updatedAt',
              'Last Updated',
              new Date(item?.updatedAt).toLocaleString(),
            )}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Text style={styles.deleteText}>
              {isDeleting ? 'Deleting...' : 'Delete Item'}
            </Text>
          </TouchableOpacity>
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

      <DynamicFormModal
        isVisible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        fields={workflowData?.data?.fields || []}
        initialValues={item?.data || {}}
        onSubmit={handleDataUpdate}
        isLoading={isUpdating}
        title="Edit Item Details"
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

    marginBottom: hp(8),
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  editLink: {
    ...commonFontStyle(600, 1.4, Colors.primary),
    textDecorationLine: 'underline',
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
  deleteButton: {
    marginTop: hp(20),
    marginBottom: hp(40),
    paddingVertical: hp(15),
    backgroundColor: '#fff1f0',
    borderRadius: wp(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffa39e',
  },
  deleteText: {
    ...commonFontStyle(600, 1.6, '#f5222d'),
  },
});
