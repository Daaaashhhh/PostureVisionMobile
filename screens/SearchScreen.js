import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {BlurView} from '@react-native-community/blur';

const SearchScreen = ({navigation}) => {
  const quickLinks = ['Posture Correction', 'Ergonomics', 'Movement Practices'];

  const suggestedCourses = [
    {
      title: 'POSTURE MASTERY PROGRAM',
      subtitle: 'Advanced Custom Alignment',
      description: 'DISCOVER PERSONALIZED ROUTINES TO ACHIEVE PROPER POSTURE.',
      icon: require('../assets/swiftui.png'), // Replace with your icon
    },
    {
      title: 'DAILY POSTURE ROUTINE',
      subtitle: 'Maintaining Postural Balance',
      description:
        'LEARN HOW TO STAY ALIGNED THROUGHOUT YOUR DAY WITH SIMPLE TECHNIQUES.',
      icon: require('../assets/swiftui.png'), // Replace with your icon
    },
    {
      title: 'ERGONOMIC WORKSTATION SETUP',
      subtitle: 'Optimizing Your Desk for',
      description: 'CREATE AN ERGONOMIC WORKSPACE THAT SUPPORTS GOOD POSTURE.',
      icon: require('../assets/swiftui.png'), // Replace with your icon
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color="#9F72FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
        />
        <FontAwesome5
          name="search"
          size={20}
          color="rgba(255, 255, 255, 0.6)"
        />
      </View>

      {/* Quick Links */}
      <View style={styles.quickLinksContainer}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        />
        {quickLinks.map((link, index) => (
          <TouchableOpacity key={index} style={styles.quickLinkItem}>
            <View style={styles.quickLinkDot} />
            <Text style={styles.quickLinkText}>{link}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Suggested Section */}
      <View style={styles.suggestedSection}>
        <Text style={styles.sectionTitle}>SUGGESTED</Text>
        <ScrollView>
          {suggestedCourses.map((course, index) => (
            <TouchableOpacity key={index} style={styles.courseCard}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="white"
              />
              <Image source={course.icon} style={styles.courseIcon} />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                <Text style={styles.courseDescription}>
                  {course.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F47',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 44,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9F72FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  quickLinksContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
  },
  quickLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickLinkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  quickLinkText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  suggestedSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
    letterSpacing: 1,
  },
  courseCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseTitle: {
    fontSize: 12,
    color: '#9F72FF',
    letterSpacing: 1,
  },
  courseSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 4,
  },
  courseDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
});

export default SearchScreen;
