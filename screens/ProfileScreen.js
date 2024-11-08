import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from '../assets/background-image-signup.png';

const ProfileScreen = () => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(26,26,26,0.1)', 'rgba(13,13,13,0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView>
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Connected Posture</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Total Posture</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Posture Mastery</Text>
              <Text style={styles.statLabel}>Certifications</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="person-outline" size={24} color="#96f4ff" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Icon name="chevron-forward" size={24} color="#96f4ff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="book-outline" size={24} color="#96f4ff" />
              <Text style={styles.menuText}>My Posture Courses</Text>
              <Icon name="chevron-forward" size={24} color="#96f4ff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="ribbon-outline" size={24} color="#96f4ff" />
              <Text style={styles.menuText}>Posture Certifications</Text>
              <Icon name="chevron-forward" size={24} color="#96f4ff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="settings-outline" size={24} color="#96f4ff" />
              <Text style={styles.menuText}>Settings</Text>
              <Icon name="chevron-forward" size={24} color="#96f4ff" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
              <Icon name="log-out-outline" size={24} color="#FF4444" />
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              <Icon name="chevron-forward" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#96f4ff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#96f4ff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#FFFFFF',
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
});

export default ProfileScreen;
