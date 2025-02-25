import React, { act, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import ImagePath from '../assets/ImagePath';
import { COLORS, FONTS } from '../config/Constants';
import { getExtraWaterPerStep } from '../services/BeverageCalculator';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { addDrink } from '../redux/userSlice';
import Purchases from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

interface DrinkEntry {
  id: string;
  type: string;
  volume: number;
  timestamp: string;
  extraWaterNeeded?: number; // New field to track extra water recommendation
}

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
  const dispatch = useDispatch();
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [extraWater, setExtraWater] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const [activeSubscription, setActiveSubscription] = useState(false);

  useEffect(() => {
    const getCurrentActiveSubscriptions = async () => {
      try {
        const { activeSubscriptions } = await Purchases.getCustomerInfo();
        if (activeSubscriptions.length > 0) {
          setActiveSubscription(true);
        } else {
          setActiveSubscription(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentActiveSubscriptions();
  }, []);


  Purchases.addCustomerInfoUpdateListener((info:any) => {
    setActiveSubscription(info.activeSubscriptions.length > 0 || info.nonSubscriptionTransactions.length > 0);
});

  const displayPaywall = () => {
    RevenueCatUI.presentPaywall()
  }


  const adjustVolume = (amount: number) => {
    const newVolume = volume + amount;
    if (newVolume >= 50 && newVolume <= 1000) {
      setVolume(newVolume);
      
      // Calculate extra water if drink is selected
      if (selectedDrink) {
        const selectedDrinkData = drinkOptions.find(d => d.id === selectedDrink);
        if (selectedDrinkData) {
          const stepsCount = newVolume / 50;
          const waterPerStep = getExtraWaterPerStep(selectedDrinkData.name);
          setExtraWater(stepsCount * waterPerStep);
        }
      }
    }
  };

  const handleDrinkSelect = (drinkId: string) => {
    setSelectedDrink(drinkId);
    const selectedDrinkData = drinkOptions.find(d => d.id === drinkId);
    if (selectedDrinkData) {
      const stepsCount = volume / 50;
      const waterPerStep = getExtraWaterPerStep(selectedDrinkData.name);
      setExtraWater(stepsCount * waterPerStep);
    }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor:COLORS.primary}}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add drink</Text>

      <View style={styles.grid}>
        {drinkOptions.map((drink, index) => (
          <TouchableOpacity
            key={drink.id}
            disabled={!activeSubscription && index > 2}
            style={[
              styles.drinkOption,
              {
                opacity: activeSubscription ? 1 : index > 2 ? 0.5 : 1
              }
            ]}
            onPress={() => handleDrinkSelect(drink.id)}
          >
            <Image source={drink.icon} style={{ borderWidth: 3, borderColor: selectedDrink === drink.id ? "white" : 'transparent', borderRadius: wp(2.5) }} />
          </TouchableOpacity>
        ))}
        {!activeSubscription && (
 <TouchableOpacity style={{ position: "absolute", bottom: wp(20), alignSelf: "center", left: wp(35) }} onPress={displayPaywall}>
 <Image source={ImagePath.lockIcon} />
</TouchableOpacity>
        )}
       
      </View>

      <View style={styles.volumeControl}>
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => adjustVolume(-50)}
        >
          <Text style={styles.volumeButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.volumeText}>{volume}ml</Text>

        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => adjustVolume(50)}
        >
          <Text style={styles.volumeButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (selectedDrink) {
            const selectedDrinkData = drinkOptions.find(d => d.id === selectedDrink);
            const extraWater = selectedDrinkData?.name !== 'Water' ? 
              (volume / 50) * getExtraWaterPerStep(selectedDrinkData?.name) : 0;
              
            // Only add the drink itself, don't automatically add water
            dispatch(addDrink({
              type: selectedDrinkData?.name || '',
              volume: volume
            }));
            // The extra water needed will be calculated in userSlice and added to daily goal
            setSelectedDrink(null);
            setVolume(50);
          }
        }}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  extraWaterText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: FONTS.JostRegular,
  },
  
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
    width:wp(10),
    height:wp(10),
    bottom:wp(1.5)
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
