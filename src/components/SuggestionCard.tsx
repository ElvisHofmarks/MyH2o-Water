import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, FONTS } from '../config/Constants';

const suggestions = {
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

const SuggestionCard: React.FC = () => {
    const { settings, dailyStats } = useSelector((state: RootState) => state.user);
    
    const getSuggestion = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayStats = dailyStats.find((stat: { date: string; totalVolume: number }) => stat.date === today);
        const progress = todayStats ? (todayStats.totalVolume / settings.dailyGoal) * 100 : 0;

        const getRandomSuggestion = (arr: string[]) => 
            arr[Math.floor(Math.random() * arr.length)];

        if (progress >= 100) {
            return getRandomSuggestion(suggestions.hundred);
        } else if (progress >= 75) {
            return getRandomSuggestion(suggestions.seventyFive);
        } else if (progress >= 50) {
            return getRandomSuggestion(suggestions.fifty);
        } else if (progress >= 25) {
            return getRandomSuggestion(suggestions.twentyFive);
        } else {
            return "Start your day with a glass of water! It helps kickstart your metabolism.";
        }
    };

    const suggestion = useMemo(getSuggestion, [dailyStats, settings.dailyGoal]);

    return (
        <View style={styles.card}>
            <Text style={styles.cardText}>{suggestion}</Text>
            <View style={styles.dotsContainer}>
                {[0, 1, 2].map((_, index) => (
                    <View key={index} style={styles.dot} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 17,
        width: wp(90),
        padding: wp(3)
    },
    cardText: {
        fontSize: 20,
        color: 'rgba(98, 100, 101, 1)',
        textAlign: 'center',
        fontWeight: '500',
        fontFamily: FONTS.JostRegular
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white,
    },
});

export default SuggestionCard;
