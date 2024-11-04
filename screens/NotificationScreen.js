import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from '../assets/background-image-notification.png';
import ProfileImage from '../assets/profile-image.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const notifications = [
  {
    id: '1',
    title: 'Posture Mastery',
    description:
      'Advanced custom alignment. Learn the secrets to perfect alignment with advanced techniques and routines.',
    icon: 'heartbeat',
  },
  {
    id: '2',
    title: 'Daily Posture Check',
    description:
      'Maintaining balance throughout your day. Tips and exercises to keep your posture in check every hour.',
    icon: 'check-circle',
  },
  {
    id: '3',
    title: 'Ergonomics Advanced',
    description:
      'Optimized workstation setup. Set up your desk to prevent slouching and improve posture at work.',
    icon: 'desktop',
  },
  {
    id: '4',
    title: 'Movement for Designers',
    description: 'Interactive stretch breaks.',
    icon: 'bicycle',
  },
];

const GlassmorphicCard = ({children}) => (
  <LinearGradient
    colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    style={styles.gradientCard}>
    <View style={styles.glassContent}>{children}</View>
  </LinearGradient>
);

export default function NotificationScreen() {
  const HeaderBackground = () => (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
      style={styles.headerGradient}
    />
  );

  return (
    <ImageBackground
      source={BackgroundImage}
      style={styles.background}
      blurRadius={Platform.OS === 'android' ? 20 : 0}>
      <View style={styles.overlay}>
        <View style={styles.headerContainer}>
          <HeaderBackground />
          <Text style={styles.headerText}>Notifications</Text>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.searchIconGradient}>
              <Icon name="search" size={16} color="#fff" />
            </LinearGradient>
            <Image source={ProfileImage} style={styles.profileIcon} />
          </View>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationList}
          renderItem={({item}) => (
            <GlassmorphicCard>
              <View style={styles.iconWrapper}>
                <Icon
                  name={item.icon}
                  size={24}
                  color="#fff"
                  style={styles.notificationIcon}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>
                  {item.description}
                </Text>
              </View>
            </GlassmorphicCard>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 43, 61, 0.3)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
  notificationList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  gradientCard: {
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  glassContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glass effect background
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});
