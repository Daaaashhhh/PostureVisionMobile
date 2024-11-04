import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import CourseCardImage from '../assets/course-card.png';
import CourseCardImage2 from '../assets/course-card-2.png';
import ProfileImage from '../assets/profile-image.png';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('window');

const recentCourses = [
  {
    id: '1',
    title: 'Posture Mastery',
    subtitle: 'Advanced Techniques for Proper Alignment',
    image: CourseCardImage,
  },
  {
    id: '2',
    title: 'Postural Concurrency',
    subtitle: 'Achieving Balanced Posture Throughout the Day',
    image: CourseCardImage2,
  },
  {
    id: '3',
    title: 'Posture Mastery',
    subtitle: 'Advanced Techniques for Proper Alignment',
    image: CourseCardImage,
  },
];

const topics = [
  {id: '1', name: 'Posture Development', icon: 'heartbeat'},
  {id: '2', name: 'Body Alignment Design', icon: 'ruler-combined'},
  {id: '3', name: 'Wellness Optimization', icon: 'spa'},
];

const popularCourses = [
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

export default function ExploreScreen() {
  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.featuredText}>Recent</Text>
          <View style={styles.iconContainer}>
            <View style={styles.searchIcon}>
              <Icon name="search" size={16} color="#fff" />
            </View>
            <Image source={ProfileImage} style={styles.profileIcon} />
          </View>
        </View>

        {/* Recent Courses - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentCoursesContainer}>
          {recentCourses.map(course => (
            <View key={course.id} style={styles.recentCourseCardContainer}>
              <View style={styles.recentCourseCardContent}>
                <Image
                  source={course.image}
                  style={styles.recentCourseCardIcon}
                />
                <Text style={styles.recentCourseCardText}>{course.title}</Text>
                <Text style={styles.recentCourseSubtitle}>
                  {course.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Topics */}
        <Text style={styles.sectionTitle}>Topics</Text>
        <View style={styles.topicsContainer}>
          {topics.map((topic, index) => (
            <View key={topic.id} style={styles.topicItem}>
              <Icon
                name={topic.icon}
                size={24}
                color="#A3A3C2"
                style={styles.topicIcon}
              />
              <Text style={styles.topicText}>{topic.name}</Text>
              {index < topics.length - 1 && (
                <View style={styles.topicDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Popular Courses */}
        <Text style={styles.sectionTitle}>Popular</Text>
        <View style={styles.popularCoursesContainer}>
          {popularCourses.map(course => (
            <LinearGradient
              key={course.id}
              colors={course.gradient}
              style={styles.popularCourseCard}>
              <View style={styles.popularCourseCardContent}>
                <Image
                  source={course.image}
                  style={styles.popularCourseCardIcon}
                />
                <Text style={styles.popularCourseCardText}>{course.title}</Text>
                <Text style={styles.popularCourseSubtitle}>
                  {course.subtitle}
                </Text>
              </View>
            </LinearGradient>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#25254b',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A3A3C2',
    marginHorizontal: 20,
    marginVertical: 10,
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
    borderRadius: 20,
  },

  /* Recent Courses Styles */
  recentCoursesContainer: {
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  recentCourseCardContainer: {
    width: width * 0.6,
    marginRight: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
  recentCourseCardContent: {
    padding: 15,
    alignItems: 'center',
  },
  recentCourseCardIcon: {
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  recentCourseCardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  recentCourseSubtitle: {
    fontSize: 14,
    color: '#A3A3C2',
  },

  /* Popular Courses Styles */
  popularCoursesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  popularCourseCard: {
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
  popularCourseCardContent: {
    padding: 15,
    alignItems: 'center',
  },
  popularCourseCardIcon: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  popularCourseCardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  popularCourseSubtitle: {
    fontSize: 14,
    color: '#fff',
  },

  /* Topics Styles */
  topicsContainer: {
    backgroundColor: '#1e1e36',
    borderRadius: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    borderWidth: 0.8,
    borderColor: '#ffffff',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  topicIcon: {
    marginRight: 15,
  },
  topicText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    textAlignVertical: 'center',
  },
  topicDivider: {
    height: 1,
    backgroundColor: '#A3A3C2',
    alignSelf: 'stretch',
    marginVertical: 8,
  },
});
