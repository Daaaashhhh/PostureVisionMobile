import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  Text,
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
import CustomText from '../CustomText.js';

const {width} = Dimensions.get('window');

const analysisFeatures = [
  {
    id: '1',
    title: 'Posture Scanner',
    subtitle: 'AI-powered analysis',
    image: CourseCardImage,
    gradient: ['#2b1e4e', '#492785', '#443a94'],
  },
  {
    id: '2',
    title: 'Movement Tracker',
    subtitle: 'Real-time monitoring',
    image: CourseCardImage2,
    gradient: ['#29234d', '#663383', '#953a84'],
  },
];

const analysisWidgets = [
  {
    id: '1',
    label: 'NEW FEATURE',
    title: 'Real-time Posture Detection',
    description:
      'Advanced AI analysis of your posture in real-time. Get instant feedback on your alignment.',
    image: VideoWidgetImage,
  },
  {
    id: '2',
    label: 'ADVANCED ANALYSIS',
    title: 'Gait Analysis',
    description:
      'AI-powered analysis of your walking pattern and body mechanics while moving.',
    image: VideoWidgetImage2,
  },
  {
    id: '3',
    label: 'POPULAR',
    title: 'Workspace Ergonomics',
    description:
      'AI assessment of your desk setup and sitting posture during work hours.',
    image: VideoWidgetImage3,
  },
];

export default function FeaturedScreen({navigation}) {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <CustomText style={styles.featuredText}>Featured</CustomText>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => navigation.navigate('Search')}>
              <Icon name="search" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={ProfileImage} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          {/* Main Course Container with Glassmorphism */}
          <TouchableOpacity
            style={styles.glassContainer}
            onPress={() => navigation.navigate('CourseDetails')}>
            <BlurView
              style={styles.blurView}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.3)"
            />
            <Image source={PostureProgramImage} style={styles.programImage} />
            <CustomText style={styles.courseTitle}>
              Posture Correction Program
            </CustomText>
        
            <CustomText style={styles.courseDescription}>
              Improve your posture with guided exercises, tips, and insights for
              better alignment and well-being.
            </CustomText>
          </TouchableOpacity>

          <CustomText style={styles.recentCoursesText}>
            RECENT PROGRAMS
          </CustomText>

          <View style={styles.courseGrid}>
            {analysisFeatures.map(course => (
              <LinearGradient
                key={course.id}
                colors={course.gradient}
                style={styles.courseCard}>
                <TouchableOpacity
                  style={styles.courseCardContent}
                  onPress={() => navigation.navigate('CourseDetails')}>
                  <Image
                    source={course.image}
                    style={styles.courseCardIcon}
                    resizeMode="contain"
                  />
                  <CustomText style={styles.courseCardText}>
                    {course.title}
                  </CustomText>
                  <CustomText style={styles.courseSubtitle}>
                    {course.subtitle}
                  </CustomText>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
          <CustomText style={styles.recentCoursesText}>
            RECENT TREATMENTS
          </CustomText>
          {/* Video Widget Section */}
          <View style={styles.videoSection}>
            {analysisWidgets.map(widget => (
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
                    <View style={styles.videoContent}>
                    <CustomText style={styles.videoLabel}>
                      {widget.label}
                    </CustomText>
                    <CustomText style={styles.videoTitle}>
                      {widget.title}
                    </CustomText>
                    <CustomText style={styles.videoDescription}>
                      {widget.description}
                    </CustomText>
                    </View>
               
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
  videoContent: {
    paddingHorizontal: 10,
    paddingVertical: 14,
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
    height: 100,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    height: 320,
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Add this line
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
