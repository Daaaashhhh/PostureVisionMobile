import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { apiPost } from '../utils/api';
import Background from '../assets/background-image-signup.png'; // Reusing background

const ResetPasswordScreen = ({ route, navigation }) => {
  // Extract email and otp from navigation parameters
  const { email = '', otp = '' } = route.params || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage(''); // Clear previous message
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('Error: Password must be at least 8 characters long.');
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
    if (!email || !otp) {
        setMessage('Error: Missing email or OTP. Please restart the process.');
        Alert.alert('Error', 'Missing email or OTP. Please restart the password reset process.');
        // Optionally navigate back
        // navigation.navigate('Login'); 
        return;
    }

    setIsLoading(true);
    try {
      console.log("Resetting password for:", email, "with OTP:", otp);
      const res = await apiPost('/auth/reset-password', {
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword, // API might only need new_password
      });
      setMessage(res.message || 'Password reset successfully!');
      Alert.alert(
        'Success',
        res.message || 'Your password has been reset successfully. Please login with your new password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }] // Navigate to Login
      );
    } catch (err) {
      console.error('Reset Password Error:', err);
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
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.instructions}>
          Enter and confirm your new password below.
        </Text>

        {/* Display email if needed, maybe mask it? */}
        {/* <Text style={styles.emailText}>Email: {email}</Text> */}

        <TextInput
          style={styles.input}
          placeholder="New Password (min 8 characters)"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>

        {/* Optional: Button to go back if needed */}
         <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
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
    marginBottom: 15, // Spacing between inputs
    borderWidth: 1,
    borderColor: '#555',
  },
  button: {
    width: '100%',
    backgroundColor: '#a726e5',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10, // Margin above button
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
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  errorMessage: {
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  emailText: { // Optional style for displaying email
      color: '#ccc',
      marginBottom: 10,
      fontSize: 14,
  }
});

export default ResetPasswordScreen; 