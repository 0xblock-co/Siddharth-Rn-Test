export const SCREENS = {
  Splash: 'Splash',
  HomeScreen: 'HomeScreen',
  WorkflowScreen: 'WorkflowScreen',
  ItemDetailScreen: 'ItemDetailScreen',
  Drawer: 'Drawer',
};

export interface ScreenNames {
  [key: string]: string;

  HomeScreen: string;
  Splash: string;
  WorkflowScreen: string;
  ItemDetailScreen: string;
  Drawer: string;
}

export const SCREEN_NAMES: ScreenNames = {
  ...SCREENS,
};
