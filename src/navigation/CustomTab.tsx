import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Image,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../config/Constants';
import ImagePath from '../assets/ImagePath';
interface CustomTabProps extends BottomTabBarProps {}

const CustomTab: React.FC<CustomTabProps> = ({state, navigation}) => {
  return (
    <View style={{backgroundColor: COLORS.primary}}>
      <View style={styles.container}>
        <View style={styles.mainView}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const icon = route.name === 'Dashboard' ? ImagePath.homeIcon : route.name === 'AddDrink' ? ImagePath.addIcon : ImagePath.SettingsIcon;
            const onPress = () => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                onPress={onPress}
                activeOpacity={1}
                key={route.name}>
                <View style={styles.iconContainer}>
                  <Image source={icon} style={{opacity: isFocused ? 1 : 0.5}} />
                  <Text
                    style={[
                      styles.tabText,
                      {
                        opacity: isFocused ? 1 : 0.5,
                      },
                    ]}>
                    {route.name === 'Dashboard'
                      ? 'Home'
                      : route.name === 'AddDrink'
                      ? 'Add'
                      : 'Settings'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CustomTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingBottom: Platform.OS === 'ios' ? (Platform.constants?.systemName === "iPadOS" ? wp(2) : wp(7)) : wp(7),
  },
  mainView: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    borderRadius: wp(5),
    backgroundColor: COLORS.white,
    paddingVertical: wp(3.2),
    justifyContent: 'space-between',
    paddingHorizontal: wp(8),
  },
  tabButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    alignItems: 'center',
    gap: wp(0.2),
    justifyContent: 'center',
    width: wp(15),
  },
  tabText: {
    fontWeight: '500',
    fontSize: 15,
    fontFamily: FONTS.JostRegular,
    color: COLORS.primary,
  },
});
