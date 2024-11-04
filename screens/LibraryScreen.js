import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure this is installed
import Background from '../assets/background-image-signup.png';

function LibraryScreen() {
  return (
    <ImageBackground
      source={Background} // Replace with the path to your background image
      style={styles.background}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign up</Text>

        <View style={styles.inputContainer}>
          <Icon
            name="mail-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#ddd"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon
            name="lock-closed-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <Text style={styles.agreementText}>
          By clicking on Sign up, you agree to our Terms of service and Privacy
          policy.
        </Text>

        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink}>Sign in</Text>
        </Text>
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
  card: {
    width: '85%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for glass effect
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)', // Glass effect (only supported on web, ignored on mobile)
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glassy background for inputs
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Glassy button background
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  agreementText: {
    color: '#ddd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  signInText: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 10,
  },
  signInLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LibraryScreen;
