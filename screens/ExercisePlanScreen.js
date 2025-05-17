import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';

const {width} = Dimensions.get('window');

const ExercisePlanScreen = ({navigation}) => {
  // Placeholder data for the exercise plan
  const planFocus = "Core Strength & Flexibility";
  const exercises = [
    {
      id: 1,
      name: "Cat-Cow Stretch",
      sets: 2,
      reps: 10,
      duration: null,
      description: "Improves spinal mobility.",
      videoUrl: "#",
    },
    {
      id: 2,
      name: "Plank",
      sets: 3,
      reps: null,
      duration: "30s hold",
      description: "Builds core stability.",
      videoUrl: "#",
    },
    {
      id: 3,
      name: "Bird Dog",
      sets: 3,
      reps: 8,
      duration: "per side",
      description: "Enhances balance and core control.",
      videoUrl: "#",
    },
    {
      id: 4,
      name: "Doorway Chest Stretch",
      sets: 2,
      reps: null,
      duration: "20s hold",
      description: "Opens up chest muscles.",
      videoUrl: "#",
    },
  ];
  const specialistNotes =
    "Perform these exercises 3-4 times a week. Focus on proper form over speed. Stop if you feel sharp pain.";

  const ExerciseThumbnail = () => (
    <View style={styles.thumbnailPlaceholder}>
      <CustomText style={styles.thumbnailText}>IMG</CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Exercise Plan</CustomText>
          <View style={styles.headerRight} />
        </View>

        {/* Plan Overview */}
        <View style={styles.overviewContainer}>
          <CustomText style={styles.overviewText}>
            Focus Area: <CustomText style={styles.overviewFocus}>{planFocus}</CustomText>
          </CustomText>
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesGrid}>
          {exercises.map(ex => (
            <View key={ex.id} style={styles.exerciseCard}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.exerciseContent}>
                <ExerciseThumbnail />
                <View style={styles.exerciseDetails}>
                  <CustomText style={styles.exerciseName}>{ex.name}</CustomText>
                  <CustomText style={styles.exerciseSpecs}>
                    {ex.sets && `${ex.sets} sets`}
                    {ex.reps && ` x ${ex.reps} reps`}
                    {ex.duration && ` (${ex.duration})`}
                  </CustomText>
                  <CustomText style={styles.exerciseDescription}>
                    {ex.description}
                  </CustomText>
                </View>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => alert(`Show video for ${ex.name}`)}>
                  <CustomText style={styles.viewButtonText}>View</CustomText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Specialist Notes */}
        <View style={styles.notesCard}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={StyleSheet.absoluteFill}
          />
          <CustomText style={styles.notesTitle}>Specialist Notes</CustomText>
          <CustomText style={styles.notesText}>{specialistNotes}</CustomText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  overviewContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overviewText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  overviewFocus: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  exercisesGrid: {
    padding: 10,
    gap: 10,
  },
  exerciseCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  exerciseContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  thumbnailText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseSpecs: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  viewButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  notesCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});

export default ExercisePlanScreen; 