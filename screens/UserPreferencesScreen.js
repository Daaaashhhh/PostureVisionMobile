import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import CustomText from '../CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API functions (replace with actual API calls)
const mockFetchUserSettings = async () => {
  console.log('Fetching user settings...');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    const settings = await AsyncStorage.getItem('userSettingsPostureVision');
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
  // Default settings if none found
  return {
    defaultSessionMode: 'active', // 'active' or 'passive'
    enableNotifications: false, // boolean
    recalibrationFrequency: 'monthly', // 'never', 'daily', 'weekly', 'monthly', 'quarterly'
  };
};

const mockSaveUserSettings = async settings => {
  console.log('Saving user settings:', settings);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  try {
    await AsyncStorage.setItem('userSettingsPostureVision', JSON.stringify(settings));
    return {success: true, data: settings};
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

const UserPreferencesScreen = ({navigation}) => {
  const [settings, setSettings] = useState({
    defaultSessionMode: 'active',
    enableNotifications: false,
    recalibrationFrequency: 'monthly',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const fetchedSettings = await mockFetchUserSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      }
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleInputChange = (name, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await mockSaveUserSettings(settings);
      // Show success feedback
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save user settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>User Preferences</CustomText>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a84ff" />
          <CustomText style={styles.loadingText}>Loading settings...</CustomText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>User Preferences</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Session Preferences</CustomText>
          <View style={styles.settingItem}>
            <CustomText style={styles.settingLabel}>Default Session Mode:</CustomText>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  // Show picker or modal for session mode selection
                  Alert.alert(
                    'Session Mode',
                    'Select default session mode',
                    [
                      {
                        text: 'Active (Real-time Feedback)',
                        onPress: () => handleInputChange('defaultSessionMode', 'active'),
                      },
                      {
                        text: 'Passive (End-of-Session Report)',
                        onPress: () => handleInputChange('defaultSessionMode', 'passive'),
                      },
                    ],
                  );
                }}>
                <CustomText style={styles.selectButtonText}>
                  {settings.defaultSessionMode === 'active'
                    ? 'Active (Real-time Feedback)'
                    : 'Passive (End-of-Session Report)'}
                </CustomText>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <CustomText style={styles.settingDescription}>
              Choose the default behavior for your posture monitoring sessions.
            </CustomText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Notifications</CustomText>
          <View style={styles.settingItem}>
            <View style={styles.toggleContainer}>
              <CustomText style={styles.settingLabel}>Enable Posture Alerts:</CustomText>
              <Switch
                value={settings.enableNotifications}
                onValueChange={value =>
                  handleInputChange('enableNotifications', value)
                }
                trackColor={{false: '#767577', true: '#0a84ff'}}
                thumbColor={settings.enableNotifications ? '#fff' : '#f4f3f4'}
                disabled={isSaving}
              />
            </View>
            <CustomText style={styles.settingDescription}>
              Receive notifications during active sessions if poor posture is detected.
            </CustomText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <CustomText style={styles.sectionTitle}>Calibration</CustomText>
          <View style={styles.settingItem}>
            <CustomText style={styles.settingLabel}>
              Recalibration Reminder Frequency:
            </CustomText>
            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  // Show picker or modal for frequency selection
                  Alert.alert(
                    'Recalibration Frequency',
                    'Select reminder frequency',
                    [
                      {
                        text: 'Never',
                        onPress: () =>
                          handleInputChange('recalibrationFrequency', 'never'),
                      },
                      {
                        text: 'Daily',
                        onPress: () =>
                          handleInputChange('recalibrationFrequency', 'daily'),
                      },
                      {
                        text: 'Weekly',
                        onPress: () =>
                          handleInputChange('recalibrationFrequency', 'weekly'),
                      },
                      {
                        text: 'Monthly (Recommended)',
                        onPress: () =>
                          handleInputChange('recalibrationFrequency', 'monthly'),
                      },
                      {
                        text: 'Quarterly',
                        onPress: () =>
                          handleInputChange('recalibrationFrequency', 'quarterly'),
                      },
                    ],
                  );
                }}>
                <CustomText style={styles.selectButtonText}>
                  {settings.recalibrationFrequency === 'never'
                    ? 'Never'
                    : settings.recalibrationFrequency === 'daily'
                    ? 'Daily'
                    : settings.recalibrationFrequency === 'weekly'
                    ? 'Weekly'
                    : settings.recalibrationFrequency === 'monthly'
                    ? 'Monthly (Recommended)'
                    : 'Quarterly'}
                </CustomText>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <CustomText style={styles.settingDescription}>
              Set how often you'd like to be reminded to recalibrate for best accuracy.
            </CustomText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={isSaving}>
          <CustomText style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </CustomText>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
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
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  selectButtonText: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#0a84ff',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserPreferencesScreen; 