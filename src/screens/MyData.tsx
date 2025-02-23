import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Platform,
    Alert,
    ScrollView,
    Image,
    Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateProfile } from '../redux/userSlice';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ImagePath from '../assets/ImagePath';
import { COLORS, FONTS } from '../config/Constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
interface TimeInputProps {
    label: string;
    value: string;
    onChange: (time: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange }) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate && event.type !== 'dismissed') {
            setDate(selectedDate);
            const timeString = selectedDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            onChange(timeString);
        }
    };

    return (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShow(true)}
            >
                <Text style={styles.timeText}>{value}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={show}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <DateTimePicker
                            value={date}
                            mode="time"
                            is24Hour={false}
                            display="spinner"
                            onChange={onTimeChange}
                            textColor={COLORS.primary}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShow(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const MyData = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.user.profile);
    const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof any, string>> = {};

        if (!profile.age || parseInt(profile.age) < 1 || parseInt(profile.age) > 120) {
            newErrors.age = 'Please enter a valid age between 1 and 120';
        }

        if (!profile.weight || parseFloat(profile.weight) <= 0) {
            newErrors.weight = 'Please enter a valid weight';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Please correct the errors in the form');
            return;
        }

        dispatch(updateProfile(profile));
        Alert.alert('Success', 'Data saved successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    const convertWeight = (value: string) => {
        if (!value) return '';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;

        if (profile.weightUnit === 'kg') {
            return (numValue * 2.20462).toFixed(1);
        } else {
            return (numValue / 2.20462).toFixed(1);
        }
    };

    const handleWeightUnitChange = (unit: 'kg' | 'lbs') => {
        if (unit !== profile.weightUnit) {
            dispatch(updateProfile({
                weightUnit: unit,
                weight: convertWeight(profile.weight)
            }));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={ImagePath.backIcon} />
                </TouchableOpacity>
                <Text style={styles.title}>My data</Text>
                <View style={{ width: wp(20) }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Select your gender</Text>
                <View style={styles.genderContainer}>
                    {(['men', 'women', 'other'] as const).map((gender) => (
                        <TouchableOpacity
                            key={gender}
                            style={[
                                styles.genderButton,
                                profile.gender === gender && styles.genderButtonSelected,
                            ]}
                            onPress={() => dispatch(updateProfile({ gender }))}
                        >
                            <Text style={[
                                styles.genderButtonText,
                                profile.gender === gender && styles.genderButtonTextSelected,
                            ]}>
                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Select your weight unit</Text>
                <View style={styles.weightUnitContainer}>
                    {(['kg', 'lbs'] as const).map((unit) => (
                        <TouchableOpacity
                            key={unit}
                            style={[
                                styles.weightUnitButton,
                                profile.weightUnit === unit && styles.weightUnitButtonSelected,
                            ]}
                            onPress={() => handleWeightUnitChange(unit)}
                        >
                            <Text style={styles.weightUnitText}>
                                {unit.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Select your age</Text>
                <TextInput
                    style={[styles.input, errors.age && styles.inputError]}
                    value={profile.age}
                    onChangeText={(age) => dispatch(updateProfile({ age }))}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholder="Your age"
                    placeholderTextColor="#999"
                />
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

                <Text style={styles.label}>Enter your weight</Text>
                <TextInput
                    style={[styles.input, errors.weight && styles.inputError]}
                    value={profile.weight}
                    onChangeText={(weight) => dispatch(updateProfile({ weight }))}
                    keyboardType="decimal-pad"
                    placeholder={`Enter weight in ${profile.weightUnit}`}
                    placeholderTextColor="#999"
                />
                {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

                <TimeInput
                    label="Average work day wake up time"
                    value={profile.workdayWakeTime}
                    onChange={(time) => dispatch(updateProfile({ workdayWakeTime: time }))}
                />

                <TimeInput
                    label="Average work day bed time"
                    value={profile.workdayBedTime}
                    onChange={(time) => dispatch(updateProfile({ workdayBedTime: time }))}
                />

                <TimeInput
                    label="Average weekend wake up time"
                    value={profile.weekendWakeTime}
                    onChange={(time) => dispatch(updateProfile({ weekendWakeTime: time }))}
                />

                <TimeInput
                    label="Average weekend bed time"
                    value={profile.weekendBedTime}
                    onChange={(time) => dispatch(updateProfile({ weekendBedTime: time }))}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7CD7E6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between'
    },
    backButton: {
        padding: 8,
    },
    title: {
        color: COLORS.white,
        fontSize: 35,
        fontWeight: '400',
        marginLeft: 16,
        fontFamily: FONTS.JostRegular
    },
    content: {
        padding: 16,
    },
    label: {
        color: 'rgba(98, 100, 101, 1)',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: FONTS.JostRegular, fontWeight: "500"
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    genderButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        paddingVertical: wp(2)
    },
    genderButtonSelected: {
        backgroundColor: 'white',
    },
    genderButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: FONTS.JostRegular, fontWeight: "500"
    },
    genderButtonTextSelected: {
        color: 'rgba(111, 198, 210, 0.5)',
    },
    weightUnitContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    weightUnitButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        paddingVertical: wp(3)
    },
    weightUnitButtonSelected: {
        backgroundColor: 'white',
    },
    weightUnitText: {
        color: COLORS.primary,
        fontSize: 25,
        fontFamily: FONTS.JostRegular, fontWeight: "400"
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 25,
        padding: Platform.OS === 'ios' ? 16 : 12,
        fontSize: 20,
        marginBottom: 16,
        color: COLORS.primary,
        fontFamily: FONTS.JostRegular, fontWeight: "500",
        textAlign: 'center'
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
        marginLeft: 8,
    },
    timeText: {
        color: COLORS.primary,
        fontSize: 20,
        fontFamily: FONTS.JostRegular, fontWeight: "500", textAlign: 'center'
    },
    saveButton: {
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 25,
        padding: 13,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 25,
        fontFamily: FONTS.JostRegular, fontWeight: "400",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#7CD7E6',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: FONTS.JostRegular
    },
});

export default MyData
