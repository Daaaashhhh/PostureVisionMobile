import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { apiPost } from '../utils/api'; // Corrected path
import Background from '../assets/background-image-signup.png'; // Assuming background image

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      // Assuming the API returns a message on success like { message: "..." }
      const res = await apiPost('/auth/forgot-password', { email });
      setMessage(res.message || 'Password reset instructions sent successfully!'); // Use message from response or a default
      Alert.alert('Success', res.message || 'Password reset instructions sent successfully!');
      // Optionally navigate back or to a confirmation screen
      // navigation.goBack();
    } catch (err) {
      console.error('Forgot Password Error:', err);
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setMessage(`Error: ${errorMessage}`);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Enter your email address below and we'll send you a link to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {message ? (
          <Text style={message.startsWith('Error:') ? styles.errorMessage : styles.successMessage}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '85%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#e5e2ef',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  button: {
    width: '100%',
    backgroundColor: '#a726e5',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#a726e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#777',
     shadowColor: '#777',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
   backButton: {
     marginTop: 10,
   },
   backButtonText: {
      color: '#e5e2ef',
      fontSize: 14,
   },
  successMessage: {
    color: '#4CAF50', // Green
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  errorMessage: {
    color: '#F44336', // Red
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen; 