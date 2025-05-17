import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const Sidebar = ({navigation, isVisible, onClose}) => {
  const menuItems = [
    {name: 'Dashboard', icon: 'home-outline', route: 'Home'},
    {name: 'Posture Analysis', icon: 'analytics-outline', route: 'PostureAnalysis'},
    {name: 'Exercise Plan', icon: 'fitness-outline', route: 'ExercisePlan'},
    {name: 'Progress Tracking', icon: 'trending-up-outline', route: 'ProgressTracking'},
    {name: 'Appointments', icon: 'calendar-outline', route: 'Appointments'},
    {name: 'Messages', icon: 'chatbubble-outline', route: 'Messages'},
    {name: 'Findings Report', icon: 'document-text-outline', route: 'FindingsReport'},
    {name: 'Calibration', icon: 'settings-outline', route: 'Calibration'},
    {name: 'Real-Time Session', icon: 'videocam-outline', route: 'RealTimeSession'},
    {name: 'Photo Calibration', icon: 'camera-outline', route: 'PhotoCalibration'},
    {name: 'Session Report', icon: 'document-outline', route: 'SessionReport'},
    {name: 'Analytics', icon: 'bar-chart-outline', route: 'Analytics'},
  ];

  const bottomMenuItems = [
    {name: 'Settings', icon: 'settings-outline', route: 'Settings'},
    {name: 'User Preferences', icon: 'person-outline', route: 'UserPreferences'},
    {name: 'Logout', icon: 'log-out-outline', route: 'Logout'},
  ];

  const handleNavigation = (route) => {
    if (route === 'Logout') {
      // Handle logout
      navigation.navigate('Auth');
    } else {
      navigation.navigate(route);
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
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
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.route)}>
              <Icon name={item.icon} size={24} color="#fff" style={styles.icon} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          {bottomMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.route)}>
              <Icon name={item.icon} size={24} color="#fff" style={styles.icon} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  menuSection: {
    paddingVertical: 20,
  },
  bottomSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Sidebar; 