import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import BackgroundImage from '../assets/background-image-home.png';
import LinearGradient from 'react-native-linear-gradient';
import CourseCardImage from '../assets/course-card.png';
import CourseCardImage2 from '../assets/course-card-2.png';
import PostureProgramImage from '../assets/posture-program.png';
import ProfileImage from '../assets/profile-image.png';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome';
import VideoWidgetImage from '../assets/thumbnail-example1.png';
import VideoWidgetImage2 from '../assets/thumbnail-example2.png';
import VideoWidgetImage3 from '../assets/thumbnail-example3.png';
import Navigation from '../navigation/Navigation';

const {width} = Dimensions.get('window');

const courses = [
  {
    id: '1',
    title: 'Posture Handbook',
    subtitle: '80 sections - 9 hours',
    image: CourseCardImage,
    gradient: ['#2b1e4e', '#492785', '#443a94'],
  },
  {
    id: '2',
    title: 'Advanced Posture',
    subtitle: '50 sections - 6 hours',
    image: CourseCardImage2,
    gradient: ['#29234d', '#663383', '#953a84'],
  },
];

const videoWidgets = [
  {
    id: '1',
    label: 'NEW VIDEO',
    title: 'Postural Balance & Alignment',
    description:
      'Discover effective techniques to build strength and maintain postural balance throughout the day.',
    image: VideoWidgetImage,
  },
  {
    id: '2',
    label: 'JUST RELEASED',
    title: 'Core Strengthening Exercises',
    description:
      'Learn exercises that will help strengthen your core for better posture and stability.',
    image: VideoWidgetImage2,
  },
  {
    id: '3',
    label: 'POPULAR',
    title: 'Neck and Shoulder Pain Relief',
    description:
      'Get tips on relieving neck and shoulder pain through targeted posture exercises.',
    image: VideoWidgetImage3,
  },
];

export default function FeaturedScreen({navigation}) {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.featuredText}>Featured</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.searchIcon}>
              <Icon name="search" size={16} color="#fff" />
            </TouchableOpacity>
            <Image source={ProfileImage} style={styles.profileIcon} />
          </View>
        </View>

        <View style={styles.container}>
          {/* Main Course Container with Glassmorphism */}
          <TouchableOpacity style={styles.glassContainer}>
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
          </TouchableOpacity>

          <Text style={styles.recentCoursesText}>RECENT COURSES</Text>

          <View style={styles.courseGrid}>
            {courses.map(course => (
              <LinearGradient
                key={course.id}
                colors={course.gradient}
                style={styles.courseCard}>
                <TouchableOpacity style={styles.courseCardContent}>
                  <Image
                    source={course.image}
                    style={styles.courseCardIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.courseCardText}>{course.title}</Text>
                  <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
          <Text style={styles.recentCoursesText}>RECENT TUTORIALS</Text>
          {/* Video Widget Section */}
          <View style={styles.videoSection}>
            {videoWidgets.map(widget => (
              <TouchableOpacity
                key={widget.id}
                style={styles.videoWidget}
                onPress={() =>
                  navigation.navigate('CourseDetails', {videoId: widget.id})
                }>
                <ImageBackground
                  source={widget.image}
                  style={styles.videoWidgetImage}
                  imageStyle={{borderRadius: 20}}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                    style={styles.videoOverlay}>
                    <Text style={styles.videoLabel}>{widget.label}</Text>
                    <Text style={styles.videoTitle}>{widget.title}</Text>
                    <Text style={styles.videoDescription}>
                      {widget.description}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 25,
  },
  featuredText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  programImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    height: 420,
    padding: 24,
    elevation: 5,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  courseTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  courseDetails: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.8,
    letterSpacing: 1,
  },
  courseDescription: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 26,
    opacity: 0.9,
  },
  recentCoursesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 1,
  },
  courseGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  courseCard: {
    width: '48%',
    height: 280,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  courseCardContent: {
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  courseCardIcon: {
    width: '100%',
    height: 100,
    marginBottom: 16,
  },
  courseCardText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  courseSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  videoSection: {
    gap: 16,
    paddingBottom: 32,
  },
  videoWidget: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  videoWidgetImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoOverlay: {
    padding: 24,
    borderRadius: 20,
  },
  videoLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  videoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 34,
  },
  videoDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 24,
  },
});
