import { Middleware, Action, PayloadAction } from '@reduxjs/toolkit';
import NotificationService from '../services/NotificationService';
import { RootState } from '../types/store';

interface ProfilePayload {
  workdayWakeTime?: string;
  weekendWakeTime?: string;
  workdayBedTime?: string;
  weekendBedTime?: string;
}

interface DrinkPayload {
  type: string;
}

interface SettingsPayload {
  notifications?: boolean;
}

type AppAction = 
  | PayloadAction<ProfilePayload, 'user/updateProfile'>
  | PayloadAction<DrinkPayload, 'user/addDrink'>
  | PayloadAction<SettingsPayload, 'user/updateSettings'>;

const createNotificationMiddleware = (
  notificationService: NotificationService
): Middleware<{}, RootState> => store => next => (action: unknown) => {
    const result = next(action);

    // Type guard for actions
    if (!action || typeof action !== 'object' || !('type' in action)) {
      return result;
    }

    // Handle profile updates for wake/bed time notifications
    if (action.type === 'user/updateProfile' && 'payload' in action) {
      const { workdayWakeTime, weekendWakeTime, workdayBedTime, weekendBedTime } = action.payload as ProfilePayload;
      
      if (workdayWakeTime) {
        notificationService.scheduleWakeupNotification(workdayWakeTime, false);
      }
      if (weekendWakeTime) {
        notificationService.scheduleWakeupNotification(weekendWakeTime, true);
      }
      if (workdayBedTime) {
        notificationService.scheduleBedtimeNotification(workdayBedTime, false);
      }
      if (weekendBedTime) {
        notificationService.scheduleBedtimeNotification(weekendBedTime, true);
      }
    }

    // Handle drink additions
    if (action.type === 'user/addDrink' && 'payload' in action) {
      const alcoholTypes = ['Beer', 'Wine', 'Spirits'];
      const payload = action.payload as DrinkPayload;
      if (alcoholTypes.includes(payload.type)) {
        notificationService.scheduleAfterAlcoholNotification();
      }

      // Schedule inactivity reminder
      notificationService.scheduleInactivityReminder();
    }

    // Handle notification settings changes
    if (action.type === 'user/updateSettings' && 'payload' in action) {
      const payload = action.payload as SettingsPayload;
      if (payload.notifications === false) {
        notificationService.cancelAllNotifications();
      }
    }

    return result;
  };

export default createNotificationMiddleware;
