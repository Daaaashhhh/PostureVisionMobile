import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Background from '../assets/background-image-signup.png'; // Reuse background
import Icon from 'react-native-vector-icons/FontAwesome'; // For potential icons

function IdentityVerificationScreen({ navigation }) {

  const handleUploadId = () => {
    // TODO: Implement ID upload logic
    console.log('Upload ID pressed');
  };

  const handleBeginScan = () => {
    // TODO: Implement Face Scan logic
    console.log('Begin Scan pressed');
    // Navigate to next step (Page 5: Posture Capture) upon success
    navigation.navigate('PostureCapture');
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Confirm Your Identity</Text>

          <Text style={styles.instructions}>
            Please upload a valid government-issued ID (state license or passport).
          </Text>

          {/* Upload ID Button */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, styles.uploadButton]} // Style differently
            onPress={handleUploadId}
          >
            {/* Optional: Add upload icon */}
            {/* <Icon name="upload" size={20} color="#b58aff" style={{ marginRight: 10 }} /> */}
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Upload ID</Text>
          </TouchableOpacity>

          {/* Face Detection Scan Section */}
          <View style={styles.faceScanSection}>
            <Text style={styles.faceScanText}>
              We'll now scan your face to match with your uploaded ID.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]} // Primary action button
              onPress={handleBeginScan}
            >
              <Text style={styles.buttonText}>Begin Scan</Text>
            </TouchableOpacity>
          </View>

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
    alignItems: 'center', // Center content within the card
  },
  title: {
    fontSize: 28,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
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
    flexDirection: 'row', // For potential icon alignment
    justifyContent: 'center',
  },
  uploadButton: {
    marginBottom: 40, // Space before face scan section
  },
  primaryButton: {
     backgroundColor: '#a726e5',
     shadowColor: '#a726e5',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.6,
     shadowRadius: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#b58aff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  secondaryButtonText: {
    color: '#b58aff',
  },
  faceScanSection: {
    width: '100%',
    alignItems: 'center', // Center items in this section
    marginTop: 20, // Add some margin if needed, handled by uploadButton margin bottom now
  },
  faceScanText: {
    fontSize: 16,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 20, // Space before Begin Scan button
    lineHeight: 22,
  },
});

export default IdentityVerificationScreen; 