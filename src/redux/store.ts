import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userSlice';
import createNotificationMiddleware from './notificationMiddleware';
import NotificationService from '../services/NotificationService';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

// Initialize notification service
const notificationService = NotificationService.getInstance();

export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(createNotificationMiddleware(notificationService)),
});

// Initialize the store in notification service
notificationService.initializeStore(store);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
