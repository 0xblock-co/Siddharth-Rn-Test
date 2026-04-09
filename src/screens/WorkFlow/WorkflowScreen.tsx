import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralStyle } from '../../theme/GeneralStyle';
import BackHeader from '../../components/BackHeader';
import KanbanBoard from '../../components/KanbanBoard';
import { useGetWorkflowByIdQuery } from '../../redux/api/apiSlice';
import Loader from '../../components/Loader';

const WorkflowScreen = ({ route }: any) => {
  const { item: initialItem } = route.params || {};
  const { data, isLoading } = useGetWorkflowByIdQuery({ id: initialItem?.id });
  const workflowData = data?.data || initialItem;

  return (
    <SafeAreaView style={GeneralStyle.container}>
      <BackHeader title={workflowData?.title || 'Workflow'} />

      {isLoading ? (
        <Loader />
      ) : (
        <KanbanBoard
          workflowId={initialItem?.id}
          statuses={workflowData?.statuses}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkflowScreen;
