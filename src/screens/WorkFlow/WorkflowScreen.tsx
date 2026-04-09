import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralStyle } from '../../theme/GeneralStyle';
import BackHeader from '../../components/BackHeader';
import KanbanBoard from '../../components/KanbanBoard';
import DynamicFormModal from '../../components/DynamicFormModal';
import {
  useGetWorkflowByIdQuery,
  useCreateItemMutation,
} from '../../redux/api/apiSlice';
import Loader from '../../components/Loader';
import { Colors } from '../../theme/Colors';
import { wp, hp, commonFontStyle } from '../../utils/responsiveFn/responsiveFn';
import { IMAGES } from '../../assets/images';
import UserSelectionModal from '../../components/UserSelectionModal';
import StatusSelectionModal from '../../components/StatusSelectionModal';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import CustomImage from '../../components/CustomImage';

const EMPTY_ARRAY: any[] = [];

const WorkflowScreen = ({ route }: any) => {
  const { item: initialItem } = route.params || {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUserFilterVisible, setUserFilterVisible] = useState(false);
  const [isStatusFilterVisible, setStatusFilterVisible] = useState(false);

  const [filterAssignee, setFilterAssignee] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  const { data, isLoading } = useGetWorkflowByIdQuery({ id: initialItem?.id });
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();

  const workflowData = data?.data || initialItem;
  const fields = workflowData?.fields || EMPTY_ARRAY;

  const handleCreateItem = async (formData: any) => {
    try {
      await createItem({
        workflowId: workflowData.id,
        statusId: workflowData.statuses[0]?.id, // Default to first status
        assignedToId: '1', // Mock assigned user
        data: formData,
      }).unwrap();

      setModalVisible(false);
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const renderFilterBar = () => {
    return (
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, filterAssignee && styles.activeChip]}
            onPress={() => setUserFilterVisible(true)}
          >
            <Text
              style={[
                styles.filterText,
                filterAssignee && styles.activeFilterText,
              ]}
            >
              {filterAssignee
                ? `Owner: ${filterAssignee.firstname}`
                : 'Filter by Owner'}
            </Text>
            {filterAssignee && (
              <TouchableOpacity onPress={() => setFilterAssignee(null)}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterStatus && styles.activeChip]}
            onPress={() => setStatusFilterVisible(true)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus && styles.activeFilterText,
              ]}
            >
              {filterStatus
                ? `Status: ${filterStatus.title}`
                : 'Filter by Status'}
            </Text>
            {filterStatus && (
              <TouchableOpacity onPress={() => setFilterStatus(null)}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={workflowData?.title || 'Workflow'} />
      {renderFilterBar()}

      {isLoading ? (
        <Loader />
      ) : (
        <View style={GeneralStyle.flex}>
          <KanbanBoard
            workflowId={workflowData?.id}
            statuses={
              filterStatus
                ? workflowData?.statuses?.filter(
                    (s: any) => s.id === filterStatus.id,
                  )
                : workflowData?.statuses
            }
            filterAssigneeId={filterAssignee?.id}
          />

          <CustomImage
            source={IMAGES.plus}
            containerStyle={styles.fab}
            onPress={() => setModalVisible(true)}
            size={wp(20)}
          />
        </View>
      )}

      <DynamicFormModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        fields={fields}
        onSubmit={handleCreateItem}
        isLoading={isCreating}
      />

      <UserSelectionModal
        isVisible={isUserFilterVisible}
        onClose={() => setUserFilterVisible(false)}
        onSelect={user => {
          setFilterAssignee(user);
          setUserFilterVisible(false);
        }}
      />

      <StatusSelectionModal
        isVisible={isStatusFilterVisible}
        onClose={() => setStatusFilterVisible(false)}
        statuses={workflowData?.statuses || []}
        onSelect={status => {
          setFilterStatus(status);
          setStatusFilterVisible(false);
        }}
        currentStatusId={filterStatus?.id}
      />
    </SafeAreaView>
  );
};

export default WorkflowScreen;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: hp(30),
    right: wp(20),
    width: wp(56),
    height: wp(56),
    borderRadius: wp(28),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    ...commonFontStyle(400, 3, Colors.white),
  },
  filterBar: {
    paddingVertical: hp(10),
    paddingHorizontal: wp(10),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: wp(12),
    paddingVertical: hp(6),
    borderRadius: wp(20),
    marginRight: wp(10),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeChip: {
    backgroundColor: '#e6f7ff',
    borderColor: Colors.primary,
  },
  filterText: {
    ...commonFontStyle(500, 1.4, Colors.gray_B9),
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  clearIcon: {
    marginLeft: wp(6),
    fontSize: wp(14),
    color: Colors.primary,
    fontWeight: '700',
  },
});
