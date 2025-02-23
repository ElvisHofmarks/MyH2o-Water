import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS, FONTS } from '../config/Constants';

type DrinkData = {
    name: string;
    amount: number;
    maxAmount: number;
};

const drinks: DrinkData[] = [
    { name: 'Coffee', amount: 0.5, maxAmount: 2 },
    { name: 'Tea', amount: 0.25, maxAmount: 2 },
    { name: 'Soda', amount: 1.75, maxAmount: 2 },
    { name: 'Beer', amount: 1.5, maxAmount: 2 },
    { name: 'Wine', amount: 0.5, maxAmount: 2 },
    { name: 'Spirits', amount: 0.25, maxAmount: 2 },
    { name: 'Juice', amount: 0.1, maxAmount: 2 },
    { name: 'Milk', amount: 0.5, maxAmount: 2 },
];

const DrinkTracker = ({ modalVisible, setModalVisible }: any) => {
    const [selectedPeriod, setSelectedPeriod] = useState<'Today' | 'Week' | 'Month'>('Today');

    const renderProgressBar = (amount: number, maxAmount: number) => {
        const percentage = (amount / maxAmount) * 100;
        return (
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${percentage}%` }]} />
            </View>
        );
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.overlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.container}>
                                <View>
                                    <View style={{ backgroundColor: COLORS.white, height: wp(2), width: wp(20), alignSelf: "center", justifyContent: "center", borderRadius: wp(10) }} />
                                </View>
                                {/* Water Amount Section */}
                                <View style={styles.waterAmount}>
                                    <Text style={styles.waterText}>Monthly water amount: 22L / 81L</Text>
                                </View>

                                {/* Days Progress Section */}
                                <View style={styles.daysContainer}>
                                    <View style={styles.daysCompleted}>
                                        <Text style={styles.daysText}>Days completed: 2/30 days</Text>
                                    </View>
                                    <View style={styles.daysUncompleted}>
                                        <Text style={styles.daysText}>Days uncompleted: 0 days</Text>
                                    </View>
                                </View>

                                {/* Other Drinks Section */}
                                <Text style={styles.sectionTitle}>Other drinks:</Text>

                                {/* Period Selector */}
                                <View style={styles.periodSelector}>
                                    {['Today', 'Week', 'Month'].map((period) => (
                                        <TouchableOpacity
                                            key={period}
                                            style={[
                                                styles.periodButton,
                                                selectedPeriod === period && styles.selectedPeriod,
                                            ]}
                                            onPress={() => setSelectedPeriod(period as 'Today' | 'Week' | 'Month')}
                                        >
                                            <Text style={[styles.periodText, selectedPeriod === period && { color: COLORS.primary }]}>{period}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Drinks List */}
                                <ScrollView style={styles.drinksList}>
                                    {drinks.map((drink) => (
                                        <View key={drink.name} style={styles.drinkItem}>
                                            <Text style={styles.drinkName}>{drink.name}</Text>
                                            {renderProgressBar(drink.amount, drink.maxAmount)}
                                        </View>
                                    ))}

                                    {/* Volume Scale */}
                                    <View style={styles.scaleContainer}>
                                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((value) => (
                                            <Text key={value} style={styles.scaleText}>
                                                {value}l
                                            </Text>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#87CEEB',
        padding: 0,
    },
    waterAmount: {
        borderWidth: 3,
        borderColor: COLORS.white,
        padding: 8,
        borderRadius: 15,
        marginBottom: 10,
        marginHorizontal: wp(1),
        marginTop: wp(5)
    },
    waterText: {
        color: COLORS.white,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: FONTS.JostRegular,
        fontWeight: "500"
    },
    daysContainer: {
        gap: 10,
        marginBottom: 20,
    },
    daysCompleted: {
        backgroundColor: 'rgba(2, 178, 9, 1)',
        padding: 15,
        borderRadius: 15,
    },
    daysUncompleted: {
        backgroundColor: 'rgba(196, 0, 0, 1)',
        padding: 15,
        borderRadius: 15,
    },
    daysText: {
        color: 'white',
        fontSize: 20,
        fontFamily: FONTS.JostRegular,
        fontWeight: "500"
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontFamily: FONTS.JostRegular,
        fontWeight: "500",
        marginBottom: 5,
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
        justifyContent: "space-between"
    },
    periodButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 1,
        borderRadius: 15,
        paddingHorizontal: 25,
    },
    selectedPeriod: {
        backgroundColor: 'white',
    },
    periodText: {
        color: "rgba(111, 198, 210, 1)",
        fontSize: 20,
        fontFamily: FONTS.JostRegular,
        fontWeight: "500"
    },
    drinksList: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 15,
        padding: 15,
        flex: 1
    },
    drinkItem: {
        marginBottom: 8,
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    drinkName: {
        color: 'rgba(98, 100, 101, 1)',
        marginBottom: 5,
        fontSize: 13,
        fontFamily: FONTS.JostRegular,
        fontWeight: "400", width: wp(13)
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 5,
        overflow: 'hidden',
        flex: 1
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'white',
    },
    scaleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft:wp(13)
    },
    scaleText: {
        color: 'rgba(98, 100, 101, 1)',
        fontSize: 13,
        fontFamily: FONTS.JostRegular,
        fontWeight: "400"
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#87CEEB',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '80%',
    },
});

export default DrinkTracker;