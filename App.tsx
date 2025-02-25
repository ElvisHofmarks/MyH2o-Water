import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {persistor, store} from './src/redux/store';
import {COLORS} from './src/config/Constants';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';


const AppContent: React.FC = () => {
 

  return (
      <View style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
  );
};

const App: React.FC = () => {

  //PushNotification.requestPermissions()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: COLORS.black,
  },
});

export default App;
