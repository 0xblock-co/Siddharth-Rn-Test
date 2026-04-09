import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../theme/Colors';
import { wp, hp, commonFontStyle } from '../utils/responsiveFn/responsiveFn';
import { useGetUsersQuery } from '../redux/api/apiSlice';

interface UserSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (user: any) => void;
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({
  isVisible,
  onClose,
  onSelect,
}) => {
  const { data, isLoading } = useGetUsersQuery({}, { skip: !isVisible });
  const users = data?.data || [];

  const renderUserItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.firstname?.charAt(0) || 'U'}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Assign To</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator
            color={Colors.primary}
            size="large"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id.toString()}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No users found</Text>
            )}
          />
        )}
      </View>
    </Modal>
  );
};

export default UserSelectionModal;

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
    minHeight: hp(300),
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
  loader: {
    marginTop: hp(50),
  },
  listContent: {
    padding: wp(10),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(15),
    backgroundColor: '#fff',
    borderRadius: wp(10),
    marginBottom: hp(8),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(15),
  },
  avatarText: {
    ...commonFontStyle(700, 1.8, Colors.white),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...commonFontStyle(600, 1.6, Colors.black),
  },
  userEmail: {
    ...commonFontStyle(400, 1.3, Colors.gray_B9),
  },
  emptyText: {
    ...commonFontStyle(400, 1.6, Colors.gray_B9),
    textAlign: 'center',
    marginTop: hp(50),
  },
});
