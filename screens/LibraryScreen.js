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
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileImage from '../assets/profile-image.png';
import BackgroundImage from '../assets/background-image-library.png';
import {BlurView} from '@react-native-community/blur';
import PlayButton from '../assets/play-button.png';

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
          style={{width: 175, height: 100, borderRadius: 25}}
        />
      </View>
      <View style={styles.courseContent}>
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseSubtitle}>{subtitle}</Text>
      </View>
 
    </LinearGradient>
  </TouchableOpacity>
);

const MenuButton = ({icon, label, navigation, screen}) => (
  <TouchableOpacity
    style={styles.menuButton}
    onPress={() => navigation.navigate(screen)}>
    <Icon name={icon} size={24} color="#fff" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const Analysis = () => (
  <View style={styles.analysisCard}>
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="dark"
      blurAmount={10}
      reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.1)"
    />
    <LinearGradient
      colors={['#FF4B91', '#FF6B99']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={StyleSheet.absoluteFill}
      opacity={0.7}
    />
    <View style={styles.analysisContent}>
      <View>
        <Text style={styles.analysisTitle}>Posture Analysis</Text>
        <Text style={styles.analysisSubtitle}>Analysis</Text>
      </View>
      <View style={styles.analysisIcon}>
        <Icon name="chevron-right" size={24} color="#fff" />
      </View>
    </View>
  </View>
);

const LibraryScreen = ({navigation}) => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Library</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Search')}>
              <Icon name="magnify" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchIcon}
              onPress={() => navigation.navigate('Profile')}>
              <Image source={ProfileImage} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Course Cards */}
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
            title="Analysis"
            subtitle="Advanced Analysis"
            icon="react"
          />
          <CourseCard
            title="Advanced Techniques"
            subtitle="Posture Mastery"
            icon="shield-check"
          />
        </ScrollView>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.1)"
          />
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
        </View>

        {/* Analysis Section */}
        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>ANALYSIS</Text>
          <Analysis />
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
  courseContent: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  courseContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  courseContentContainer: {
    paddingRight: 20,
    gap: 15,
  },
  courseCard: {
    width: Dimensions.get('window').width * 0.5,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    overflow: 'hidden',
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
  analysisSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 15,
    letterSpacing: 1,
  },
  analysisCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  analysisContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  analysisIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LibraryScreen;
