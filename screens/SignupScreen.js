import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../assets/background-image-signup.png';

function SignUpScreen({navigation}) {
  const [formData, setFormData] = useState({
    fname: '',
    mname: '',
    lname: '',
    birthday: '',
    occupation: '',
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    ppvStatus: false,
    otp: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fname || !formData.lname || !formData.birthday || !formData.occupation) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.username || !formData.email || !formData.password || !formData.retypePassword) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      if (!validateEmail(formData.email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      if (!validatePassword(formData.password)) {
        Alert.alert('Error', 
          'Password must contain at least 8 characters, including uppercase and lowercase letters, numbers and special characters');
        return;
      }

      if (formData.password !== formData.retypePassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
      if (!formData.ppvStatus) {
        Alert.alert('Error', 'You must accept the privacy agreement.');
        return;
      }
      handleSignup();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSignup = async () => {
    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      Alert.alert('Error', 
        'Password must contain at least 8 characters, including uppercase and lowercase letters, numbers and special characters');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!formData.ppvStatus) {
      Alert.alert('Error', 'You must accept the privacy agreement.');
      return;
    }

    try {
      const response = await fetch('http://209.38.17.88:5000/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fname: formData.fname,
          mname: formData.mname,
          lname: formData.lname,
          birthday: formData.birthday,
          occupation: formData.occupation,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          retype_password: formData.retypePassword,
          ppv_status: formData.ppvStatus ? 'accepted' : 'rejected',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.error || 'Registration failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://209.38.17.88:5000/auth/verify-otp', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: formData.username,
          otp: formData.otp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', data.error || 'OTP verification failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred');
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="user" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.fname}
          onChangeText={text => setFormData({...formData, fname: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="user" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.lname}
          onChangeText={text => setFormData({...formData, lname: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="calendar" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Birthday (YYYY-MM-DD)"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.birthday}
          onChangeText={text => setFormData({...formData, birthday: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="briefcase" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Occupation"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.occupation}
          onChangeText={text => setFormData({...formData, occupation: text})}
        />
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleNext}>
        <LinearGradient
          colors={['#a726e5', '#b58aff', '#2a49de']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="user" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.username}
          onChangeText={text => setFormData({...formData, username: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="envelope" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#ed76ff"
          style={styles.input}
          value={formData.email}
          onChangeText={text => setFormData({...formData, email: text})}
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
          value={formData.password}
          onChangeText={text => setFormData({...formData, password: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Icon name="lock" size={20} color="#fff" />
        </View>
        <TextInput
          placeholder="Retype Password"
          placeholderTextColor="#ed76ff"
          secureTextEntry
          style={styles.input}
          value={formData.retypePassword}
          onChangeText={text => setFormData({...formData, retypePassword: text})}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setFormData({...formData, ppvStatus: !formData.ppvStatus})}>
          {formData.ppvStatus && <Icon name="check" size={16} color="#ed76ff" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.buttonContainer, styles.halfButton]}
          onPress={handleBack}>
          <LinearGradient
            colors={['#a726e5', '#b58aff', '#2a49de']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonContainer, styles.halfButton]}
          onPress={handleNext}>
          <LinearGradient
            colors={['#a726e5', '#b58aff', '#2a49de']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <ImageBackground source={Background} style={styles.background}>
      <View style={styles.cardContainer}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Sign up</Text>
            
            <View style={styles.stepIndicator}>
              <View style={[styles.step, currentStep >= 1 && styles.activeStep]} />
              <View style={[styles.step, currentStep >= 2 && styles.activeStep]} />
              <View style={[styles.step, otpSent && styles.activeStep]} />
            </View>

            {!otpSent ? (
              currentStep === 1 ? renderStep1() : renderStep2()
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <View style={styles.iconContainer}>
                    <Icon name="key" size={20} color="#fff" />
                  </View>
                  <TextInput
                    placeholder="Enter OTP"
                    placeholderTextColor="#ed76ff"
                    style={styles.input}
                    value={formData.otp}
                    onChangeText={text => setFormData({...formData, otp: text})}
                  />
                </View>

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={handleVerifyOtp}>
                  <LinearGradient
                    colors={['#a726e5', '#b58aff', '#2a49de']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

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

const additionalStyles = {
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(237, 118, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeStep: {
    backgroundColor: '#ed76ff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfButton: {
    width: '48%',
  },
};

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ed76ff',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    color: '#e5e2ef',
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#a726e5',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 1,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    paddingVertical: 12,
  },
  agreementText: {
    color: '#e5e2ef',
    fontSize: 12,
    marginTop: 25,
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
  ...additionalStyles,
});

export default SignUpScreen;
