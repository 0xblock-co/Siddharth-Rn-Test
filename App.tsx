import { Animated, Easing } from 'react-native';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootContainer from './src/navigation/RootContainer';
import { GeneralStyle } from './src/theme/GeneralStyle';

const App = ({}) => {
  return (
    // <Provider store={store}>
    // {/* <PersistGate loading={null} persistor={persistor}> */}
    <SafeAreaView style={GeneralStyle.flex}>
      <RootContainer />
    </SafeAreaView>
    // </PersistGate>
    // </Provider>
  );
};

export default App;
