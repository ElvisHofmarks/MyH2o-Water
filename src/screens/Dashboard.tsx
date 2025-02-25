import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { getHydrationRecommendations } from '../redux/userSlice';
import { COLORS, FONTS } from '../config/Constants';
import ImagePath from '../assets/ImagePath';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import SuggestionCard from '../components/SuggestionCard';
import WaterStatistics from '../components/WaterStatistics';
import DrinkTracker from '../components/DrinkTracker';
import MyDataModal from '../components/MyDataModal';
import Purchases from 'react-native-purchases';

function generateRandom8DigitNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

const Dashboard: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);
  const userId = generateRandom8DigitNumber()
  Purchases.configure({ apiKey: "appl_vZovCLdWkyACWUnccxUKPekDhXg", appUserID: String(userId) })
  const { settings, dailyStats ,profile} = useSelector((state: RootState) => state.user);
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [myDataModalVisible, setMyDataModalVisible] = useState(profile.age ? false : true);
  
  // Get hydration recommendations including adjusted daily goal
  const hydrationData = getHydrationRecommendations(userState);
  const todayVolume = hydrationData.totalDrankToday;
  const adjustedDailyGoal = hydrationData.dailyGoal;
  const baseGoal = hydrationData.baseGoal;
  const extraWaterNeeded = hydrationData.extraWaterNeeded;
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My H2o today</Text>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.averageText}>From average daily amount*</Text>
            <Text style={styles.averageNote}>
              *{(baseGoal / 1000).toFixed(1)}L base + {extraWaterNeeded > 0 ? `${(extraWaterNeeded / 1000).toFixed(1)}L extra = ${(adjustedDailyGoal / 1000).toFixed(1)}L` : '0L extra'}
            </Text>
          </View>
          <View>
            <Image source={ImagePath.containerIcon} />
            <View style={{ position: "absolute", top: wp(14), right: wp(6) }}>
              <Text style={styles.percentageText}>
                {Math.min(Math.round((todayVolume / adjustedDailyGoal) * 100), 100)}%
              </Text>
            </View>
          </View>

        </View>
      </View>
      <View>
        <Text style={styles.suggestionsText}>Suggestions </Text>
        <View style={styles.suggestionsContainer}>
          <SuggestionCard />
        </View>
      </View>
      <View style={styles.statisticsContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>My statistic</Text>
          <TouchableOpacity onPress={() => setDrinkModalVisible(true)}>
            <Text style={styles.showMore}>Show more</Text>
          </TouchableOpacity>
        </View>
        <WaterStatistics />
      </View>
      {drinkModalVisible && <DrinkTracker modalVisible={drinkModalVisible} setModalVisible={setDrinkModalVisible} />}
      {myDataModalVisible && <MyDataModal modalVisible={myDataModalVisible} setModalVisible={setMyDataModalVisible} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  safeArea: {
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: COLORS.primary,
    fontSize: 35,
    fontWeight: "500",
    fontFamily: FONTS.JostRegular,
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: wp(3),
  },
  columnContainer: {
    flexDirection: "column",
    gap: wp(3),
    width: "60%",
  },
  averageText: {
    color: "rgba(98, 100, 101, 1)",
    fontSize: 20,
    fontWeight: "500",
    fontFamily: FONTS.JostRegular,
  },
  averageNote: {
    color: "rgba(98, 100, 101, 1)",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FONTS.JostRegular,
  },
  suggestionsText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.JostMedium,
    marginHorizontal: wp(8),
    marginTop: wp(3),
  },
  suggestionsContainer: {
    marginTop: wp(1),
    alignItems: "center",
    justifyContent: "center",
    height: wp(30),
    marginLeft: wp(6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    fontFamily: FONTS.JostMedium,
  },
  showMore: {
    fontSize: 16,
    color: 'white',
    fontFamily: FONTS.JostMedium,
  },
  statisticsContainer: {
    marginHorizontal: wp(6),
    marginTop: wp(3),
  },
  percentageText: {
    color: COLORS.white,
    fontSize: 35,
    fontFamily: FONTS.JostMedium,
    fontWeight: "400"
  },
});
export default Dashboard;
