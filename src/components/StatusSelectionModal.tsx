import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../theme/Colors';
import {wp, hp, commonFontStyle} from '../utils/responsiveFn/responsiveFn';

interface StatusSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  statuses: any[];
  onSelect: (status: any) => void;
  currentStatusId?: string;
}

const StatusSelectionModal: React.FC<StatusSelectionModalProps> = ({
  isVisible,
  onClose,
  statuses = [],
  onSelect,
  currentStatusId,
}) => {
  const renderStatusItem = ({item}: any) => {
    const isSelected = item.id === currentStatusId;
    return (
      <TouchableOpacity
        style={[styles.statusItem, isSelected && styles.selectedItem]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}>
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.statusTitle, isSelected && styles.selectedText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Move To Status</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={statuses}
          keyExtractor={item => item.id.toString()}
          renderItem={renderStatusItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No statuses available</Text>
          )}
        />
      </View>
    </Modal>
  );
};

export default StatusSelectionModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    maxHeight: hp(500),
    paddingBottom: hp(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingVertical: hp(20),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    ...commonFontStyle(700, 2.2, Colors.black),
  },
  closeIcon: {
    fontSize: wp(20),
    color: Colors.gray_B9,
  },
  listContent: {
    padding: wp(10),
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(18),
    backgroundColor: '#fff',
    borderRadius: wp(10),
    marginBottom: hp(8),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedItem: {
    borderColor: Colors.primary,
    backgroundColor: '#fff9e6',
  },
  radioOuter: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(15),
  },
  radioInner: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: Colors.primary,
  },
  statusTitle: {
    ...commonFontStyle(600, 1.8, Colors.black),
  },
  selectedText: {
    color: Colors.primary,
  },
  emptyText: {
    ...commonFontStyle(400, 1.6, Colors.gray_B9),
    textAlign: 'center',
    marginTop: hp(50),
  },
});
