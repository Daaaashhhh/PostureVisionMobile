import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';

// Mock function to get session data by ID
const fetchMockSessionById = sessionId => {
  const mockSessionsDatabase = {
    '1': {
      postureLog: [
        {timestamp: Date.now() - 60000, status: 'good', details: {}},
        {timestamp: Date.now() - 30000, status: 'poor', details: {type: 'forward_head'}},
      ],
      sessionDuration: 60,
      recordedDate: new Date(Date.now() - 3600000 * 24 * 1),
    },
    '3': {
      postureLog: [
        {timestamp: Date.now() - 120000, status: 'poor', details: {}},
        {timestamp: Date.now() - 60000, status: 'neutral', details: {}},
      ],
      sessionDuration: 120,
      recordedDate: new Date(Date.now() - 3600000 * 24 * 3),
    },
    '4': {
      postureLog: [
        {timestamp: Date.now() - 30000, status: 'good', details: {}},
        {timestamp: Date.now() - 15000, status: 'good', details: {}},
      ],
      sessionDuration: 30,
      recordedDate: new Date(Date.now() - 3600000 * 24 * 4),
    },
  };
  return mockSessionsDatabase[sessionId] || null;
};

const getDefaultReportData = () => {
  return {
    percentPoorPosture: 0,
    stabilityIndex: 0,
    tiltFrequency: 0,
    shoulderAsymmetryCount: 0,
    forwardHeadCount: 0,
    goodPostureDuration: 0,
    poorPostureDuration: 0,
    neutralPostureDuration: 0,
    postureTimeline: [],
    sessionDuration: 0,
    recordedDate: new Date(), // Or null, or a specific placeholder date
    isPlaceholder: true, // Flag to indicate this is default data
  };
};

const calculateReportMetrics = (postureLog, sessionDuration) => {
  if (!postureLog || postureLog.length === 0 || !sessionDuration || sessionDuration === 0) {
    return {
      percentPoorPosture: 0,
      stabilityIndex: 0,
      tiltFrequency: 0,
      shoulderAsymmetryCount: 0,
      forwardHeadCount: 0,
      goodPostureDuration: 0,
      poorPostureDuration: 0,
      neutralPostureDuration: 0,
      postureTimeline: [],
    };
  }

  let poorPostureDuration = 0;
  let goodPostureDuration = 0;
  let neutralPostureDuration = 0;

  const reversedLog = [...postureLog].sort((a, b) => a.timestamp - b.timestamp); // Ensure sorted oldest first
  const firstEntryTimestamp = reversedLog[0].timestamp;
  const sessionEndTimestampGlobal = firstEntryTimestamp + sessionDuration * 1000;

  for (let i = 0; i < reversedLog.length; i++) {
    const entry = reversedLog[i];
    const nextTimestamp =
      i + 1 < reversedLog.length
        ? reversedLog[i + 1].timestamp
        : sessionEndTimestampGlobal;
    let durationMs = nextTimestamp - entry.timestamp;
    durationMs = Math.max(0, durationMs);

    if (entry.status === 'poor') poorPostureDuration += durationMs;
    else if (entry.status === 'good') goodPostureDuration += durationMs;
    else neutralPostureDuration += durationMs;
  }

  const totalLoggedMs = goodPostureDuration + poorPostureDuration + neutralPostureDuration;
  const percentPoorPosture =
    totalLoggedMs > 0 ? (poorPostureDuration / totalLoggedMs) * 100 : 0;

  const tiltFrequency = postureLog.filter(e => e.details?.type === 'tilt').length;
  const shoulderAsymmetryCount = postureLog.filter(
    e => e.details?.issue === 'shoulder_asymmetry',
  ).length;
  const forwardHeadCount = postureLog.filter(
    e => e.details?.issue === 'forward_head',
  ).length;

  return {
    percentPoorPosture: parseFloat(percentPoorPosture.toFixed(1)),
    stabilityIndex: Math.floor(Math.random() * 50) + 50, // Mock stability
    tiltFrequency,
    shoulderAsymmetryCount,
    forwardHeadCount,
    goodPostureDuration: parseFloat((goodPostureDuration / 1000).toFixed(1)),
    poorPostureDuration: parseFloat((poorPostureDuration / 1000).toFixed(1)),
    neutralPostureDuration: parseFloat((neutralPostureDuration / 1000).toFixed(1)),
    postureTimeline: reversedLog.map(e => ({
      t: new Date(e.timestamp),
      y: e.status === 'good' ? 2 : e.status === 'poor' ? 0 : 1,
    })),
  };
};

const SessionReportScreen = ({route, navigation}) => {
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setReportData(null); // Clear previous data and ensure loading state initially
    setError(null);     // Clear previous error

    let sessionDataForReport = null;
    let dataLoadingError = null; // Temporary error holder for this effect run
    let useDefaultData = false;

    if (route.params?.postureLog && route.params?.sessionDuration !== undefined) {
      sessionDataForReport = {
        postureLog: route.params.postureLog,
        sessionDuration: route.params.sessionDuration,
        recordedDate: route.params.recordedDate
          ? new Date(route.params.recordedDate)
          : new Date(),
      };
    } else if (route.params?.sessionId) {
      const fetchedSession = fetchMockSessionById(route.params.sessionId);
      if (fetchedSession) {
        sessionDataForReport = {
          ...fetchedSession,
          recordedDate: fetchedSession.recordedDate
            ? new Date(fetchedSession.recordedDate)
            : new Date(),
        };
      } else {
        dataLoadingError = `Session data not found for ID: ${route.params.sessionId}.`;
      }
    } else {
      // No valid parameters to load a report. Use default data.
      console.log('SessionReportScreen: Navigated without postureLog or sessionId. Using default report data.');
      useDefaultData = true;
    }

    if (useDefaultData) {
      setReportData(getDefaultReportData());
    } else if (sessionDataForReport) {
      try {
        const metrics = calculateReportMetrics(
          sessionDataForReport.postureLog,
          sessionDataForReport.sessionDuration,
        );
        setReportData({
          ...metrics,
          sessionDuration: sessionDataForReport.sessionDuration,
          recordedDate: sessionDataForReport.recordedDate,
        });
      } catch (calcError) {
        console.error('Error calculating report metrics:', calcError);
        dataLoadingError = 'Failed to process session data.';
      }
    }

    // Only set the error state if a specific error occurred during data loading/processing
    if (dataLoadingError) {
      setError(dataLoadingError);
      setReportData(null); // Ensure loading/error state is shown if data loading fails
    }
    // If sessionDataForReport is still null, and no default data used, and no error, reportData will remain null (shows loading)

  }, [route.params]);

  const formatDuration = seconds => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Error Loading Report</CustomText>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.errorCard}>
          <CustomText style={styles.errorTitle}>Error Loading Report</CustomText>
          <CustomText style={styles.errorText}>{error}</CustomText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Analytics')}>
            <CustomText style={styles.buttonText}>Back to Analytics</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Session')}>
            <CustomText style={styles.secondaryButtonText}>
              Start New Session
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Loading Report...</CustomText>
          <View style={styles.headerRight} />
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
        <CustomText style={styles.headerTitle}>
          {reportData?.isPlaceholder ? 'General Report' : `Session Report ${route.params?.sessionId ? `(ID: ${route.params.sessionId})` : ''}`}
        </CustomText>
        <TouchableOpacity
          style={styles.newSessionButton}
          onPress={() => navigation.navigate('Session')}>
          <CustomText style={styles.newSessionButtonText}>New Session</CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionInfoCard}>
          <CustomText style={styles.infoText}>
            Session Date: {reportData.isPlaceholder ? 'N/A' : `${reportData.recordedDate.toLocaleDateString()} ${reportData.recordedDate.toLocaleTimeString()}`}
          </CustomText>
          <CustomText style={styles.infoText}>
            Total Session Duration: {reportData.isPlaceholder ? 'N/A' : formatDuration(reportData.sessionDuration)}
          </CustomText>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <CustomText style={styles.metricTitle}>Posture Quality</CustomText>
            <View style={styles.metricValue}>
              <CustomText style={styles.metricLabel}>
                % Time in Poor Posture:
              </CustomText>
              <CustomText style={[styles.metricNumber, styles.poorMetric]}>
                {reportData.percentPoorPosture}%
              </CustomText>
            </View>
            <View style={styles.metricValue}>
              <CustomText style={styles.metricLabel}>Stability Index:</CustomText>
              <CustomText style={styles.metricNumber}>
                {reportData.stabilityIndex} / 100
              </CustomText>
            </View>
            <View style={styles.chartPlaceholder}>
              <CustomText style={styles.placeholderText}>
                Pie Chart Placeholder
              </CustomText>
            </View>
            <CustomText style={styles.durationText}>
              Good: {formatDuration(reportData.goodPostureDuration)}, Poor:{' '}
              {formatDuration(reportData.poorPostureDuration)}, Neutral:{' '}
              {formatDuration(reportData.neutralPostureDuration)}
            </CustomText>
          </View>

          <View style={styles.metricCard}>
            <CustomText style={styles.metricTitle}>
              Postural Issue Breakdown
            </CustomText>
            <View style={styles.metricValue}>
              <CustomText style={styles.metricLabel}>
                Forward Head Instances:
              </CustomText>
              <CustomText style={styles.metricNumber}>
                {reportData.forwardHeadCount}
              </CustomText>
            </View>
            <View style={styles.metricValue}>
              <CustomText style={styles.metricLabel}>
                Shoulder Asymmetry Events:
              </CustomText>
              <CustomText style={styles.metricNumber}>
                {reportData.shoulderAsymmetryCount}
              </CustomText>
            </View>
            <View style={styles.metricValue}>
              <CustomText style={styles.metricLabel}>Tilt Frequency:</CustomText>
              <CustomText style={styles.metricNumber}>
                {reportData.tiltFrequency} times
              </CustomText>
            </View>
            <View style={styles.chartPlaceholder}>
              <CustomText style={styles.placeholderText}>
                Bar Chart Placeholder
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.snapshotsCard}>
          <CustomText style={styles.metricTitle}>
            Posture Snapshots & Highlights
          </CustomText>
          <CustomText style={styles.snapshotSubtitle}>
            Representative moments from your session:
          </CustomText>
          <View style={styles.snapshotsGrid}>
            <View style={styles.snapshotPlaceholder}>
              <CustomText style={styles.placeholderText}>
                Snapshot 1 (Good)
              </CustomText>
            </View>
            <View style={styles.snapshotPlaceholder}>
              <CustomText style={styles.placeholderText}>
                Snapshot 2 (Poor - Fwd Head)
              </CustomText>
            </View>
            <View style={styles.snapshotPlaceholder}>
              <CustomText style={styles.placeholderText}>
                Snapshot 3 (Poor - Slouch)
              </CustomText>
            </View>
          </View>
          <View style={styles.timelinePlaceholder}>
            <CustomText style={styles.placeholderText}>
              Posture Timeline Chart Placeholder
            </CustomText>
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
  newSessionButton: {
    backgroundColor: '#177ddc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newSessionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  sessionInfoCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 280,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 20,
  },
  metricTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  metricValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  metricNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  poorMetric: {
    color: '#ff453a',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  snapshotsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  snapshotSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 16,
  },
  snapshotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  snapshotPlaceholder: {
    width: 150,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  timelinePlaceholder: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  errorCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff453a',
    marginBottom: 16,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#177ddc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#c7c7c7',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionReportScreen; 