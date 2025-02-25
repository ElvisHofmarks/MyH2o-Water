import PushNotification from 'react-native-push-notification';
import { AppStore, RootState } from '../types/store';

interface NotificationMessages {
  wakeup: string[];
  bedtime: string[];
  afterAlcohol: string[];
  reminder: string[];
}

const messages: NotificationMessages = {
  wakeup: [
    "Good Morning! Fresh glass of water flushes out the stomach and therefore balances the lymphatic system",
    "Good Morning! Its time for glass of water, it rehydrates you after a waterless night.",
    "Good Morning! Time to drink water, it increases your energy levels.",
    "Good Morning! Glass of water at the morning boosts mental performance.",
    "Good Morning! Fresh glass of water stimulates your metabolism, time to do it!",
    "Good Morning! You should drink glass of water promotes digestion!",
    "Good Morning! Glass of water curbs hunger pangs."
  ],
  bedtime: [
    "Good Evening! Time for glass of water, it may have a calming effect.",
    "Good Evening! Don't forget to drink a glass of water, hydration helps with sleep stages.",
    "Good Evening! Glass of water keep stay body hydrated overnight!",
    "Good Evening! Fresh glass of water helps to remove waste, regulate body temperature!",
    "Good Evening! Glass of water before bed helps induce sleepiness.",
    "Good Evening! Water helps to detox the body and improve digestion an the night.",
    "Good Evening! Don't forget to drink a glass of water it increases blood circulation."
  ],
  afterAlcohol: [
    "Don't forget to drink a glass of water, it wil keep you rehydrated!",
    "You should drink a glass of water, it will keep body in balance.",
    "Its time for glass of fresh water, it will reduce risk of dehydration!",
    "Keep in mind, glass of water after each drink will reduce hangover risk."
  ],
  reminder: [
    "Don't forget to drink a glass of water, it wil keep you rehydrated!",
    "Drink water, it helps maximize physical performance!",
    "Time to drink water, it significantly affects energy levels and brain function.",
    "Drink water! It may help prevent and treat headaches.",
    "Now time for water, it may help relieve constipation.",
    "Its time for glass of water it helps treat kidney stones.",
    "Time for glass of water, keep yourself hydrated!"
  ]
};

class NotificationService {
  private static instance: NotificationService | null = null;
  private store: AppStore | null = null;

  private constructor() {
    this.configure();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public initializeStore(store: AppStore) {
    this.store = store;
  }

  private configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: "water-reminders",
        channelName: "Water Reminders",
        channelDescription: "Reminders to drink water",
        playSound: true,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

  private ensureStore(): AppStore {
    if (!this.store) {
      throw new Error('NotificationService: Store not initialized');
    }
    return this.store;
  }

  private getRandomMessage(type: keyof NotificationMessages): string {
    const messageArray = messages[type];
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  }

  private scheduleNotification(message: string, date: Date) {
    // Make sure the date is in the future
    const now = new Date();
    if (date < now) {
      // If the time has already passed today, schedule for tomorrow
      date.setDate(date.getDate() + 1);
    }

    console.log(`Scheduling notification for ${date.toLocaleString()} with message: ${message}`);
    
    PushNotification.localNotificationSchedule({
      channelId: 'water-reminders',
      title: 'MyH2o Reminder',
      message,
      date,
      allowWhileIdle: true,
      repeatType: 'day',
    });
  }

  public updateStore(newStore: AppStore) {
    this.store = newStore;
  }

  public scheduleWakeupNotification(time: string, isWeekend: boolean) {
    const state = this.ensureStore().getState();
    if (!state.user.settings.notifications) return;

    // Parse time format (e.g., "7:00 AM")
    const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
    const match = time.match(timeRegex);
    
    if (!match) {
      console.error(`Invalid time format: ${time}`);
      return;
    }
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    
    // We don't need to cancel all notifications here, as it would cancel other types of notifications
    
    this.scheduleNotification(
      this.getRandomMessage('wakeup'),
      date
    );
    
    console.log(`Scheduled wakeup notification for ${isWeekend ? 'weekend' : 'workday'} at ${time}`);
  }

  public scheduleBedtimeNotification(time: string, isWeekend: boolean) {
    const state = this.ensureStore().getState();
    if (!state.user.settings.notifications) return;

    // Parse time format (e.g., "11:00 PM")
    const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
    const match = time.match(timeRegex);
    
    if (!match) {
      console.error(`Invalid time format: ${time}`);
      return;
    }
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    
    this.scheduleNotification(
      this.getRandomMessage('bedtime'),
      date
    );
    
    console.log(`Scheduled bedtime notification for ${isWeekend ? 'weekend' : 'workday'} at ${time}`);
  }

  public scheduleAfterAlcoholNotification() {
    const state = this.ensureStore().getState();
    if (!state.user.settings.notifications) return;

    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);

    this.scheduleNotification(
      this.getRandomMessage('afterAlcohol'),
      date
    );
    
    console.log(`Scheduled after-alcohol notification for ${date.toLocaleTimeString()}`);
  }

  public scheduleInactivityReminder() {
    const state = this.ensureStore().getState();
    if (!state.user.settings.notifications) return;

    const date = new Date();
    date.setHours(date.getHours() + 3);

    this.scheduleNotification(
      this.getRandomMessage('reminder'),
      date
    );
    
    console.log(`Scheduled inactivity reminder for ${date.toLocaleTimeString()}`);
  }

  public cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export default NotificationService;
