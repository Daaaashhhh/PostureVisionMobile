import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import Background from '../assets/background-image-signup.png';
import { apiPost } from '../utils/api';

function SignUpScreen({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.first_name || !formData.last_name || !formData.birthday || !formData.gender || !formData.phone) {
        Alert.alert("Missing Information", "Please fill out all fields in this step.");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
    setMessage('');
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setMessage('');
  };

  const handleRegister = async () => {
    setMessage('');
    if (formData.password !== formData.confirm_password) {
      setMessage('Error: Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!acceptPrivacy) {
      setMessage('Error: You must accept the privacy agreement.');
      Alert.alert('Error', 'You must accept the privacy agreement.');
      return;
    }
    if (!formData.email.includes('@')) {
      setMessage('Error: Please enter a valid email address.');
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 8) {
      setMessage('Error: Password must be at least 8 characters long.');
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const { confirm_password, ...payload } = formData;
      console.log("Registering with payload:", payload);
      const res = await apiPost('/auth/register', payload);
      console.log("Registration response:", res);
      setMessage(res.message || 'Registration successful! Please login.');
      Alert.alert(
        'Registration Successful',
        res.message || 'Your account has been created. Please login.',
        [{ text: "OK", onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setMessage(`Error: ${errorMessage}`);
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalAccept = () => {
    setShowModal(false);
    setAcceptPrivacy(true);
  };

  const renderStepOne = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={formData.first_name}
        onChangeText={val => handleChange('first_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={formData.last_name}
        onChangeText={val => handleChange('last_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={formData.birthday}
        onChangeText={val => handleChange('birthday', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#aaa"
        value={formData.gender}
        onChangeText={val => handleChange('gender', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={formData.phone}
        onChangeText={val => handleChange('phone', val)}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleNextStep}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </>
  );

  const renderStepTwo = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        value={formData.email}
        onChangeText={val => handleChange('email', val)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 8 characters)"
        placeholderTextColor="#aaa"
        value={formData.password}
        onChangeText={val => handleChange('password', val)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Retype Password"
        placeholderTextColor="#aaa"
        value={formData.confirm_password}
        onChangeText={val => handleChange('confirm_password', val)}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          disabled={false}
          value={acceptPrivacy}
          onValueChange={setAcceptPrivacy}
          tintColors={{ true: '#a726e5', false: '#ccc' }}
        />
        <Text style={styles.checkboxLabel}>
          I accept the {' '}
          <Text style={styles.privacyLink} onPress={() => setShowModal(true)}>
            privacy agreement
          </Text>
          .
        </Text>
      </View>

      {message ? (
        <Text style={message.startsWith('Error:') ? styles.errorMessage : styles.successMessage}>
          {message}
        </Text>
      ) : null}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { flex: 1, marginRight: 5 }]}
          onPress={handlePreviousStep}>
          <Text style={styles.buttonTextSecondary}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { flex: 1, marginLeft: 5 }, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ImageBackground source={Background} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Sign up (Step {currentStep} of 2)</Text>

            {currentStep === 1 ? renderStepOne() : renderStepTwo()}

            <View style={styles.divider} />

            <Text style={styles.signInText}>
              Already have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy Agreement</Text>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>Thank you for using our application. Your privacy is important to us. This Privacy Agreement outlines how we collect, use, store, and protect your personal data, including images, to improve the accuracy of our machine learning models and overall application performance.</Text>
              <Text style={styles.modalText}> </Text>
              <Text style={styles.modalTextBold}>1. Personal Data Collection</Text>
              <Text style={styles.modalText}>We collect personal data from you, including but not limited to: name, email, and other identifying information provided during account registration. Images or videos captured through the application for posture analysis or other machine learning tasks.</Text>
              <Text style={styles.modalText}> </Text>
              <Text style={styles.modalTextBold}>2. Use of Personal Data and Images</Text>
              <Text style={styles.modalText}>We use your personal data and images to enhance the accuracy and performance of our machine learning models and improve application functionality.</Text>
              <Text style={styles.modalText}> </Text>
              <Text style={styles.modalTextBold}>9. Contact Us</Text>
              <Text style={styles.modalText}>If you have any questions or concerns regarding this Privacy Agreement or your personal data, please contact us.</Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, styles.modalAcceptButton]}
              onPress={handleModalAccept}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, styles.modalCloseButton]}
              onPress={() => setShowModal(false)}>
              <Text style={styles.buttonTextSecondary}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  overlay: {
    width: '100%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#a726e5',
    shadowColor: '#a726e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonDisabled: {
    backgroundColor: '#555',
    shadowColor: '#555',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    paddingLeft: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#e5e2ef',
    fontSize: 14,
    flexShrink: 1,
  },
  privacyLink: {
    color: '#96f4ff',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '80%',
    marginVertical: 20,
  },
  signInText: {
    color: '#e5e2ef',
    fontSize: 14,
    textAlign: 'center',
  },
  signInLink: {
    color: '#96f4ff',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#FF6B6B',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successMessage: {
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fba5ee',
  },
  modalBody: {
    marginBottom: 20,
    width: '100%',
  },
  modalText: {
    fontSize: 15,
    color: '#E5E5EA',
    marginBottom: 10,
    lineHeight: 20,
  },
  modalTextBold: {
    fontSize: 16,
    color: '#E5E5EA',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalAcceptButton: {
    width: '100%',
    marginBottom: 10,
  },
  modalCloseButton: {
    width: '100%',
  }
});

export default SignUpScreen;
