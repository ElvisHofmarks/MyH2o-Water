import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FONTS } from '../config/Constants';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RootState } from '../redux/store';
import { getHydrationRecommendations } from '../redux/userSlice';

type DayData = {
    day: string;
    amount: number;
};

const getDayLetter = (date: string): string => {
    const day = new Date(date).getDay();
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][day];
};

const getLastSevenDays = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

// Generate dynamic y-axis labels based on the maximum value
const generateYAxisLabels = (maxValue: number): number[] => {
    // Round up to the nearest 0.5L
    const roundedMax = Math.ceil(maxValue * 2) / 2;
    
    // Create 5 evenly spaced labels
    const step = roundedMax / 5;
    const labels = [];
    
    for (let i = 5; i > 0; i--) {
        labels.push(step * i);
    }
    
    return labels;
};

const WaterStatistics = () => {
    const userState = useSelector((state: RootState) => state.user);
    const { dailyStats } = userState;
    const hydrationData = getHydrationRecommendations(userState);
    const adjustedDailyGoal = hydrationData.dailyGoal;
    
    const data: DayData[] = getLastSevenDays().map(date => {
        const stats = dailyStats.find((stat: { date: string }) => stat.date === date);
        return {
            day: getDayLetter(date),
            amount: stats ? stats.totalVolume / 1000 : 0 // Convert mL to L
        };
    });

    // Calculate max value based on daily goal and actual consumption
    const maxConsumption = Math.max(...data.map(item => item.amount), 0);
    const maxValue = Math.max(adjustedDailyGoal / 1000, maxConsumption, 2.5); // At least 2.5L for scale

    return (
        <View style={styles.card}>
            <Text style={styles.goalText}>Daily goal {(adjustedDailyGoal / 1000).toFixed(1)}L</Text>

            <View style={styles.chartContainer}>
                {/* Y-axis labels */}
                <View style={styles.yAxis}>
                    {generateYAxisLabels(maxValue).map((value) => (
                        <Text key={value} style={styles.yAxisLabel}>
                            {value.toFixed(1)}L
                        </Text>
                    ))}
                </View>

                {/* Bars */}
                <View style={styles.barsContainer}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.barWrapper}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: `${Math.min((item.amount / maxValue) * 100, 100)}%`,
                                        backgroundColor: item.day === 'S' ? '#6FC6D2' : 'white',
                                    }
                                ]}
                            />
                            <Text style={styles.dayLabel}>{item.day}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        padding: 16,
        height: wp(60),
    },
    goalText: {
        fontSize: 16,
        color: 'rgba(98, 100, 101, 1)',
        marginBottom: 10,
        fontFamily: FONTS.JostMedium
    },
    chartContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 1,
    },
    yAxis: {
        justifyContent: 'space-between',
        marginRight: 10,
    },
    yAxisLabel: {
        color: 'rgba(98, 100, 101, 1)',
        fontSize: 13,
        fontFamily: FONTS.JostMedium,
        fontWeight: "400"
    },
    barsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    barWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100%',
    },
    bar: {
        width: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    dayLabel: {
        marginTop: 8,
        color: '#4A4A4A',
        fontSize: 13,
        fontFamily:FONTS.JostMedium,
        fontWeight: "400"
    },
});

export default WaterStatistics;
