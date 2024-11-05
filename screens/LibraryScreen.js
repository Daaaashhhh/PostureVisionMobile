import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileImage from '../assets/profile-image.png';
import BackgroundImage from '../assets/background-image-library.png';

const CourseCard = ({title, subtitle, icon}) => (
  <LinearGradient
    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    style={styles.courseCard}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.courseTitle}>{title}</Text>
    <Text style={styles.courseSubtitle}>{subtitle}</Text>
  </LinearGradient>
);

const MenuButton = ({icon, label}) => (
  <TouchableOpacity style={styles.menuButton}>
    <Icon name={icon} size={24} color="#fff" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const Certificate = () => (
  <LinearGradient
    colors={['#FF4B91', '#FF6B99']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    style={styles.certificateCard}>
    <View style={styles.certificateContent}>
      <View>
        <Text style={styles.certificateTitle}>SwiftUI for iOS 15</Text>
        <Text style={styles.certificateSubtitle}>Certificate</Text>
      </View>
      <View style={styles.certificateIcon}>
        <Icon name="chevron-right" size={24} color="#fff" />
      </View>
    </View>
  </LinearGradient>
);

const LibraryScreen = () => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Library</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="magnify" size={20} color="#fff" />
            </TouchableOpacity>
            <Image source={ProfileImage} style={styles.profileIcon} />
          </View>
        </View>

        {/* Course Cards */}
        <View style={styles.courseContainer}>
          <CourseCard
            title="Comprehensive insights"
            subtitle="Tailored posture programs"
            icon="chart-line"
          />
          <CourseCard
            title="Styled Components"
            subtitle="React Advanced"
            icon="react"
          />
        </View>

        {/* Menu Section */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.menuContainer}>
          <MenuButton icon="history" label="History" />
          <MenuButton icon="star" label="Favorites" />
          <MenuButton icon="download" label="Downloads" />
        </LinearGradient>

        {/* Certificates Section */}
        <View style={styles.certificatesSection}>
          <Text style={styles.sectionTitle}>CERTIFICATES</Text>
          <Certificate />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  courseContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  courseCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  courseTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  courseSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
  },
  certificatesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 15,
    letterSpacing: 1,
  },
  certificateCard: {
    borderRadius: 20,
    padding: 20,
  },
  certificateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certificateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  certificateSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  certificateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LibraryScreen;
