import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import VideoThumbnail from '../assets/thumbnail-example1.png';
import Instructor from '../assets/profile-image.png';

const {width} = Dimensions.get('window');
const videoHeight = width * 0.6; // 16:9 aspect ratio

const CourseLesson = ({navigation, route}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const {
    lessonId = '1',
    lessonTitle = 'Lesson Title',
    lessonSubtitle = 'Lesson Description',
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
    <View style={styles.container}>
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
              source={{uri: 'YOUR_VIDEO_URL'}}
              style={styles.video}
              controls={true}
              paused={!isPlaying}
              resizeMode="cover"
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

      {/* Course Details */}
      <View style={styles.courseDetails}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle}>{lessonTitle}</Text>
          <Text style={styles.courseDuration}>Section {lessonId}</Text>
          <Text style={styles.courseDescription}>{lessonSubtitle}</Text>

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
              Taught by: Dr. Brian Hutcheson and Stephanie Diep
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="star" size={20} color="#6B4EFF" />
              <Text style={styles.actionText}>Favorite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome5 name="comment" size={20} color="#6B4EFF" />
              <Text style={styles.actionText}>Comments (20)</Text>
            </TouchableOpacity>
          </View>

          {/* Course Description */}
          <Text style={styles.descriptionTitle}>About This Course</Text>
          <Text style={styles.descriptionText}>
            Good posture is essential for overall well-being. This program helps
            you build habits that improve your posture, reduce discomfort, and
            enhance your physical health.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F47',
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
  courseDetails: {
    flex: 1,
    backgroundColor: '#1F1F47',
  },
  courseHeader: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  courseDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  courseDescription: {
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: '#6B4EFF',
    fontSize: 16,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
});

export default CourseLesson;
