import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Assuming you might want gradients for buttons later
import Background from '../assets/background-image-signup.png'; // Using the same background for now

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.headline}>Welcome to PostureVision®</Text>
        <Text style={styles.middleCopy}>
          The world's first intuitive personal trainer, posture coach, and rehab specialist—right in your pocket.
        </Text>

        <View style={styles.buttonContainer}>
          {/* Sign Up Button (Primary) - Now a regular button */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]} // Keep primaryButton style for background
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Sign In Button (Secondary) */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // Distribute space
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50, // Add some vertical padding
    width: '90%', // Constrain width slightly
  },
  headline: {
    fontSize: 34,
    color: '#fba5ee', // Similar pinkish color from SignUp
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginTop: 60, // Push headline down a bit
  },
  middleCopy: {
    fontSize: 18,
    color: '#e5e2ef', // Light text color
    textAlign: 'center',
    marginVertical: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40, // Add some space at the bottom
  },
  button: {
    width: '80%', // Make buttons slightly narrower
    borderRadius: 25,
    // overflow: 'hidden', // Not strictly needed without gradient
    marginBottom: 15, // Space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // for Android shadow
    paddingVertical: 12, // Apply padding directly to TouchableOpacity
    alignItems: 'center',   // Center text horizontally
  },
  primaryButton: {
     backgroundColor: '#a726e5', // Use a solid color from the gradient
     shadowColor: '#a726e5', // Primary button shadow color
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.6,
     shadowRadius: 12,
  },
  secondaryButton: {
    backgroundColor: '#3a0a5e', // Darker solid purple background
    // Remove or comment out border if not needed
    // borderWidth: 1,
    // borderColor: '#b58aff', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    // textAlign: 'center', // Centering is handled by alignItems in button style
     textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  secondaryButtonText: {
      // paddingVertical: 12, // Padding is now in the main button style
      color: '#fff', // White text color
  },
});

export default WelcomeScreen; 