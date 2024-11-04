import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import BackgroundImage from '../assets/background-image-home.png';
import LinearGradient from 'react-native-linear-gradient';
import CourseCardImage from '../assets/course-card.png';
import CourseCardImage2 from '../assets/course-card-2.png';
import PostureProgramImage from '../assets/posture-program.png';
import ProfileImage from '../assets/profile-image.png';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const courses = [
  {
    id: '1',
    title: 'Posture Handbook',
    subtitle: '80 sections - 9 hours',
    image: CourseCardImage,
    gradient: ['#432371', '#79398A', '#FF5678'],
  },
  {
    id: '2',
    title: 'Advanced Posture',
    subtitle: '50 sections - 6 hours',
    image: CourseCardImage2,
    gradient: ['#6A4E90', '#BE4BDB', '#FF6DA0'],
  },
];

export default function FeaturedScreen() {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.featuredText}>Featured</Text>
          <View style={styles.iconContainer}>
            <View style={styles.searchIcon}>
              <Icon name="search" size={16} color="#fff" />
            </View>
            <Image source={ProfileImage} style={styles.profileIcon} />
          </View>
        </View>

        <View style={styles.container}>
          {/* Main Course Container with Glassmorphism */}
          <View style={styles.glassContainer}>
            <BlurView
              style={styles.blurView}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.3)"
            />
            <Image source={PostureProgramImage} style={styles.programImage} />
            <Text style={styles.courseTitle}>Posture Correction Program</Text>
            <Text style={styles.courseDetails}>20 SECTIONS - 3 HOURS</Text>
            <Text style={styles.courseDescription}>
              Improve your posture with guided exercises, tips, and insights for
              better alignment and well-being.
            </Text>
          </View>

          <Text style={styles.recentCoursesText}>RECENT COURSES</Text>

          <View style={styles.courseGrid}>
            {courses.map(course => (
              <LinearGradient
                key={course.id}
                colors={course.gradient}
                style={styles.courseCard}>
                <View style={styles.courseCardContent}>
                  <Image source={course.image} style={styles.courseCardIcon} />
                  <Text style={styles.courseCardText}>{course.title}</Text>
                  <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 25,
  },
  featuredText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adjust opacity for a translucent effect
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center', // Center the search icon within the container
    marginRight: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  programImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white background for glass effect
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    height: 400,
    padding: 20,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  courseDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  courseDescription: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  recentCoursesText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  courseGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  courseCard: {
    width: '48%',
    height: 275,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  courseCardContent: {
    padding: 15,
  },
  courseCardIcon: {
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  courseCardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  courseSubtitle: {
    fontSize: 18,
    color: '#fff',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
