import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import IdentityVerificationScreen from '../screens/IdentityVerificationScreen';
import PostureCaptureScreen from '../screens/PostureCaptureScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen.js';
import NotificationScreen from '../screens/NotificationScreen';
import LibraryScreen from '../screens/LibraryScreen';
import CourseDetails from '../screens/CourseDetails.js';
import CourseLesson from '../screens/CourseLesson.js';
import SearchScreen from '../screens/SearchScreen.js';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen.js';
import FavoriteScreen from '../screens/FavoritesScreen.js';
import DownloadsScreen from '../screens/DownloadsScreen.js';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PostureAnalysisScreen from '../screens/PostureAnalysisScreen';
import ExercisePlanScreen from '../screens/ExercisePlanScreen';
import ProgressTrackingScreen from '../screens/ProgressTrackingScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import FindingsReportScreen from '../screens/FindingsReportScreen';
import CalibrationScreen from '../screens/CalibrationScreen';
import RealTimeSessionScreen from '../screens/RealTimeSessionScreen';
import PhotoCalibrationScreen from '../screens/PhotoCalibrationScreen';
import SessionReportScreen from '../screens/SessionReportScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserPreferencesScreen from '../screens/UserPreferencesScreen';
import IconTest from '../screens/IconTest';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <Stack.Screen name="PostureCapture" component={PostureCaptureScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Session') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'Calibrate') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }
          return <Icon name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#96f4ff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Session" component={RealTimeSessionScreen} />
      <Tab.Screen name="Calibrate" component={CalibrationScreen} />
      <Tab.Screen name="Reports" component={SessionReportScreen} />
    </Tab.Navigator>
  );
}

function Navigation() {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="CourseDetails"
          component={CourseDetails}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CourseLesson"
          component={CourseLesson}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FavoriteScreen"
          component={FavoriteScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DownloadsScreen"
          component={DownloadsScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PostureAnalysis"
          component={PostureAnalysisScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ExercisePlan"
          component={ExercisePlanScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProgressTracking"
          component={ProgressTrackingScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Appointments"
          component={AppointmentsScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FindingsReport"
          component={FindingsReportScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserPreferences"
          component={UserPreferencesScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="IconTest"
          component={IconTest}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 84,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  tabItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  tabLabelFocused: {
    color: '#96f4ff',
  },
});

function CustomTabBar({state, descriptors, navigation}) {
  return (
    <View style={[styles.tabBar]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="rgba(15,15,15,0.8)"
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.tabItemsContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const color = isFocused ? '#96f4ff' : 'rgba(255,255,255,0.6)';

          let iconName;
          if (route.name === 'Home') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Session') {
            iconName = isFocused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'Calibrate') {
            iconName = isFocused ? 'scan-circle' : 'scan-circle-outline';
          } else if (route.name === 'Reports') {
            iconName = isFocused ? 'document-text' : 'document-text-outline';
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tabItem,
                isFocused && {backgroundColor: 'rgba(150, 244, 255, 0.1)'},
              ]}
              onPress={onPress}
              activeOpacity={0.7}>
              <Icon
                name={iconName}
                size={24}
                color={color}
              />
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default Navigation;
