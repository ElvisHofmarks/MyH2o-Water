import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import ImagePath from '../assets/ImagePath';
import { COLORS, FONTS } from '../config/Constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';



const drinkOptions: any[] = [
  { id: '1', name: 'Water', icon: ImagePath.water },
  { id: '2', name: 'Coffee', icon: ImagePath.Coffee },
  { id: '3', name: 'Tea', icon: ImagePath.Tea },
  { id: '4', name: 'Soda', icon: ImagePath.Soda },
  { id: '5', name: 'Beer', icon: ImagePath.Beer },
  { id: '6', name: 'Wine', icon: ImagePath.Wine },
  { id: '7', name: 'Spirits', icon: ImagePath.Spirits },
  { id: '8', name: 'Juice', icon: ImagePath.Juice },
  { id: '9', name: 'Milk', icon: ImagePath.Milk },
];

export default function AddDrink() {
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const adjustVolume = (amount: number) => {
    const newVolume = volume + amount;
    if (newVolume >= 0 && newVolume <= 1000) {
      setVolume(newVolume);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add drink</Text>

      <View style={styles.grid}>
        {drinkOptions.map((drink) => (
          <TouchableOpacity
            key={drink.id}
            style={[
              styles.drinkOption,

            ]}
            onPress={() => setSelectedDrink(drink.id)}
          >
            <Image source={drink.icon} style={{ borderWidth: 3, borderColor: selectedDrink === drink.id ? "white" : 'transparent', borderRadius: wp(2.5) }} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.volumeControl}>
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => adjustVolume(-10)}
        >
          <Text style={styles.volumeButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.volumeText}>{volume}ml</Text>

        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => adjustVolume(10)}
        >
          <Text style={styles.volumeButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (selectedDrink) {
            // Handle adding drink
            console.log(`Adding ${selectedDrink} - ${volume}ml`);
          }
        }}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  header: {
    fontSize: 35,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: FONTS.JostMedium
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: wp(5),
    padding: wp(2),
    borderRadius: wp(5),
    marginTop:wp(5)
  },
  drinkOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },

  drinkText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
    borderWidth:3, 
    marginHorizontal:wp(5),
    paddingHorizontal:wp(4),
    borderColor:COLORS.white,
    marginTop:wp(10)
  },
  volumeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '400',
    fontFamily:FONTS.JostRegular,
    textAlign:'center'
  },
  volumeText: {
    color: 'white',
    fontSize: 25,
    fontFamily:FONTS.JostRegular,
    fontWeight:'400'
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    marginHorizontal:wp(5),
    marginTop:wp(3)
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 25,
    fontWeight: '400',
    fontFamily:FONTS.JostRegular
  },
});