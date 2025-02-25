import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import OnBoarding from '../screens/OnBoarding';
import Dashboard from '../screens/Dashboard';   
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTab from './CustomTab';
import AddDrink from '../screens/AddDrink';
import Settings from '../screens/Settings';
import MyData from '../screens/MyData';
const Stack = createNativeStackNavigator<any>();

const AppNavigator: React.FC = () => {
  const onBoarding = useSelector((state: RootState) => state.user.onBoarding);

  return (
    <Stack.Navigator
      initialRouteName={onBoarding ? 'MyTabs' : 'OnBoarding'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="MyTabs" component={MyTabs} />
      <Stack.Screen name="MyData" component={MyData} />
    </Stack.Navigator>
  );
};


function MyTabs() {
    const Tab = createBottomTabNavigator();

    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Tab.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: true,
            headerShown: false,
          }}
          tabBar={(props: any) => <CustomTab {...props} />}>
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="AddDrink" component={AddDrink} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </SafeAreaProvider>
    );
  }

export default AppNavigator;
