import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Background from '../assets/background-image-signup.png';

function LoginScreen({navigation}) {
  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Sign in</Text>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="envelope" size={20} color="#fff" />
            </View>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#ed76ff"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={20} color="#fff" />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ed76ff"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.forgotLinksContainer}>
            <TouchableOpacity onPress={() => { /* TODO: Implement Forgot Username */ }}>
              <Text style={styles.forgotLinkText}>Forgot Username?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* TODO: Implement Forgot Password */ }}>
              <Text style={styles.forgotLinkText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Main')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.signInText}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signInLink}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
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
  cardContainer: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    padding: 25,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 32,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    width: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
  },
  forgotLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 20,
    marginTop: 5,
  },
  forgotLinkText: {
    color: '#e5e2ef',
    fontSize: 14,
    fontWeight: 'normal',
  },
  button: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 20,
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
  signInText: {
    color: '#e5e2ef',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  signInLink: {
    color: '#e5e2ef',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
