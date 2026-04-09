import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {Colors} from '../theme/Colors';
import {wp, hp, commonFontStyle} from '../utils/responsiveFn/responsiveFn';

interface EditValueModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialValue: number | string;
  onSubmit: (newValue: number) => void;
  isLoading?: boolean;
}

const EditValueModal: React.FC<EditValueModalProps> = ({
  isVisible,
  onClose,
  initialValue,
  onSubmit,
  isLoading = false,
}) => {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (isVisible) {
      setValue(initialValue?.toString() || '');
    }
  }, [isVisible, initialValue]);

  const handlePressSubmit = () => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSubmit(numValue);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      avoidKeyboard>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Update Deal Value</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Deal Value ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new value"
            placeholderTextColor={Colors.gray_B9}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            autoFocus
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handlePressSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditValueModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    paddingBottom: hp(30),
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
  content: {
    padding: wp(20),
  },
  label: {
    ...commonFontStyle(600, 1.6, Colors.secondary),
    marginBottom: hp(10),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp(10),
    paddingHorizontal: wp(15),
    paddingVertical: hp(12),
    ...commonFontStyle(500, 1.8, Colors.black),
    backgroundColor: '#fafafa',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp(20),
    gap: wp(12),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: hp(14),
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: wp(10),
  },
  cancelText: {
    ...commonFontStyle(600, 1.6, Colors.black),
  },
  submitButton: {
    flex: 2,
    paddingVertical: hp(14),
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: wp(10),
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitText: {
    ...commonFontStyle(600, 1.6, Colors.white),
  },
});
