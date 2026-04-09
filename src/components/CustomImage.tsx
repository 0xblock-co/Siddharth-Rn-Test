import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { FSize, getFontSize } from '../utils/responsiveFn/responsiveFn';

interface Props {
  onPress?: () => void;
  source?: any;
  size?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  tintColor?: any | undefined;
  uri?: string;
  disabled?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  isBackGround?: boolean;
  bgColor?: string;
  viewRef?: any;
}

const CustomImage = ({
  onPress,
  source,
  size,
  containerStyle,
  imageStyle,
  tintColor = undefined,
  uri,
  disabled = false,
  resizeMode = 'contain',
  isBackGround = false,
  bgColor,
  viewRef,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      ref={viewRef}
      disabled={onPress ? disabled : true}
      style={{
        ...containerStyle,

        ...(isBackGround ? styles.btnContainer : {}),

        ...(bgColor ? { backgroundColor: bgColor } : {}),
      }}
    >
      <FastImage
        source={uri ? { uri: uri } : source}
        defaultSource={source ? source : undefined}
        style={[{ width: size, height: size }, imageStyle]}
        resizeMode={resizeMode}
        tintColor={uri ? undefined : tintColor}
        {...rest}
      />
    </TouchableOpacity>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  btnContainer: {
    height: getFontSize(FSize.f15),
    width: getFontSize(FSize.f15),
    borderRadius: 50,
    // backgroundColor: Colors._33854F,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
