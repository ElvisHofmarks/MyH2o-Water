import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DrinkEntry {
  id: string;
  type: string;
  volume: number;
  timestamp: string;
}

interface UserSettings {
  dailyGoal: number;
  notifications: boolean;
  reminderInterval: number;
}

interface UserProfile {
  gender: 'men' | 'women' | 'other';
  weightUnit: 'kg' | 'lbs';
  age: string;
  weight: string;
  workdayWakeTime: string;
  workdayBedTime: string;
  weekendWakeTime: string;
  weekendBedTime: string;
}

interface Suggestions {
  twentyFive: string[];
  fifty: string[];
  seventyFive: string[];
  hundred: string[];
}

interface UserState {
  onBoarding: boolean;
  settings: UserSettings;
  drinkHistory: DrinkEntry[];
  dailyStats: {
    date: string;
    totalVolume: number;
    drinks: DrinkEntry[];
  }[];
  profile: UserProfile;
  suggestions: Suggestions;
  lastDrinkTime: string | null;
}

const suggestions: Suggestions = {
  twentyFive: [
    "Great start! Keep it up, and you'll feel more energized throughout the day!",
    "You're off to a good beginning! A little more hydration goes a long way.",
    "Nice work! Your body is thanking you. Ready for the next sip?",
    "Awesome! Just a quarter down. Keep the momentum going!",
    "Every drop counts! You're already 25% closer to your daily goal!"
  ],
  fifty: [
    "Halfway there! Your body is loving the hydration!",
    "50% done! Keep drinking to maintain that focus and energy.",
    "Awesome job! You're halfway to feeling your best today!",
    "Great progress! Staying hydrated is a great way to power through the day.",
    "You're at 50%! Keep sipping to stay refreshed and alert."
  ],
  seventyFive: [
    "Almost there! Just a little more to reach your daily goal!",
    "You're 75% hydrated! One step closer to feeling fantastic!",
    "Awesome! You're nearly at the finish line. Keep it up!",
    "So close! Your body's loving this. Finish strong!",
    "Just a bit more to go! You're doing great!"
  ],
  hundred: [
    "Congratulations! You've reached your hydration goal today!",
    "Fantastic! You did it! Your body thanks you for staying hydrated!",
    "Mission accomplished! Way to take care of yourself today!",
    "Awesome! You nailed it! Hydration goals on point!",
    "Perfect! You've hit 100%! Feel the difference?"
  ]
};

const calculateDailyWaterIntake = (weight: number, unit: 'kg' | 'lbs'): number => {
  const weightInKg = unit === 'kg' ? weight : weight / 2.20462;
  return Math.round(weightInKg * 35); // 0.035L = 35mL per kg
};

const initialState: UserState = {
  lastDrinkTime: null,
  onBoarding: false,
  settings: {
    dailyGoal: 2300, // 2.3L default
    notifications: true,
    reminderInterval: 60, // minutes
  },
  drinkHistory: [],
  dailyStats: [],
  profile: {
    gender: 'men',
    weightUnit: 'kg',
    age: '',
    weight: '',
    workdayWakeTime: '7:00 AM',
    workdayBedTime: '11:00 PM',
    weekendWakeTime: '10:00 AM',
    weekendBedTime: '12:00 AM',
  },
  suggestions
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateOnBoarding: (state) => {
      state.onBoarding = true;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    addDrink: (state, action: PayloadAction<Omit<DrinkEntry, 'id' | 'timestamp'>>) => {
      const timestamp = new Date().toISOString();
      const newDrink: DrinkEntry = {
        id: Date.now().toString(),
        timestamp,
        ...action.payload,
      };

      // Add to drink history
      state.drinkHistory.push(newDrink);
      state.lastDrinkTime = timestamp;

      // Update daily stats
      const today = timestamp.split('T')[0];
      const todayStatsIndex = state.dailyStats.findIndex(stat => stat.date === today);

      if (todayStatsIndex >= 0) {
        state.dailyStats[todayStatsIndex].drinks.push(newDrink);
        state.dailyStats[todayStatsIndex].totalVolume += newDrink.volume;
      } else {
        state.dailyStats.push({
          date: today,
          totalVolume: newDrink.volume,
          drinks: [newDrink],
        });
      }

      // If alcohol was added, trigger notification after 30 minutes
      if (action.payload.type === 'Beer' || action.payload.type === 'Wine' || action.payload.type === 'Spirits') {
        // This will be handled by the notification middleware
        return {
          ...state,
          needsAlcoholReminder: true
        };
      }
    },
    clearHistory: (state) => {
      state.drinkHistory = [];
      state.dailyStats = [];
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      
      // Update daily goal when weight changes
      if (action.payload.weight) {
        const weight = parseFloat(action.payload.weight);
        if (!isNaN(weight)) {
          state.settings.dailyGoal = calculateDailyWaterIntake(
            weight, 
            action.payload.weightUnit || state.profile.weightUnit
          );
        }
      }
    },
  },
});

export const { updateOnBoarding, updateSettings, addDrink, clearHistory, updateProfile } = userSlice.actions;
export default userSlice.reducer;
