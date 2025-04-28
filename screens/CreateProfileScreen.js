import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Switch,
  ScrollView, // To handle potentially long content
  Platform, // For potential platform-specific adjustments
} from 'react-native';
import Background from '../assets/background-image-signup.png'; // Reuse background

const TOTAL_STEPS = 4;

function CreateProfileScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [useVoiceGuide, setUseVoiceGuide] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [routine, setRoutine] = useState('');
  const [painTightness, setPainTightness] = useState('');
  const [pastIssues, setPastIssues] = useState('');
  const [currentSymptoms, setCurrentSymptoms] = useState('');
  const [functionalGoals, setFunctionalGoals] = useState('');
  const [usageIntent, setUsageIntent] = useState('');

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
    // On the last step, handle submission/navigation
    else if (currentStep === TOTAL_STEPS) {
      // TODO: Handle profile submission (e.g., API call)
      console.log('Profile Data:', { name, dob, gender, occupation, routine, painTightness, pastIssues, currentSymptoms, functionalGoals, usageIntent, useVoiceGuide });
      // Navigate to next step (Page 4: Identity Verification)
      navigation.navigate('IdentityVerification');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper function to render inputs for the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>I prefer voice-guided setup</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={useVoiceGuide ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setUseVoiceGuide}
                value={useVoiceGuide}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Name" placeholderTextColor="#ed76ff" style={styles.input} value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor="#ed76ff" style={styles.input} value={dob} onChangeText={setDob} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Gender" placeholderTextColor="#ed76ff" style={styles.input} value={gender} onChangeText={setGender} />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Occupation" placeholderTextColor="#ed76ff" style={styles.input} value={occupation} onChangeText={setOccupation} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Day-to-Day Routine" placeholderTextColor="#ed76ff" style={styles.input} value={routine} onChangeText={setRoutine} multiline />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Chronic pain or tightness?" placeholderTextColor="#ed76ff" style={styles.input} value={painTightness} onChangeText={setPainTightness} multiline />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Past injuries, surgeries, or hospitalizations?" placeholderTextColor="#ed76ff" style={styles.input} value={pastIssues} onChangeText={setPastIssues} multiline />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Any current symptoms?" placeholderTextColor="#ed76ff" style={styles.input} value={currentSymptoms} onChangeText={setCurrentSymptoms} multiline />
            </View>
          </>
        );
      case 4:
        return (
          <>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Functional goals? (e.g., less tight, core stability)" placeholderTextColor="#ed76ff" style={styles.input} value={functionalGoals} onChangeText={setFunctionalGoals} multiline />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder="How do you want to use PostureVision®?" placeholderTextColor="#ed76ff" style={styles.input} value={usageIntent} onChangeText={setUsageIntent} multiline />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Let's personalize your journey.</Text>

            {/* Step Indicator */}
            <Text style={styles.stepIndicator}>Step {currentStep} of {TOTAL_STEPS}</Text>

            {/* Render inputs for current step */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <View style={styles.navigationButtonsContainer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]} // Style as secondary
                  onPress={handleBack}
                >
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, currentStep === 1 && styles.fullWidthButton ]} // Full width if only Next is shown
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>
                  {currentStep === TOTAL_STEPS ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// Combine and adapt styles from previous screens
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40, // Add padding for scroll view content
  },
  cardContainer: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20, // Add margin at the bottom if needed
  },
  overlay: {
    width: '100%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 28, // Slightly smaller title for this screen
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 15, // Reduced margin
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20, // Adjusted margin
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  toggleLabel: {
    color: '#e5e2ef',
    fontSize: 16,
    marginRight: 10,
    flexShrink: 1, // Allow text to wrap if needed
  },
  inputContainer: {
    // Using style similar to SignUp/Login but without icon container
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15, // Slightly less rounded for regular inputs
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // Adjust padding for platform
    marginBottom: 15,
    width: '100%',
  },
  input: {
    color: '#fff',
    fontSize: 16,
    minHeight: Platform.OS === 'ios' ? 20 : 40, // Ensure multiline inputs have some height
  },
  // Container for Back/Next buttons
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20, // Margin above buttons
    gap: 10, // Add gap between buttons if both are shown
  },
  button: {
    flex: 1, // Allow buttons to share space
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
  // Style for the Back button (similar to WelcomeScreen secondary)
  secondaryButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: '#b58aff',
  },
  fullWidthButton: {
    flex: 0,
    width: '100%', // Make button take full width if it's the only one
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  // Specific text color for secondary button if needed (optional)
  // secondaryButtonText: {
  //   color: '#b58aff', 
  // },
});

export default CreateProfileScreen; 