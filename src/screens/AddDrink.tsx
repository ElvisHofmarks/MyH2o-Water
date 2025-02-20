import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddDrink: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Add Drink</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default AddDrink;
