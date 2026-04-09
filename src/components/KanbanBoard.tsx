import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme/Colors';
import { hp, commonFontStyle, wp } from '../utils/responsiveFn/responsiveFn';
import { useGetItemsQuery } from '../redux/api/apiSlice';

interface KanbanBoardProps {
  workflowId: string;
  statuses: any[];
}

const renderKanbanCard = ({ item }: any) => {
  const { data: cardData, assignedToUser, createdAt } = item;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{cardData?.name}</Text>
        {cardData?.value && (
          <Text style={styles.cardValue}>
            ${cardData.value.toLocaleString()}
          </Text>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Contact:</Text>
          <Text style={styles.infoValue}>
            {cardData?.contactPerson || cardData?.role || 'N/A'}
          </Text>
        </View>

        {cardData?.source && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Source:</Text>
            <Text style={styles.infoValue}>{cardData.source}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.assigneeContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {assignedToUser?.firstname?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.assigneeName}>
            {assignedToUser?.firstname || 'Unassigned'}
          </Text>
        </View>
        <Text style={styles.cardDate}>{formattedDate}</Text>
      </View>
    </View>
  );
};

const KanbanColumn = ({ workflowId, status }: any) => {
  const [page, setPage] = React.useState(1);
  const [allItems, setAllItems] = React.useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const { data, isLoading, isFetching } = useGetItemsQuery({
    workflowId,
    statusId: status.id,
    page: page,
    limit: 10,
  });

  React.useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllItems(data.data);
      } else {
        setAllItems(prev => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (!isFetching && data?.pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    // The query will automatically re-run due to page change or we could use refetch()
    setIsRefreshing(false);
  };

  return (
    <View style={styles.columnContainer}>
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{status.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {data?.pagination?.totalItems || allItems.length}
          </Text>
        </View>
      </View>

      {isLoading && page === 1 ? (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginTop: hp(20) }}
        />
      ) : (
        <FlatList
          data={allItems}
          keyExtractor={(card, index) =>
            card.id?.toString() || index.toString()
          }
          renderItem={renderKanbanCard}
          contentContainerStyle={styles.columnList}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No items found</Text>
          )}
          ListFooterComponent={() =>
            isFetching && page > 1 ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginVertical: hp(10) }}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workflowId,
  statuses = [],
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.kanbanContainer}
    >
      {statuses?.map((status: any) => (
        <KanbanColumn key={status.id} workflowId={workflowId} status={status} />
      ))}
    </ScrollView>
  );
};

export default KanbanBoard;

const styles = StyleSheet.create({
  kanbanContainer: {
    padding: wp(10),
  },
  columnContainer: {
    width: wp(280),
    backgroundColor: '#f4f4f4',
    marginHorizontal: wp(10),
    borderRadius: wp(15),
    padding: wp(10),
    height: '100%',
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: hp(15),
    paddingHorizontal: wp(5),
  },
  columnTitle: {
    ...commonFontStyle(700, 2, Colors.secondary),
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: wp(10),
  },
  badgeText: {
    ...commonFontStyle(600, 1.4, Colors.secondary),
  },
  columnList: {
    paddingBottom: hp(20),
  },
  card: {
    backgroundColor: Colors.white,
    padding: wp(12),
    borderRadius: wp(12),
    marginBottom: hp(12),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(8),
  },
  cardTitle: {
    ...commonFontStyle(700, 1.8, Colors.black),
    flex: 1,
    marginRight: wp(5),
  },
  cardValue: {
    ...commonFontStyle(700, 1.6, Colors.primary),
  },
  cardBody: {
    marginBottom: hp(10),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: hp(2),
  },
  infoLabel: {
    ...commonFontStyle(400, 1.4, Colors.gray_B9),
    width: wp(60),
  },
  infoValue: {
    ...commonFontStyle(500, 1.4, Colors.secondary),
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(8),
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(6),
  },
  avatarText: {
    ...commonFontStyle(700, 1.1, Colors.white),
  },
  assigneeName: {
    ...commonFontStyle(500, 1.3, Colors.black),
  },
  cardDate: {
    ...commonFontStyle(400, 1.2, Colors.gray_B9),
  },
  emptyText: {
    ...commonFontStyle(400, 1.6, Colors.gray_B9),
    textAlign: 'center',
    marginTop: hp(20),
  },
});
