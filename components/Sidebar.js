import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const Sidebar = ({navigation, isVisible, onClose}) => {
  const menuItems = [
    {name: 'Dashboard', icon: 'home-outline', route: 'Home'},
    {name: 'Live Session', icon: 'videocam-outline', route: 'Session'},
    {name: 'Calibration', icon: 'scan-circle-outline', route: 'Calibrate'},
    {name: 'Session Reports', icon: 'document-text-outline', route: 'Reports'},
    {name: 'Posture Analysis', icon: 'analytics-outline', route: 'PostureAnalysis'},
    {name: 'Exercise Plan', icon: 'fitness-outline', route: 'ExercisePlan'},
    {name: 'Progress Tracking', icon: 'trending-up-outline', route: 'ProgressTracking'},
    {name: 'Appointments', icon: 'calendar-outline', route: 'Appointments'},
    {name: 'Messages', icon: 'chatbubble-outline', route: 'Messages'},
    {name: 'Findings Report', icon: 'document-text-outline', route: 'FindingsReport'},
    {name: 'Analytics', icon: 'bar-chart-outline', route: 'Analytics'},
  ];

  const bottomMenuItems = [
    {name: 'Settings', icon: 'settings-outline', route: 'Settings'},
    {name: 'User Preferences', icon: 'person-outline', route: 'UserPreferences'},
    {name: 'Logout', icon: 'log-out-outline', route: 'Logout'},
  ];

  const handleNavigation = (route) => {
    if (route === 'Logout') {
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        
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
      </SafeAreaView>
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
    maxWidth: 320,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  menuSection: {
    paddingVertical: 10,
  },
  bottomSection: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default Sidebar; 