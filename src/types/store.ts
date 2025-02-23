import { EnhancedStore } from '@reduxjs/toolkit';

export interface UserSettings {
  notifications: boolean;
}

export interface UserState {
  onBoarding: boolean;
  settings: UserSettings;
  drinkHistory: any[]; // Replace with proper type if available
  dailyStats: any; // Replace with proper type if available
}

export interface RootState {
  user: UserState;
}

export type AppStore = EnhancedStore<RootState>;
export type AppDispatch = AppStore['dispatch'];
