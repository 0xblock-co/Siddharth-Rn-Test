import React from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootContainer from './src/navigation/RootContainer';
import { GeneralStyle } from './src/theme/GeneralStyle';
import { store } from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={GeneralStyle.flex}>
        <RootContainer />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
