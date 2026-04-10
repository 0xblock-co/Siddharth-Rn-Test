import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../theme/Colors';
import { wp, hp, commonFontStyle } from '../utils/responsiveFn/responsiveFn';
import { useGetItemsQuery, useUpdateItemMutation } from '../redux/api/apiSlice';
import UserSelectionModal from './UserSelectionModal';

import EditValueModal from './EditValueModal';
import StatusSelectionModal from './StatusSelectionModal';
import { navigationRef } from '../navigation/RootContainer';
import { SCREENS } from '../navigation/ScreensName';

interface KanbanBoardProps {
  workflowId: string;
  fields: any[];
  statuses: any[];
  filterAssigneeId?: string;
}

const KanbanColumn = React.memo(({
  workflowId,
  fields,
  status,
  filterAssigneeId,
  onAssigneePress,
  onValuePress,
  onMovePress,
}: any) => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, isFetching } = useGetItemsQuery({
    workflowId,
    statusId: status.id,
    assignedToId: filterAssigneeId,
    page: page,
    limit: 5,
  });

  // Reset page and items when filter changes
  React.useEffect(() => {
    setPage(1);
    setAllItems([]);
  }, [filterAssigneeId, workflowId]);

  React.useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllItems(data.data);
      } else {
        // Only append if items aren't already there (avoid duplicates)
        setAllItems(prev => {
          const newItems = data.data.filter(
            (item: any) => !prev.find(p => p.id === item.id),
          );
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  const handleLoadMore = React.useCallback(() => {
    if (!isFetching && page < (data?.pagination?.totalPages || 0)) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, page, data?.pagination?.totalPages]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    setIsRefreshing(false);
  };

  const renderKanbanCard = ({ item }: any) => {
    const { data: cardData, assignedToUser, createdAt } = item;
    const formattedDate = new Date(createdAt).toLocaleDateString();

    // Dynamically find fields for display
    const titleField =
      fields?.length > 0
        ? fields.find((f: any) => f.key === 'name' || f.key === 'title') ||
          fields[0]
        : null;
    const valueField =
      fields?.length > 0
        ? fields.find((f: any) => f.key === 'value' || f.key === 'amount')
        : null;

    // Filter out title and value fields for the body, and limit to 2-3 fields
    const bodyFields =
      fields?.length > 0
        ? fields
            .filter(
              (f: any) =>
                f.key !== titleField?.key && f.key !== valueField?.key,
            )
            .slice(0, 3)
        : [];

    return (
      <TouchableOpacity
        onPress={() =>
          navigationRef.navigate(SCREENS.ItemDetailScreen, {
            itemId: item.id,
            itemTitle: titleField ? cardData?.[titleField.key] : 'Item Details',
          })
        }
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {(titleField && cardData?.[titleField.key]) || 'Untitled'}
          </Text>
          <View style={styles.headerRight}>
            {valueField && cardData?.[valueField.key] !== undefined && (
              <Text style={styles.cardValue}>
                {typeof cardData[valueField.key] === 'number'
                  ? `$${cardData[valueField.key].toLocaleString()}`
                  : cardData[valueField.key]}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => onMovePress(item)}
              style={styles.moveBtn}
            >
              <Text style={styles.moveIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBody}>
          {bodyFields.map((field: any, index: number) => (
            <View key={field.key || index} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{field.label}:</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {cardData?.[field.key]?.toString() || 'N/A'}
              </Text>
            </View>
          ))}
          {bodyFields.length === 0 && !valueField && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>#{item.id.slice(-6)}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.assigneeContainer}
            onPress={() => onAssigneePress(item)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {assignedToUser?.firstname?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text style={styles.assigneeName}>
              {assignedToUser?.firstname || 'Unassigned'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.cardDate}>{formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.columnContainer}>
      <View style={styles.columnHeader}>
        <Text style={styles.columnTitle}>{status.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {data?.pagination?.total || allItems.length}
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
          onEndReachedThreshold={0.1} // Trigger closer to the bottom
          initialNumToRender={5} // Only render initial limit
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No items found</Text>
          )}
          ListFooterComponent={() => {
            if (isFetching && page > 1) {
              return (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.footerText}>Loading more...</Text>
                </View>
              );
            }
            
            if (!isFetching && data?.pagination && allItems.length >= data.pagination.total && allItems.length > 0) {
               return (
                <View style={styles.footerLoader}>
                  <Text style={styles.footerText}>No more items</Text>
                </View>
              );
            }

            return <View style={{ height: hp(20) }} />;
          }}
        />
      )}
    </View>
  );
});

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workflowId,
  fields = [],
  statuses = [],
  filterAssigneeId,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isValueModalVisible, setValueModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();

  const handleAssigneePress = (item: any) => {
    setSelectedItem(item);
    setUserModalVisible(true);
  };

  const handleValuePress = (item: any) => {
    setSelectedItem(item);
    setValueModalVisible(true);
  };

  const handleMovePress = (item: any) => {
    setSelectedItem(item);
    setStatusModalVisible(true);
  };

  const handleUserSelect = async (user: any) => {
    if (selectedItem) {
      try {
        await updateItem({
          id: selectedItem.id,
          body: { assignedToId: user.id },
        }).unwrap();
        setUserModalVisible(false);
      } catch (error) {
        console.error('Failed to update assignee:', error);
      }
    }
  };

  const handleValueUpdate = async (newValue: number) => {
    if (selectedItem) {
      try {
        await updateItem({
          id: selectedItem.id,
          body: {
            statusId: selectedItem.statusId,
            assignedToId: selectedItem.assignedToId,
            data: {
              ...selectedItem.data,
              value: newValue,
            },
          },
        }).unwrap();
        setValueModalVisible(false);
      } catch (error) {
        console.error('Failed to update value:', error);
      }
    }
  };

  const handleStatusUpdate = async (status: any) => {
    if (selectedItem) {
      try {
        await updateItem({
          id: selectedItem.id,
          body: {
            statusId: status.id,
            assignedToId: selectedItem.assignedToId,
            data: selectedItem.data,
          },
        }).unwrap();
        setStatusModalVisible(false);
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanbanContainer}
      >
        {statuses.map((status: any, index: number) => (
          <KanbanColumn
            key={status.id || index}
            workflowId={workflowId}
            fields={fields}
            status={status}
            filterAssigneeId={filterAssigneeId}
            onAssigneePress={handleAssigneePress}
            onValuePress={handleValuePress}
            onMovePress={handleMovePress}
          />
        ))}
      </ScrollView>

      <UserSelectionModal
        isVisible={isUserModalVisible}
        onClose={() => setUserModalVisible(false)}
        onSelect={handleUserSelect}
      />

      <EditValueModal
        isVisible={isValueModalVisible}
        onClose={() => setValueModalVisible(false)}
        initialValue={selectedItem?.data?.value}
        onSubmit={handleValueUpdate}
        isLoading={isUpdating}
      />

      <StatusSelectionModal
        isVisible={isStatusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        statuses={statuses}
        onSelect={handleStatusUpdate}
        currentStatusId={selectedItem?.statusId}
      />
    </View>
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
    alignItems: 'center',
    marginBottom: hp(10),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(8),
  },
  valueBadge: {
    backgroundColor: '#fff9e6',
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: '#efd362f8',
  },
  cardTitle: {
    ...commonFontStyle(700, 1.8, Colors.black),
    flex: 1,
    marginRight: wp(10),
  },
  cardValue: {
    ...commonFontStyle(700, 1.4, Colors.primary),
    bottom: 3,
  },
  moveBtn: {
    paddingHorizontal: wp(4),
  },
  moveIcon: {
    fontSize: wp(20),
    color: Colors.gray_B9,
    fontWeight: '700',
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
    width: wp(100),
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
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(15),
    gap: wp(8),
  },
  footerText: {
    ...commonFontStyle(500, 1.4, Colors.gray_B9),
  },
});
