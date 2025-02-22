import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, FONTS } from '../config/Constants';
interface SuggestionCardProps {

}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ }) => {
    return (
        <>
            <View style={[styles.card]}>
                <Text style={styles.cardText}>
                    Its time for glass of water, It delivers
                    oxygen throughout the body
                </Text>
                <View style={styles.dotsContainer}>
                    {[0, 1, 2].map((_, index) => (
                        <View key={index} style={styles.dot} />
                    ))}
                </View>
            </View>
        </>
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