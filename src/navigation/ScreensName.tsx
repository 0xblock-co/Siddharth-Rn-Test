export const SCREENS = {
  Splash: 'Splash',
  HomeScreen: 'HomeScreen',
  WorkflowScreen: 'WorkflowScreen',
};

export interface ScreenNames {
  [key: string]: string;

  HomeScreen: string;
  Splash: string;
  WorkflowScreen: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
