import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import CustomText from '../CustomText';

const SettingsScreen = ({navigation}) => {
  const [profile, setProfile] = useState({
    name: 'Dr. Brian Hutcheson',
    title: 'Doctor of Chiropractic',
    email: 'b.hutcheson@example.com',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  const handleProfileUpdate = () => {
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    Alert.alert('Password Change', 'Password change functionality coming soon.');
  };

  const handleNotificationsToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Settings</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Profile</CustomText>
          <View style={styles.inputGroup}>
            <CustomText style={styles.inputLabel}>Name</CustomText>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={text => setProfile(prev => ({...prev, name: text}))}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <CustomText style={styles.inputLabel}>Title</CustomText>
            <TextInput
              style={styles.input}
              value={profile.title}
              onChangeText={text => setProfile(prev => ({...prev, title: text}))}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <CustomText style={styles.inputLabel}>Email</CustomText>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={profile.email}
              editable={false}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleProfileUpdate}>
            <CustomText style={styles.primaryButtonText}>Update Profile</CustomText>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Account</CustomText>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handlePasswordChange}>
            <CustomText style={styles.secondaryButtonText}>Change Password</CustomText>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Notifications</CustomText>
          <View style={styles.notificationItem}>
            <CustomText style={styles.notificationLabel}>
              Email Notifications for New Messages
            </CustomText>
            <Switch
              value={notifications.email}
              onValueChange={() => handleNotificationsToggle('email')}
              trackColor={{false: '#767577', true: '#0a84ff'}}
              thumbColor={notifications.email ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.notificationItem}>
            <CustomText style={styles.notificationLabel}>
              Push Notifications for Appointments
            </CustomText>
            <Switch
              value={notifications.push}
              onValueChange={() => handleNotificationsToggle('push')}
              trackColor={{false: '#767577', true: '#0a84ff'}}
              thumbColor={notifications.push ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: '#0a84ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a84ff',
  },
  secondaryButtonText: {
    color: '#0a84ff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 16,
  },
});

export default SettingsScreen; 