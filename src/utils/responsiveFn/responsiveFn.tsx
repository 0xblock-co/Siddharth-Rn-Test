/* eslint-disable eqeqeq */
import React from 'react';
import {
  StatusBar,
  PixelRatio,
  Dimensions,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TextStyle,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export function getFontType(fontWeight: any) {
  if (fontWeight == 600) {
    return 'Geist-SemiBold';
  } else if (fontWeight == 400) {
    return 'Geist-Regular';
  } else if (fontWeight == 700) {
    return 'Geist-Bold';
  } else if (fontWeight == 800) {
    return 'Geist-Black';
  } else if (fontWeight == 500) {
    return 'Geist-Medium';
  } else if (fontWeight == 300) {
    return 'Geist-Light';
  } else {
    return 'Geist-Regular';
  }
}

const { height, width } = Dimensions.get('window');

export const SCREEN_HEIGHT = height;

export const SCREEN_WIDTH = width;

export function isIphoneX() {
  return Platform.OS === 'ios' && DeviceInfo.hasNotch();
}

export function getHeight(h: string | number) {
  const elemHeight = parseFloat(h.toString());
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
}

export function getWidth(w: string | number) {
  const elemWidth = parseFloat(w.toString());
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
}

export const hp = (i: any) => {
  return widthPercentageToDP((i * 100) / SCREEN_WIDTH);
};

export const wp = (i: any) => {
  return heightPercentageToDP((i * 100) / SCREEN_HEIGHT);
};

export function getFontSize(font: number) {
  const deviceHeight = isIphoneX()
    ? height * 0.9
    : Platform.OS === 'android'
    ? height - (StatusBar.currentHeight || 0)
    : height;
  const deviceHeightPercent = (font * deviceHeight) / 100;
  return Math.round(deviceHeightPercent);
}

export const useForceUpdate = () => {
  const [, updateState] = React.useState<undefined>();
  return React.useCallback(() => updateState(undefined), []);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric', // "short" for abbreviated months (e.g., JAN)
    })
    .toUpperCase(); // Convert to uppercase for consistency
};

export const onScroll = (
  e: NativeSyntheticEvent<NativeScrollEvent>,
  setShowFade: (showFade: boolean) => void,
) => {
  const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
  if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 1) {
    setShowFade(false);
  } else {
    setShowFade(true);
  }
};

export const commonFontStyle = (
  fontWeight: any,
  fontSize: any,
  color: any,
): TextStyle => {
  return {
    fontFamily: getFontType(fontWeight),
    fontSize: getFontSize(fontSize),
    color: color,
  };
};

export const FSize = {
  // font sizes
  f1: getFontSize(0.1),
  f2: getFontSize(0.2),
  f3: getFontSize(0.3),
  f4: getFontSize(0.5),
  f5: getFontSize(0.6),
  f6: getFontSize(0.7),
  f7: getFontSize(0.9),
  f8: getFontSize(1),
  f9: getFontSize(1.2),
  f10: getFontSize(1.3),
  f11: getFontSize(1.4),
  f12: getFontSize(1.5),
  f13: getFontSize(1.6),
  f14: getFontSize(1.8),
  f15: getFontSize(1.9),
  f16: getFontSize(2),
  f17: getFontSize(2.2),
  f18: getFontSize(2.3),
  f19: getFontSize(2.4),
  f20: getFontSize(2.6),
  f21: getFontSize(2.7),
  f22: getFontSize(2.8),
  f23: getFontSize(2.9),
  f24: getFontSize(3),
  f25: getFontSize(3.2),
  f26: getFontSize(3.3),
  f27: getFontSize(3.4),
  f28: getFontSize(3.5),
  f29: getFontSize(3.7),
  f30: getFontSize(3.8),
  f31: getFontSize(3.9),
  f32: getFontSize(4.1),
  f33: getFontSize(4.2),
  f34: getFontSize(4.3),
  f35: getFontSize(4.5),
  f36: getFontSize(4.6),
  f37: getFontSize(4.7),
  f38: getFontSize(4.8),
  f39: getFontSize(4.9),
  f40: getFontSize(5.1),
  f41: getFontSize(5.2),
  f42: getFontSize(5.4),
  f43: getFontSize(5.5),
  f44: getFontSize(5.6),
  f45: getFontSize(5.7),
  f46: getFontSize(5.8),
  f47: getFontSize(6),
  f48: getFontSize(6.1),
  f49: getFontSize(6.2),
  f50: getFontSize(6.3),
  f51: getFontSize(6.4),
  f52: getFontSize(6.5),
  f53: getFontSize(6.6),
  f54: getFontSize(6.7),
  f55: getFontSize(6.8),
  f56: getFontSize(6.9),
  f57: getFontSize(7),
};
