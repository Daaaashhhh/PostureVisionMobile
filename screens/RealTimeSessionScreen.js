import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';
import WebRTCViewer from './WebRTCViewer';

const RealTimeSessionScreen = ({navigation}) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPostureStatus, setCurrentPostureStatus] = useState('neutral');
  const [postureLog, setPostureLog] = useState([]);
  const [showDevLog, setShowDevLog] = useState(true);
  const [monitoringMode, setMonitoringMode] = useState('active');

  const intervalRef = useRef(null);
  const webRTCViewerRef = useRef(null);

  useEffect(() => {
    if (isSessionActive) {
      intervalRef.current = setInterval(() => {
        setSessionTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isSessionActive]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setSessionTime(0);
    setPostureLog([]);
  };

  const handleStopSession = useCallback(() => {
    setIsSessionActive(false);
    if (monitoringMode === 'passive') {
      navigation.navigate('SessionReport', {
        postureLog: postureLog,
        sessionDuration: sessionTime,
        recordedDate: new Date().toISOString(),
      });
    }
  }, [monitoringMode, navigation, postureLog, sessionTime]);

  const handlePostureUpdate = useCallback(
    (status, details) => {
      if (!isSessionActive) return;

      const newLogEntry = {
        timestamp: Date.now(),
        status,
        details,
      };
      setPostureLog(prevLog => [newLogEntry, ...prevLog].slice(0, 500));

      if (monitoringMode === 'active') {
        setCurrentPostureStatus(status);
      }
    },
    [isSessionActive, monitoringMode],
  );

  const handleWebRTCViewerStopped = useCallback(() => {
    console.log('WebRTCViewer camera stopped, stopping session if active.');
    if (isSessionActive) {
      handleStopSession();
    }
  }, [isSessionActive, handleStopSession]);

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const getStatusColor = status => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'poor':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Real-Time Session</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!isSessionActive && (
          <View style={styles.modeSelector}>
            <CustomText style={styles.sectionTitle}>Session Mode</CustomText>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  monitoringMode === 'active' && styles.radioButtonSelected,
                ]}
                onPress={() => setMonitoringMode('active')}>
                <Icon
                  name={monitoringMode === 'active' ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color="#fff"
                />
                <CustomText style={styles.radioLabel}>
                  Active (Real-time Feedback)
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  monitoringMode === 'passive' && styles.radioButtonSelected,
                ]}
                onPress={() => setMonitoringMode('passive')}>
                <Icon
                  name={monitoringMode === 'passive' ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color="#fff"
                />
                <CustomText style={styles.radioLabel}>
                  Passive (End-of-Session Report)
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sessionControl}>
          <CustomText style={styles.sectionTitle}>Session Control</CustomText>
          <View style={styles.controlRow}>
            {!isSessionActive ? (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStartSession}>
                <CustomText style={styles.buttonText}>Start Session</CustomText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.stopButton]}
                onPress={handleStopSession}>
                <CustomText style={styles.buttonText}>Stop Session</CustomText>
              </TouchableOpacity>
            )}
            <View style={styles.timerContainer}>
              <CustomText style={styles.timerText}>
                Session Time: {formatTime(sessionTime)}
              </CustomText>
            </View>
          </View>

          {isSessionActive && monitoringMode === 'active' && (
            <View
              style={[
                styles.statusIndicator,
                {backgroundColor: getStatusColor(currentPostureStatus)},
              ]}>
              <CustomText style={styles.statusText}>
                Current Posture: {currentPostureStatus.toUpperCase()}
              </CustomText>
            </View>
          )}
          {isSessionActive && monitoringMode === 'passive' && (
            <View style={[styles.statusIndicator, styles.passiveStatus]}>
              <CustomText style={styles.statusText}>
                Passive Mode: Monitoring In Progress... Report at end.
              </CustomText>
            </View>
          )}
        </View>

        <View style={styles.cameraSection}>
          <CustomText style={styles.sectionTitle}>Live Camera Feed</CustomText>
          <WebRTCViewer
            ref={webRTCViewerRef}
            onStop={handleWebRTCViewerStopped}
            onPostureUpdate={handlePostureUpdate}
          />
        </View>

        {isSessionActive && (
          <View style={styles.devLogSection}>
            <View style={styles.devLogHeader}>
              <CustomText style={styles.sectionTitle}>Developer Log</CustomText>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowDevLog(!showDevLog)}>
                <CustomText style={styles.toggleButtonText}>
                  {showDevLog ? 'Hide Log' : 'Show Log'}
                </CustomText>
              </TouchableOpacity>
            </View>
            {showDevLog && (
              <ScrollView style={styles.devLog}>
                {postureLog.length > 0 ? (
                  postureLog.map((entry, index) => (
                    <View key={index} style={styles.logEntry}>
                      <CustomText style={styles.logText}>
                        {`${new Date(entry.timestamp).toLocaleTimeString()}: Status - ${
                          entry.status
                        }`}
                      </CustomText>
                    </View>
                  ))
                ) : (
                  <CustomText style={styles.emptyLogText}>
                    No posture updates logged yet for this session.
                  </CustomText>
                )}
              </ScrollView>
            )}
          </View>
        )}
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
  modeSelector: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  radioButtonSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  radioLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sessionControl: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  passiveStatus: {
    backgroundColor: 'rgba(117, 117, 117, 0.8)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  devLogSection: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  devLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  devLog: {
    maxHeight: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  logEntry: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  emptyLogText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});

export default RealTimeSessionScreen; 