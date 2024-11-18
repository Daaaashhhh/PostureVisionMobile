import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SwiftIcon from '../assets/swiftui.png';
import CourseDetailsBackground from '../assets/course-details-bg.png';
import ProfileImage from '../assets/profile-image.png';
import {BlurView} from '@react-native-community/blur';

const CourseDetails = ({navigation}) => {
  const menuItems = [
    {icon: 'camera', label: 'Start Analysis'},
    {icon: 'chart-line', label: 'View Progress'},
    {icon: 'download', label: 'Save Results'},
    {icon: 'share', label: 'Share Report'},
  ];

  const analysisItems = [
    {
      id: '1',
      title: 'Full Body Posture Analysis',
      subtitle: 'AI-POWERED FULL BODY ALIGNMENT ASSESSMENT...',
      icon: SwiftIcon,
      analysisType: 'fullBody',
    },
    {
      id: '2',
      title: 'Spine Alignment Check',
      subtitle: 'ADVANCED SPINE CURVATURE ANALYSIS',
      icon: SwiftIcon,
      analysisType: 'spine',
    },
    // ... more analysis types
  ];

  const renderCourseItem = ({item}) => (
    <TouchableOpacity
      style={styles.courseItem}
      onPress={() => {
        navigation.navigate('CourseLesson', {
          lessonId: item.id,
          lessonTitle: item.title,
          lessonSubtitle: item.subtitle,
          videoUrl: item.videoUrl,
        });
      }}>
      <Image source={item.icon} style={styles.itemIcon} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={CourseDetailsBackground}
        style={styles.headerBackground}
        imageStyle={styles.backgroundImage}>
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <FontAwesome5 name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <FontAwesome5 name="times" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
          />
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <FontAwesome5 name={item.icon} size={20} color="#fff" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Course Title Section with Glassmorphism */}
        <View style={styles.courseHeaderContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>
              <Text style={styles.purpleText}>Posture Improvement</Text> for a
              Healthier Life
            </Text>
            <Text style={styles.courseSubtitle}>20 SESSIONS - 3 HOURS</Text>
            <Text style={styles.courseDescription}>
              Discover techniques to improve your posture and enhance your overall
              well-being.
            </Text>

            {/* Instructors */}
            <View style={styles.instructors}>
              <View style={styles.avatarContainer}>
                <Image source={ProfileImage} style={styles.instructorAvatar} />
                <Image
                  source={ProfileImage}
                  style={[styles.instructorAvatar, styles.secondAvatar]}
                />
              </View>
              <Text style={styles.instructorText}>
                Taught by Dr. Jane Smith and Dr. John Doe
              </Text>
            </View>
          </View>
        </View>

        {/* Course Items */}
        <Text style={styles.recentCoursesText}>Analysis</Text>
        <ScrollView style={styles.courseItemsContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.courseItems}>
            {analysisItems.map((item, index) => renderCourseItem({item, index}))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F47',
  },
  headerBackground: {
    flex: 1,
    padding: 16,
  },
  backgroundImage: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  recentCoursesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '50%',
    borderRadius: 20,
    padding: 8,
    marginTop: 20,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  courseHeaderContainer: {
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  courseHeader: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  purpleText: {
    color: '#9F72FF',
  },
  courseSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    letterSpacing: 1,
  },
  courseDescription: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    lineHeight: 24,
  },
  instructors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondAvatar: {
    marginLeft: -12,
  },
  instructorText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  courseItemsContainer: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  courseItems: {
    padding: 8,
  },
  courseItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemIcon: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemContent: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  itemSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default CourseDetails;
