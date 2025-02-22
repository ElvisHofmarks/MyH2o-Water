import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS, FONTS } from '../config/Constants';
import ImagePath from '../assets/ImagePath';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import SuggestionCard from '../components/SuggestionCard';
import WaterStatistics from '../components/WaterStatistics';

const Dashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My H2o today</Text>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.averageText}>From average daily amount*</Text>
            <Text style={styles.averageNote}>*2.3L calculated by your data</Text>
          </View>
          <Image source={ImagePath.containerIcon} />
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
          <Text style={styles.showMore}>Show more</Text>
        </View>
        <WaterStatistics />
      </View>
    </View>
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
});
export default Dashboard;