import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../theme/Colors';
import { wp, hp, commonFontStyle } from '../utils/responsiveFn/responsiveFn';
import { Dropdown } from 'react-native-element-dropdown';

interface DynamicFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  fields: any[];
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
}

const DynamicFormModal: React.FC<DynamicFormModalProps> = ({
  isVisible,
  onClose,
  fields = [],
  onSubmit,
  isLoading = false,
}) => {
  const [formState, setFormState] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isVisible) {
      setFormState({});
      setErrors({});
    }
  }, [isVisible]);

  const handleInputChange = (key: string, value: any) => {
    setFormState({ ...formState, [key]: value });
    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: any = {};
    fields.forEach(field => {
      if (field.required && !formState[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePressSubmit = () => {
    if (validate()) {
      onSubmit(formState);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label} {field.required && '*'}
            </Text>
            <TextInput
              style={[styles.input, errors[field.key] && styles.inputError]}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor={Colors.gray_B9}
              value={formState[field.key]?.toString() || ''}
              onChangeText={text => handleInputChange(field.key, text)}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            />
            {errors[field.key] && (
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            )}
          </View>
        );
      case 'select':
        const options = field.options.map((opt: string) => ({
          label: opt,
          value: opt,
        }));
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label} {field.required && '*'}
            </Text>
            <Dropdown
              style={[styles.dropdown, errors[field.key] && styles.inputError]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={options}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={`Select ${field.label.toLowerCase()}`}
              value={formState[field.key]}
              onChange={item => handleInputChange(field.key, item.value)}
              dropdownPosition="auto"
            />
            {errors[field.key] && (
              <Text style={styles.errorText}>{errors[field.key]}</Text>
            )}
          </View>
        );
      default:
        return null;
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
      animationInTiming={700}
      animationOutTiming={700}
      avoidKeyboard
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Item</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          {fields.map(renderField)}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handlePressSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DynamicFormModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    maxHeight: hp(700),
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
  formContent: {
    padding: wp(20),
  },
  fieldContainer: {
    marginBottom: hp(20),
  },
  label: {
    ...commonFontStyle(600, 1.6, Colors.secondary),
    marginBottom: hp(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp(8),
    paddingHorizontal: wp(12),
    paddingVertical: hp(10),
    ...commonFontStyle(400, 1.6, Colors.black),
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: Colors.red || 'red',
  },
  errorText: {
    ...commonFontStyle(400, 1.2, Colors.red || 'red'),
    marginTop: hp(4),
  },
  dropdown: {
    height: hp(50),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp(8),
    paddingHorizontal: wp(12),
    backgroundColor: '#fafafa',
  },
  placeholderStyle: {
    ...commonFontStyle(400, 1.6, Colors.gray_B9),
  },
  selectedTextStyle: {
    ...commonFontStyle(400, 1.6, Colors.black),
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
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
