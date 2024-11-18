import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import VideoThumbnail from '../assets/thumbnail-example1.png';
import Instructor from '../assets/profile-image.png';
import {BlurView} from '@react-native-community/blur';
import BackgroundImage from '../assets/bg-image-coursedetails.png';

const {width} = Dimensions.get('window');
const videoHeight = width * 0.6; // 16:9 aspect ratio

const CourseLesson = ({navigation, route}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const {
    lessonId = '1',
    lessonTitle = 'Analysis Title',
    lessonSubtitle = 'Analysis Description',
    videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  } = route.params || {};

  const handlePlayPress = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
  };

  const handleVideoPress = () => {
    setIsPlaying(!isPlaying);
    setShowPlayButton(!showPlayButton);
  };

  return (
    <ImageBackground
      source={BackgroundImage}
      style={styles.container}
      resizeMode="cover">
      <ScrollView style={styles.scrollView}>
        <View style={styles.videoContainer}>
          {/* Video Player */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleVideoPress}
            style={styles.videoWrapper}>
            {!isPlaying ? (
              <ImageBackground
                source={VideoThumbnail}
                style={styles.thumbnail}
                imageStyle={styles.thumbnailImage}>
                {showPlayButton && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlayPress}>
                    <View style={styles.playButtonInner}>
                      <FontAwesome5
                        name="play"
                        size={30}
                        color="#fff"
                        style={styles.playIcon}
                      />
                      <Text style={styles.duration}>12:08</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </ImageBackground>
            ) : (
              <Video
                source={{uri: videoUrl}}
                style={styles.video}
                controls={true}
                paused={!isPlaying}
                resizeMode="cover"
                onError={error => console.log('Video Error:', error)}
                onLoad={() => console.log('Video loaded')}
              />
            )}

            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}>
                <FontAwesome5 name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Main')}>
                <FontAwesome5 name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Posture Analysis Details with Glassmorphism */}
        <View style={styles.analysisDetails}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisTitle}>{lessonTitle}</Text>
            <Text style={styles.analysisDuration}>Section {lessonId}</Text>
            <Text style={styles.analysisDescription}>{lessonSubtitle}</Text>

            {/* Instructors */}
            <View style={styles.instructors}>
              <View style={styles.avatarContainer}>
                <Image source={Instructor} style={styles.instructorAvatar} />
                <Image
                  source={Instructor}
                  style={[styles.instructorAvatar, styles.secondAvatar]}
                />
              </View>
              <Text style={styles.instructorText}>
                Analyzed by: Dr. Brian Hutcheson and Stephanie Diep
              </Text>
            </View>
          </View>
        </View>

        {/* Actions with separate Glassmorphism */}
        <View style={styles.actionsRow}>
          {/* Favorite Button */}
          <View style={styles.actionContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="white"
            />
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="star" size={20} color="#6B4EFF" />
              <Text style={styles.actionText}>Favorite</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Button */}
          <View style={styles.actionContainer}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
              reducedTransparencyFallbackColor="white"
            />
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="comment" size={20} color="#6B4EFF" />
              <Text style={styles.actionText}>Comments (20)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About This Analysis section - Now outside glassmorphism */}
        <View style={styles.aboutSection}>
          <Text style={styles.descriptionText}>
            Good posture is essential for overall well-being. This analysis helps
            you identify habits that improve your posture, reduce discomfort, and
            enhance your physical health.
          </Text>
          <Text style={styles.descriptionTitle}>About This Analysis</Text>
          <Text style={styles.descriptionText}>
            This posture analysis is unlike any other. We care about helping you build
            sustainable habits and feel your best every day. Whether you work at
            a desk or stay active, these techniques will support your journey to
            better posture.
          </Text>
          <Text style={styles.descriptionText}>
            Our comprehensive analysis makes it easy to understand and improve your posture.
            The recommendations are practical and easy to implement, even for those
            who are new to posture correction.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    height: videoHeight,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    opacity: 0.7,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    alignItems: 'center',
  },
  playIcon: {
    marginLeft: 5,
  },
  duration: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisDetails: {
    backgroundColor: 'transparent',
    borderRadius: 40,
    margin: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  analysisHeader: {
    padding: 20,
  },
  analysisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  analysisDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  analysisDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  instructors: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
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
    marginLeft: 12,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  actionContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 20,
  },
  aboutSection: {
    padding: 20,
    margin: 16,
    marginTop: 8,
  },
});

export default CourseLesson;
