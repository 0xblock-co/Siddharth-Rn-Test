import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { Colors } from '../theme/Colors';
import { GeneralStyle } from '../theme/GeneralStyle';
import {
  wp,
  hp,
  commonFontStyle,
  SCREEN_WIDTH,
} from '../utils/responsiveFn/responsiveFn';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomImage from './CustomImage';
import { IMAGES } from '../assets/images';

import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '../navigation/ScreensName';

interface CustomDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  workflows?: any[];
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  isVisible,
  onClose,
  workflows = [],
}) => {
  const navigation = useNavigation<any>();

  const handleWorkflowClick = (item: any) => {
    onClose();
    navigation.navigate(SCREENS.WorkflowScreen, { item });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      animationInTiming={600}
      animationOutTiming={1000}
      swipeDirection="left"
      onSwipeComplete={onClose}
      backdropOpacity={0.5}
      style={styles.modalStyle}
    >
      <View style={styles.drawerContainer}>
        <SafeAreaView style={GeneralStyle.flex}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <CustomImage
              source={IMAGES.close}
              size={wp(20)}
              onPress={onClose}
              containerStyle={styles.closeButton}
            />
          </View>

          <ScrollView style={styles.menuList}>
            {/* Home Item */}
            <TouchableOpacity style={styles.menuItem} onPress={onClose}>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            {/* Workflow Titles */}
            {workflows &&
              workflows.length > 0 &&
              workflows.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.menuItem}
                  onPress={() => handleWorkflowClick(item)}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: SCREEN_WIDTH * 0.75,
    height: '100%',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerHeader: {
    height: hp(100),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    paddingTop: hp(20),
  },
  drawerTitle: {
    ...commonFontStyle(700, 3, Colors.secondary),
  },
  closeButton: {
    padding: wp(10),
  },
  closeButtonText: {
    fontSize: wp(20),
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  menuList: {
    paddingTop: hp(20),
  },
  menuItem: {
    paddingVertical: hp(15),
    paddingHorizontal: wp(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    ...commonFontStyle(500, 2, Colors.secondary),
  },
});
