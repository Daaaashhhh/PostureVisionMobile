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

function LoginScreen({navigation}) {
  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.85)']}
          style={styles.overlay}
          useAngle={true}
          angle={45}
          angleCenter={{x: 0.5, y: 0.5}}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subTitle}>
              Access your personalized posture correction journey
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon name="envelope" size={20} color="#fff" />
              </View>
              <TextInput
                placeholder="Email address"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon name="lock" size={20} color="#fff" />
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                secureTextEntry
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate('Main')}>
              <LinearGradient
                colors={['#a726e5', '#b58aff']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                useAngle={true}
                angle={90}
                style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    borderRadius: 30,

    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  card: {
    width: '100%',
    padding: 25,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#a726e5',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {

    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 15,
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  signUpLink: {
    color: '#b58aff',
    fontWeight: '700',
  },
});

export default LoginScreen;
