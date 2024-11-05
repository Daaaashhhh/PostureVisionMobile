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
import LinearGradient from 'react-native-linear-gradient';
import Background from '../assets/bg-img-login.png';

function SignUpScreen({navigation}) {
  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subTitle}>
              Access 120+ hours of posture correction courses, tutorials, and
              live sessions.{' '}
            </Text>

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
              style={styles.buttonContainer}
              onPress={() => navigation.navigate('Main')}>
              <LinearGradient
                colors={['#a726e5', '#b58aff', '#2a49de']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.signInText}>
              No account yet?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signInLink}>Sign Up</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Replace blur effect with a semi-transparent background
  },
  title: {
    fontSize: 32,
    color: '#fba5ee',
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 30,
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
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#a726e5',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  agreementText: {
    color: '#e5e2ef',
    fontSize: 12,
    marginTop: 15,
    paddingHorizontal: 10,
  },
  signInText: {
    color: '#e5e2ef',
    fontSize: 14,
    marginTop: 10,
  },
  signInLink: {
    color: '#e5e2ef',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
