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

function SignUpScreen({navigation}) {
  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Sign up</Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon name="envelope" size={20} color="#fff" />
              </View>
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#ed76ff"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon name="lock" size={20} color="#fff" />
              </View>
              <TextInput
                placeholder="*****"
                placeholderTextColor="#ed76ff"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('CreateProfile')}>
              <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>

            <Text style={styles.agreementText}>
              By clicking on Sign up, you agree to our Terms of service and
              Privacy policy.
            </Text>

            <Text style={styles.signInText}>
              Already have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </Text>
          </View>
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
  button: {
    width: '100%',
    borderRadius: 25,
    marginBottom: 15,
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
  agreementText: {
    color: '#e5e2ef',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 10,
    lineHeight: 16,
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

export default SignUpScreen;
