export const SCREENS = {
  Splash: 'Splash',
  HomeScreen: 'HomeScreen',
};

export interface ScreenNames {
  [key: string]: string;

  HomeScreen: string;
  Splash: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
