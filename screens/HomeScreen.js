import React, {useState, useEffect} from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import VideoWidgetImage from '../assets/thumbnail-example1.png';
import VideoWidgetImage2 from '../assets/thumbnail-example2.png';
import VideoWidgetImage3 from '../assets/thumbnail-example3.png';
import CustomText from '../CustomText.js';
import WebRTCViewer from './WebRTCViewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from '../components/Sidebar';

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

const DashboardOverview = ({navigation}) => {
  const [showExtensionCTA, setShowExtensionCTA] = useState(true);
  const [showWebRTC, setShowWebRTC] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Placeholder data
  const clientName = "John Doe";
  const clientDetails = "Male, 34";
  const sessionId = "PA-0723";
  const postureMetrics = [
    {
      id: 1,
      name: 'Key findings',
      value: 'Example Text',
      status: 'Good Alignment?',
      trend: '+3% from last session',
      chartType: 'score',
    },
    {
      id: 2,
      name: 'Corrective Actions',
      value: 'Example Text',
      unit: '°',
      status: 'Slightly Forward',
      trend: '-2° from last session',
      chartType: 'bar',
    },
    {
      id: 3,
      name: 'Stability Index',
      value: 'NUMBER',
      unit: '',
      status: '',
      trend: 'Improved',
      chartType: 'status',
    },
    {
      id: 4,
      name: 'Curvature Breakdown',
      value: 'GRAPHIC',
      unit: '°',
      status: 'Normal Range',
      trend: 'Stable',
      chartType: 'bar',
    },
  ];

  useEffect(() => {
    const checkExtensionStatus = async () => {
      try {
        const extensionInstalled = await AsyncStorage.getItem('postureVisionExtensionInstalled');
        const ctaDismissed = await AsyncStorage.getItem('hideExtensionCTA');
        
        if (extensionInstalled === 'true' || ctaDismissed === 'true') {
          setShowExtensionCTA(false);
        }
      } catch (error) {
        console.error('Error checking extension status:', error);
      }
    };

    checkExtensionStatus();
  }, []);

  const handleDismissCTA = async () => {
    try {
      await AsyncStorage.setItem('hideExtensionCTA', 'true');
      setShowExtensionCTA(false);
    } catch (error) {
      console.error('Error dismissing CTA:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar
        navigation={navigation}
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsSidebarVisible(true)}>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerText}>Dashboard Overview</CustomText>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}>
              <Icon name="search" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Profile')}>
              <Icon name="person" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {showExtensionCTA && (
          <View style={styles.ctaContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
            />
            <Text style={styles.ctaText}>
              Enhance your experience with the PostureVision Chrome Extension for real-time feedback.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('ExtensionDownload')}>
                <Text style={styles.ctaButtonText}>Get Extension</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={handleDismissCTA}>
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.clientInfoBar}>
          <Text style={styles.clientInfoText}>
            Client: <Text style={styles.clientName}>{clientName}</Text>
          </Text>
          <Text style={styles.clientInfoText}>
            {clientDetails} - Session ID: #{sessionId}
          </Text>
        </View>

        <View style={styles.mainVisualArea}>
          <BlurView
            style={styles.blurView}
            blurType="dark"
            blurAmount={20}
          />
          {!showWebRTC ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setShowWebRTC(true)}>
              <CustomText style={styles.startButtonText}>
                Start Posture Analysis
              </CustomText>
            </TouchableOpacity>
          ) : (
            <WebRTCViewer onStop={() => setShowWebRTC(false)} />
          )}
        </View>
          {/* Recent Courses Section
          
        <CustomText style={styles.recentCoursesText}>
          RECENT COURSES
        </CustomText>

        <View style={styles.courseGrid}>
          {courses.map(course => (
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
          RECENT TUTORIALS
        </CustomText>
       
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
                  <CustomText style={styles.videoLabel}>
                    {widget.label}
                  </CustomText>
                  <CustomText style={styles.videoTitle}>
                    {widget.title}
                  </CustomText>
                  <CustomText style={styles.videoDescription}>
                    {widget.description}
                  </CustomText>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
   */}
        <View style={styles.metricsGrid}>
          {postureMetrics.map(metric => (
            <View key={metric.id} style={styles.metricCard}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
              />
              <CustomText style={styles.metricName}>{metric.name}</CustomText>
              <View style={styles.metricValue}>
                <CustomText style={styles.valueText}>
                  {metric.value}
                  {metric.unit && (
                    <CustomText style={styles.unitText}>{metric.unit}</CustomText>
                  )}
                </CustomText>
              </View>
              {metric.status && (
                <CustomText style={styles.metricStatus}>{metric.status}</CustomText>
              )}
              {metric.trend && (
                <CustomText style={styles.metricTrend}>{metric.trend}</CustomText>
              )}
              <View style={styles.metricChart}>
                {metric.chartType === 'bar' && (
                  <View style={styles.barChart}>
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                  </View>
                )}
                {metric.chartType === 'score' && (
                  <View style={styles.scoreChart} />
                )}
                {metric.chartType === 'status' && (
                  <View style={styles.statusChart}>
                    <Icon name="checkmark" size={20} color="#4CAF50" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaContainer: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  ctaText: {
    color: '#FFFFFF',
    marginBottom: 10,
  },
  ctaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#FFFFFF',
  },
  dismissButton: {
    padding: 5,
  },
  clientInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  clientInfoText: {
    color: '#FFFFFF',
  },
  clientName: {
    fontWeight: 'bold',
  },
  mainVisualArea: {
    height: 220,
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  startButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  metricCard: {
    width: (width - 40) / 2,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  metricValue: {
    marginBottom: 5,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unitText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  metricStatus: {
    color: '#4CAF50',
    marginBottom: 5,
  },
  metricTrend: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 12,
    marginBottom: 10,
  },
  metricChart: {
    height: 50,
    justifyContent: 'center',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 40,
  },
  bar: {
    width: '20%',
    backgroundColor: '#4CAF50',
    height: '60%',
    borderRadius: 2,
  },
  scoreChart: {
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  statusChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DashboardOverview;
