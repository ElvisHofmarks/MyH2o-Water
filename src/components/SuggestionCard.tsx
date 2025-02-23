import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, FONTS } from '../config/Constants';

const SuggestionCard: React.FC = () => {
    const { settings, dailyStats, suggestions } = useSelector((state: RootState) => state.user);
    
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
