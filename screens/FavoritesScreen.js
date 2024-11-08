import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PlayButton from '../assets/play-button.png';

const {width} = Dimensions.get('window');

const MenuButton = ({icon, label}) => (
  <TouchableOpacity style={styles.menuButton}>
    <Icon name={icon} size={24} color="#fff" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function FavoritesScreen({navigation}) {
  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.featuredText}>Favorites</Text>
        </View>

        {/* Quick Actions */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.menuContainer}>
          <MenuButton icon="history" label="History" />
          <MenuButton icon="star" label="Favorites" />
          <MenuButton icon="download" label="Downloads" />
        </LinearGradient>

        {/* Content for Favorites */}
        <Text style={styles.sectionTitle}>Your Favorites</Text>
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recently Watched</Text>
          <View style={styles.videoList}>
            <TouchableOpacity style={styles.videoItem}>
              <Image source={PlayButton} style={styles.videoThumbnail} />
              <View style={styles.videoDetails}>
                <Text style={styles.videoTitle}>
                  Posture Correction Program
                </Text>
                <Text style={styles.videoDuration}>3 hours 20 minutes</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoItem}>
              <Image source={PlayButton} style={styles.videoThumbnail} />
              <View style={styles.videoDetails}>
                <Text style={styles.videoTitle}>
                  Advanced Posture Techniques
                </Text>
                <Text style={styles.videoDuration}>2 hours 15 minutes</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoItem}>
              <Image source={PlayButton} style={styles.videoThumbnail} />
              <View style={styles.videoDetails}>
                <Text style={styles.videoTitle}>
                  Neck and Shoulder Pain Relief
                </Text>
                <Text style={styles.videoDuration}>1 hour 45 minutes</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  historyContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  videoList: {
    flexDirection: 'column',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  videoThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 10,
  },
  videoDetails: {
    marginLeft: 10,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
