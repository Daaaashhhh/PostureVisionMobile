import React, {useState, useEffect, useMemo} from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Define a more structured list of searchable items
  const allSearchableItems = useMemo(() => [
    // App Features/Screens
    { id: 'feat1', title: 'Start Live Session', type: 'Feature', navigateTo: 'Session' },
    { id: 'feat2', title: 'Calibrate Posture', type: 'Feature', navigateTo: 'Calibrate' },
    { id: 'feat3', title: 'View Session Reports', type: 'Feature', navigateTo: 'Reports' },
    { id: 'feat4', title: 'My Profile', type: 'Screen', navigateTo: 'Profile' },
    { id: 'feat5', title: 'Settings', type: 'Screen', navigateTo: 'Settings' },
    { id: 'feat6', title: 'Posture Analysis Screen', type: 'Screen', navigateTo: 'PostureAnalysis' },

   
    {
      id: 'content2',
      title: 'Daily Posture Routine',
      type: 'Routine',
      subtitle: 'Maintaining Postural Balance',
      description: 'Learn how to stay aligned throughout your day with simple techniques.',
      icon: require('../assets/swiftui.png'),
      navigateTo: 'CourseDetails',
      navParams: { courseId: 'C002' }
    },
    {
      id: 'content3',
      title: 'Ergonomic Workstation Setup',
      type: 'Guide',
      subtitle: 'Optimizing Your Desk',
      description: 'Create an ergonomic workspace that supports good posture.',
      icon: require('../assets/swiftui.png'),
      navigateTo: 'CourseDetails',
      navParams: { courseId: 'C003' }
    },
   
  ], []); // Empty dependency array means it's created once

  // Quick Links - can also be derived from allSearchableItems or be static
  const quickLinks = useMemo(() => [
    { title: 'Start Live Session', navigateTo: 'Session' },
    { title: 'View Reports', navigateTo: 'Reports' },
    { title: 'Calibrate Now', navigateTo: 'Calibrate' },
  ], []);

  // suggestedCourses can be a subset of allSearchableItems or a specific list
  const suggestedContent = useMemo(() => {
    // Define a specific list for initial suggestions when search is empty
    // This combines key actions and some featured content
    const initialSuggestions = [
      allSearchableItems.find(item => item.id === 'feat1'), // Start Live Session
      allSearchableItems.find(item => item.id === 'feat2'), // Calibrate Posture
      allSearchableItems.find(item => item.id === 'feat3'), // View Session Reports
      allSearchableItems.find(item => item.id === 'content1'), // Posture Mastery Program
      allSearchableItems.find(item => item.id === 'content4'), // Understanding Forward Head Posture
    ].filter(Boolean); // .filter(Boolean) removes any undefined if an ID wasn't found
    return initialSuggestions;
  } , [allSearchableItems]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]); // No query, no results (or show suggestions/history)
      return;
    }

    const filteredResults = allSearchableItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(filteredResults);
  }, [searchQuery, allSearchableItems]);

  const handleNavigation = (navigateTo, navParams) => {
    if (navigateTo) {
      navigation.navigate(navigateTo, navParams);
    } else {
      console.warn('Navigation target not specified for this item.');
    }
  };

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
          placeholder="Search for reports, exercises, tips..."
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
          <TouchableOpacity key={index} style={styles.quickLinkItem} onPress={() => handleNavigation(link.navigateTo)}>
            <View style={styles.quickLinkDot} />
            <Text style={styles.quickLinkText}>{link.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Suggested Section / Search Results Section */}
      <View style={styles.suggestedSection}>
        <Text style={styles.sectionTitle}>
          {searchQuery.trim() === '' ? 'SUGGESTED' : `RESULTS FOR "${searchQuery.toUpperCase()}"`}
        </Text>
        <ScrollView>
          {(searchQuery.trim() === '' ? suggestedContent : searchResults).map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              style={styles.courseCard}
              onPress={() => handleNavigation(item.navigateTo, item.navParams)}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
                reducedTransparencyFallbackColor="white"
              />
              {item.icon && <Image source={item.icon} style={styles.courseIcon} />}
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.type ? item.type.toUpperCase() : 'ITEM'}</Text>
                <Text style={styles.courseSubtitle}>{item.title}</Text>
                {item.description && <Text style={styles.courseDescription}>{item.description}</Text>}
              </View>
            </TouchableOpacity>
          ))}
          {searchQuery.trim() !== '' && searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found for "{searchQuery}".</Text>
              <Text style={styles.noResultsSubtitle}>Try searching for a different term or explore our suggestions.</Text>
            </View>
          )}
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
    textTransform: 'uppercase',
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
  noResultsContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default SearchScreen;
