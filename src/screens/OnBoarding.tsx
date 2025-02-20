import React, { useState } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { COLORS, FONTS } from "../config/Constants";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateOnBoarding } from "../redux/userSlice";
import ImagePath from "../assets/ImagePath";


const OnBoarding = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const onboardingSteps = [
    {
      title: "Your body needs water!",
      description: "Add and follow you daily water amount to achieve goal. ",
      image: ImagePath.onbording1,
    },
    {
      title: "Personalised Calculations!",
      description: "After some drinks you body need more water, MyH2o will calculate it. ",
      image: ImagePath.onbording2,
    },
    {
      title: "Daily Reminders",
      description: "This will keep you updated about your daily H2o",
      image: ImagePath.onBoarding3,
    },
  ];

  const handleNextStep = () => {
    if (activeStepIndex < onboardingSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      dispatch(updateOnBoarding());
      navigation.navigate("MyTabs");
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.imageWrapper}>
        <Image source={onboardingSteps[activeStepIndex].image} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.stepTitle}>{onboardingSteps[activeStepIndex].title}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{onboardingSteps[activeStepIndex].description}</Text>
      </View>
      <TouchableOpacity onPress={handleNextStep} style={styles.nextButton}>
        <Text style={styles.buttonLabel}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    backgroundColor: COLORS.white,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: wp(5),
    marginBottom: wp(5),
  },
  titleContainer: {
    gap: wp(2),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: wp(3),
  },
  stepTitle: {
    fontSize: 30,
    fontWeight: "400",
    color: "#626465",
    fontFamily: FONTS.JostRegular,
  },
  nextButton: {
    backgroundColor: "#6FC6D2",
    alignItems: "center",
    marginHorizontal: wp(5),
    borderRadius: wp(10),
    paddingVertical: wp(3),
    marginVertical: wp(5),
  },
  buttonLabel: {
    fontFamily: FONTS.JostRegular,
    fontWeight: "400",
    fontSize: 25,
    color: "#FFFFFF",
  },
  descriptionContainer: {
    marginHorizontal: wp(6),
    marginBottom: wp(3),
  },
  descriptionText: {
    fontFamily: FONTS.JostRegular,
    fontSize: 20,
    color: "#626465",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default OnBoarding;
