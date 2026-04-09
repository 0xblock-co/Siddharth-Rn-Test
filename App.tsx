import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootContainer from './src/navigation/RootContainer';
import { GeneralStyle } from './src/theme/GeneralStyle';
import { store } from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={GeneralStyle.flex}>
        <RootContainer />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
