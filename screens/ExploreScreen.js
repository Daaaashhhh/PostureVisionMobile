import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import CourseCardImage from '../assets/course-card.png';
import CourseCardImage2 from '../assets/course-card-2.png';
import ProfileImage from '../assets/profile-image.png';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PlayButton from '../assets/play-button.png';

const {width} = Dimensions.get('window');

const postureSections = [
  {
    id: '1',
    title: 'Real-time Analysis',
    subtitle: 'AI-powered posture tracking',
    image: CourseCardImage,
    gradient: ['#432371', '#79398A', '#FF5678'],
  },
  {
    id: '2',
    title: 'Gait Analysis',
    subtitle: 'Walking pattern assessment',
    image: CourseCardImage2,
    gradient: ['#6A4E90', '#BE4BDB', '#FF6DA0'],
  },
  {
    id: '3',
    title: 'Ergonomic Analysis',
    subtitle: 'Workspace posture evaluation',
    image: CourseCardImage,
    gradient: ['#432371', '#79398A', '#FF5678'],
  },
];

const analysisFeatures = [
  {id: '1', name: 'Posture Detection', icon: 'camera'},
  {id: '2', name: 'Movement Analysis', icon: 'running'},
  {id: '3', name: 'Progress Tracking', icon: 'chart-line'},
];

const popularAnalyses = [
  {
    id: '1',
    title: 'Spine Alignment',
    subtitle: 'Real-time AI analysis',
    image: CourseCardImage,
    gradient: ['#2b1e4e', '#492785', '#443a94'],
  },
  {
    id: '2',
    title: 'Neck Posture',
    subtitle: 'Forward head detection',
    image: CourseCardImage2,
    gradient: ['#29234d', '#663383', '#953a84'],
  },
];
const MenuButton = ({icon, label, navigation, screen}) => (
  <TouchableOpacity
    style={styles.menuButton}
    onPress={() => navigation.navigate(screen)}>
    <Icon name={icon} size={24} color="#fff" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);
const CourseCard = ({title, subtitle, icon, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.courseCard}>
      <View
        style={[
          styles.iconContainer,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <Image
          source={PlayButton}
          style={{width: 250, height: 125, borderRadius: 25}}
        />
      </View>
      <View style={styles.courseContent}>
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function ExploreScreen({navigation}) {
  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.featuredText}>Explore</Text>
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

        {/* Recent Courses - Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.courseContainer}
          contentContainerStyle={styles.courseContentContainer}>
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
          <CourseCard
            title="Advanced Techniques"
            subtitle="Posture Mastery"
            icon="shield-check"
          />
        </ScrollView>

        {/* Quick Actions */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.menuContainer}>
          <MenuButton
            icon="history"
            label="History"
            navigation={navigation}
            screen="HistoryScreen"
          />
          <MenuButton
            icon="star"
            label="Favorites"
            navigation={navigation}
            screen="FavoriteScreen"
          />
          <MenuButton
            icon="download"
            label="Downloads"
            navigation={navigation}
            screen="DownloadsScreen"
          />
        </LinearGradient>

        {/* Popular Courses */}
        <Text style={styles.sectionTitle}>Popular Treatment</Text>
        <View style={styles.popularCoursesContainer}>
          {popularAnalyses.map(course => (
            <LinearGradient
              key={course.id}
              colors={course.gradient}
              style={styles.popularCourseCard}>
              <TouchableOpacity
                style={styles.popularCourseCardContent}
                onPress={() => navigation.navigate('CourseDetails')}>
                <Image
                  source={course.image}
                  style={styles.popularCourseCardIcon}
                />
                <Text style={styles.popularCourseCardText}>{course.title}</Text>
                <Text style={styles.popularCourseSubtitle}>
                  {course.subtitle}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#24244a',
  },
  scrollViewContent: {
    paddingBottom: 100,
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
    letterSpacing: 0.5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    gap: 12,
  },
  courseContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  courseCard: {
    width: Dimensions.get('window').width * 0.7,
   
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
  courseContentContainer: {
    paddingRight: 20,
    gap: 15,
  },
  courseContainer: {
    paddingLeft: 20,
    marginBottom: 20,
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
  recentCoursesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  recentCourseCard: {
    width: width * 0.7,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  recentCourseCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  recentCourseCardIcon: {
    width: '100%',
    height: 140,
    borderRadius: 15,
    marginBottom: 15,
  },
  recentCourseCardText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  recentCourseSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  popularCoursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
  popularCourseCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  popularCourseCardContent: {
    padding: 15,
    alignItems: 'center',
  },
  popularCourseCardIcon: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
  },
  popularCourseCardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  popularCourseSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
