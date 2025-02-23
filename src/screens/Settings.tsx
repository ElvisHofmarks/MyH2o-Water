import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateProfile } from '../redux/userSlice';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
    TextInput,
    Alert,
    Linking,
    Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePath from '../assets/ImagePath';
import { COLORS, FONTS } from '../config/Constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface ProfileScreenProps {
    navigation?: any; // Add proper navigation typing based on your setup
}

export default function Settings({ navigation }: ProfileScreenProps) {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.user.profile);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(profile.name);

    const handleEditName = () => {
        setTempName(profile.name);
        setIsEditingName(true);
    };

    const saveName = () => {
        if (tempName.trim()) {
            dispatch(updateProfile({ name: tempName.trim() }));
            setIsEditingName(false);
        }
    };

    const handleSelectImage = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            includeBase64: true,
        }).then(image => {
            dispatch(updateProfile({ avatar: image.path }));
        }).catch(error => {
            console.error('Image Picker Error: ', error);
        });
    };

    const handleNavigation = (url: string) => {
        // In a real app, you might want to navigate to internal screens instead
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Could not open the link');
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.avatarContainer} onPress={handleSelectImage}>
                <View style={styles.avatar}>
                    {profile.avatar ? (
                        <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
                    ) : (
                        <Image source={ImagePath.dummyImage} style={styles.avatarImage} />
                    )}
                    <View style={styles.cameraIcon}>
                        <Image source={ImagePath.camera} />
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.nameContainer}>
                <Text style={styles.greeting}>Hi, {profile.name}!</Text>
                <TouchableOpacity onPress={handleEditName}>
                    <Image source={ImagePath.editIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.premiumCard}>
                <Image source={ImagePath.logo} style={{ marginTop: wp(2) }} />
                <Text style={styles.premiumSubtext}>PREMIUM</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MyData')}
                >
                    <Text style={styles.buttonText}>My Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL('https://sites.google.com/view/myh2owater/privacy-policy')}
                >
                    <Text style={styles.buttonText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => Linking.openURL('https://sites.google.com/view/myh2owater/terms-of-service')}
                >
                    <Text style={styles.buttonText}>Terms of Service</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleNavigation('mailto:myh2o.water@gmail.com')}
                >
                    <Text style={styles.buttonText}>Contact Us</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isEditingName}
                transparent
                animationType="fade"
                onRequestClose={() => setIsEditingName(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Name</Text>
                        <TextInput
                            style={styles.input}
                            value={tempName}
                            onChangeText={setTempName}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsEditingName(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonPrimary]}
                                onPress={saveName}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7CD5D8',
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        borderRadius: 10,
        padding: 5,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 10,
    },
    greeting: {
        fontSize: 30,
        color: 'rgba(98, 100, 101, 1)',
        fontFamily: FONTS.JostRegular,
        fontWeight: '400'
    },
    premiumCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        marginHorizontal: wp(5),
        gap: 10,
        paddingVertical: wp(2)
    },
    premiumText: {
        fontSize: 24,
        color: '#7CD5D8',
        fontWeight: 'bold',
    },
    premiumSubtext: {
        fontSize: 20,
        color: COLORS.primary,
        fontFamily: FONTS.JostRegular,
        fontWeight: '500'
    },
    buttonContainer: {
        gap: 15,
        marginHorizontal: wp(5)
    },
    button: {
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 25,
        padding: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        fontFamily: FONTS.JostRegular,
        fontWeight: '400'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    modalButton: {
        padding: 10,
        borderRadius: 10,
    },
    modalButtonPrimary: {
        backgroundColor: '#7CD5D8',
    },
    modalButtonText: {
        color: '#666',
    },
    modalButtonTextPrimary: {
        color: 'white',
    },
});
