import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
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
import CustomImage from '../../components/CustomImage';
import { IMAGES } from '../../assets/images';

const WorkflowScreen = ({ route }: any) => {
  const { item: initialItem } = route.params || {};
  const [isModalVisible, setModalVisible] = useState(false);

  const { data, isLoading } = useGetWorkflowByIdQuery({ id: initialItem?.id });
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();

  const workflowData = data?.data || initialItem;

  const handleCreateItem = async (formData: any) => {
    try {
      await createItem({
        workflowId: workflowData.id,
        statusId: workflowData.statuses[0]?.id, // Default to first status
        assignedToId: '1', // Mock assigned user
        data: formData,
      }).unwrap();

      setModalVisible(false);
      // KanbanColumn will handle the refresh if we use a tag or if we manually trigger it.
      // Since it's RTK Query, we should use tags for automatic refresh.
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={workflowData?.title || 'Workflow'} />

      {isLoading ? (
        <Loader />
      ) : (
        <View style={GeneralStyle.flex}>
          <KanbanBoard
            workflowId={workflowData?.id}
            statuses={workflowData?.statuses}
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
        fields={workflowData?.fields || []}
        onSubmit={handleCreateItem}
        isLoading={isCreating}
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
});
