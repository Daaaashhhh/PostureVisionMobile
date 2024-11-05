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
    image: VideoWidgetImage,
  },
  {
    id: '3',
    label: 'POPULAR',
    title: 'Neck and Shoulder Pain Relief',
    description:
      'Get tips on relieving neck and shoulder pain through targeted posture exercises.',
    image: VideoWidgetImage,
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
                <TouchableOpacity>
                  <View style={styles.courseCardContent}>
                    <Image
                      source={course.image}
                      style={styles.courseCardIcon}
                    />
                    <Text style={styles.courseCardText}>{course.title}</Text>
                    <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>

          {/* Video Widget Section */}
          {videoWidgets.map(widget => (
            <TouchableOpacity
              key={widget.id}
              style={styles.videoWidget}
              onPress={() => console.log(`Open video: ${widget.title}`)}>
              <ImageBackground
                source={widget.image}
                style={styles.videoWidgetImage}>
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoLabel}>{widget.label}</Text>
                  <Text style={styles.videoTitle}>{widget.title}</Text>
                  <Text style={styles.videoDescription}>
                    {widget.description}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  programImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
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
  videoWidget: {
    width: '100%',
    height: 450, // Increased height to accommodate more text
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 0,
  },
  videoWidgetImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  videoOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25, // Increased padding for better readability
    paddingVertical: 30,
    borderRadius: 20,
  },
  videoLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  videoTitle: {
    fontSize: 30, // Slightly increased font size for better visibility
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
