import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Background from '../assets/background-image-signup.png'; // Reuse background
// import Icon from 'react-native-vector-icons/FontAwesome'; // If needed

function PostureCaptureScreen({ navigation }) {

  const handleStartCapture = () => {
    // TODO: Implement camera logic initiation
    console.log('Start Photo Capture pressed');
    // TODO: Navigate to dashboard or report after capture completes
    // For now, simulate completion by navigating to Main tabs
    navigation.navigate('Main');
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Let's capture your posture.</Text>

          <Text style={styles.instructions}>
            You'll be guided to take 4 posture photos:
          </Text>
          <View style={styles.photoListContainer}>
            <Text style={styles.photoListItem}>• Front View</Text>
            <Text style={styles.photoListItem}>• Left Side View</Text>
            <Text style={styles.photoListItem}>• Right Side View</Text>
            <Text style={styles.photoListItem}>• Rear/Posterior View</Text>
          </View>

          <Text style={styles.ensureInstructions}>
            Ensure neutral lighting, tight-fitting clothing, and your full body is in the frame.
          </Text>

          {/* Placeholder for camera view or instructions area */}
          {/* <View style={styles.cameraPlaceholder}></View> */}

          {/* Start Capture Button */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]} // Primary action button
            onPress={handleStartCapture}
          >
            <Text style={styles.buttonText}>Start Photo Capture</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

// Styles adapted from previous screens
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  overlay: {
    width: '100%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  photoListContainer: {
    alignSelf: 'stretch', // Take full width within padding
    marginBottom: 20,
    paddingLeft: 20, // Indent list slightly
  },
  photoListItem: {
    fontSize: 15,
    color: '#e5e2ef',
    lineHeight: 22,
    marginBottom: 5,
  },
  ensureInstructions: {
    fontSize: 14,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 30, // More space before button
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  // Optional Placeholder style
  // cameraPlaceholder: {
  //   width: '100%',
  //   height: 200, // Example height
  //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
  //   borderRadius: 15,
  //   marginBottom: 30,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  button: {
    width: '100%',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
     backgroundColor: '#a726e5',
     shadowColor: '#a726e5',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.6,
     shadowRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});

export default PostureCaptureScreen; 