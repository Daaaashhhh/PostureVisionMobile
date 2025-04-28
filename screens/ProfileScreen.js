import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from '../assets/background-image-signup.png';
import {apiGet, apiPost} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const fetchProfile = async () => {
    console.log("Fetching profile...");
    setIsLoading(true);
    setError(null);
    setMessage('');
    try {
      const res = await apiGet('/fetch_user_data/profile', true);
      console.log("Profile data received:", res);
      setProfile(res);
      setFormData({
        first_name: res.first_name || '',
        last_name: res.last_name || '',
        birthday: res.birthday || '',
        gender: res.gender || '',
        phone: res.phone || '',
        email: res.email || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile data.');
      Alert.alert('Error', err.message || 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!currentPassword) {
      Alert.alert('Password Required', 'Please enter your current password to save changes.');
      return;
    }
    setIsUpdating(true);
    setMessage('');
    try {
      const payload = { ...formData, password: currentPassword };
      console.log("Updating profile with payload:", payload);
      await apiPost('/fetch_user_data/profile/update', payload, true);
      console.log("Profile update successful");
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
      setCurrentPassword('');
      await fetchProfile();
    } catch (err) {
      console.error('Update Profile Error:', err);
      setMessage(`Error: ${err.message || 'Failed to update profile.'}`);
      Alert.alert('Error', err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Password Mismatch', 'New passwords do not match.');
      return;
    }
    if (!oldPassword || !newPassword) {
       Alert.alert('Missing Fields', 'Please fill in all password fields.');
       return;
    }

    setIsUpdating(true);
    setMessage('');
    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmNewPassword,
      };
      console.log("Changing password with payload:", payload);
      await apiPost('/fetch_user_data/profile/change-password', payload, true);
      console.log("Password change successful");
      Alert.alert('Success', 'Password changed successfully.');
      setIsChangingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Change Password Error:', err);
       setMessage(`Error: ${err.message || 'Failed to change password.'}`);
      Alert.alert('Error', err.message || 'Failed to change password.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout", onPress: async () => {
            console.log("Logging out...");
            await AsyncStorage.removeItem('token');
            navigation.navigate('Auth', { screen: 'Login' });
            console.log("Navigation attempted to Auth/Login");
          }, style: "destructive"
        }
      ]
    );
  };

  const renderEditProfileForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Edit Profile</Text>
      {message && <Text style={message.startsWith('Error:') ? styles.errorText : styles.successText}>{message}</Text>}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={formData.first_name}
        onChangeText={val => handleInputChange('first_name', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={formData.last_name}
        onChangeText={val => handleInputChange('last_name', val)}
      />
       <TextInput
        style={styles.input}
        placeholder="Birthday (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={formData.birthday}
        onChangeText={val => handleInputChange('birthday', val)}
      />
       <TextInput
        style={styles.input}
        placeholder="Gender"
        placeholderTextColor="#aaa"
        value={formData.gender}
        onChangeText={val => handleInputChange('gender', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={formData.phone}
        onChangeText={val => handleInputChange('phone', val)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Current Password to Save"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <View style={styles.buttonGroup}>
         <TouchableOpacity 
            style={[styles.formButton, styles.saveButton, isUpdating && styles.disabledButton]}
            onPress={handleUpdateProfile}
            disabled={isUpdating}
          >
           {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.formButton, styles.cancelButton]} 
            onPress={() => { setIsEditing(false); setMessage(''); }}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

 const renderChangePasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Change Password</Text>
      {message && <Text style={message.startsWith('Error:') ? styles.errorText : styles.successText}>{message}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
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
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />
       <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.formButton, styles.saveButton, isUpdating && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={isUpdating}
          >
             {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Change Password</Text>}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.formButton, styles.cancelButton]} 
            onPress={() => { setIsChangingPassword(false); setMessage(''); }}
            disabled={isUpdating}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

 const renderProfileDetails = () => (
    <View style={styles.profileDetailsContainer}>
      <Text style={styles.detailItem}>First Name: {profile?.first_name}</Text>
      <Text style={styles.detailItem}>Last Name: {profile?.last_name}</Text>
      <Text style={styles.detailItem}>Email: {profile?.email}</Text>
      <Text style={styles.detailItem}>Birthday: {profile?.birthday}</Text>
      <Text style={styles.detailItem}>Gender: {profile?.gender}</Text>
      <Text style={styles.detailItem}>Phone: {profile?.phone}</Text>
    </View>
  );

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['rgba(26,26,26,0.1)', 'rgba(13,13,13,0.95)']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView>
          <View style={styles.header}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={styles.profileImage}
            />
            {isLoading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : profile ? (
              <>
                <Text style={styles.userName}>{`${profile.first_name} ${profile.last_name}`}</Text>
                <Text style={styles.userEmail}>{profile.email}</Text>
              </>
            ) : (
              <Text style={styles.loadingText}>No profile data found.</Text> 
            )}
          </View>

          {isEditing ? (
             renderEditProfileForm()
          ) : isChangingPassword ? (
            renderChangePasswordForm()
          ) : (
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Connected Posture</Text>
                  <Text style={styles.statLabel}>Hours</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>156</Text>
                  <Text style={styles.statLabel}>Total Posture</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>23</Text>
                  <Text style={styles.statLabel}>Posture Mastery</Text>
                  <Text style={styles.statLabel}>Certifications</Text>
                </View>
              </View>

              {profile && renderProfileDetails()} 

              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setIsEditing(true); setMessage(''); }}>
                  <Icon name="person-outline" size={24} color="#96f4ff" />
                  <Text style={styles.menuText}>Edit Profile</Text>
                  <Icon name="chevron-forward" size={24} color="#96f4ff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => { setIsChangingPassword(true); setMessage(''); }}>
                   <Icon name="lock-closed-outline" size={24} color="#96f4ff" />
                  <Text style={styles.menuText}>Change Password</Text>
                  <Icon name="chevron-forward" size={24} color="#96f4ff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Coming Soon", "Posture Courses feature is under development.")}>
                  <Icon name="book-outline" size={24} color="#96f4ff" />
                  <Text style={styles.menuText}>My Posture Courses</Text>
                  <Icon name="chevron-forward" size={24} color="#96f4ff" />
                </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Coming Soon", "Posture Certifications feature is under development.")}>
                  <Icon name="ribbon-outline" size={24} color="#96f4ff" />
                  <Text style={styles.menuText}>Posture Certifications</Text>
                  <Icon name="chevron-forward" size={24} color="#96f4ff" />
                </TouchableOpacity>
                 <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Coming Soon", "Settings feature is under development.")}>
                   <Icon name="settings-outline" size={24} color="#96f4ff" />
                  <Text style={styles.menuText}>Settings</Text>
                  <Icon name="chevron-forward" size={24} color="#96f4ff" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
                  <Icon name="log-out-outline" size={24} color="#FF4444" />
                  <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                  <Icon name="chevron-forward" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#96f4ff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#96f4ff',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#FFFFFF',
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
  profileDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  detailItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    margin: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#96f4ff',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
     backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: '#34C759',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ProfileScreen;
