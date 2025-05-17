import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';
import WebRTCViewer from './WebRTCViewer';

const CalibrationScreen = ({navigation}) => {
  const [calibrationStep, setCalibrationStep] = useState('start'); // 'start', 'calibrating', 'summary'
  const [calibrationResults, setCalibrationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder data for the report
  const reportData = {
    postureScore: 78,
    visualBreakdown: {
      overallAssessment: "Fair posture, with notable forward head tilt and slight shoulder imbalance.",
      keyMetrics: [
        {
          name: "Forward Head Tilt",
          value: "12°",
          comment: "Significant tilt, equivalent to approx. 10 lbs extra load.",
          status: "poor",
        },
        {
          name: "Shoulder Symmetry",
          value: "Slight Right High",
          comment: "Right shoulder appears slightly elevated.",
          status: "warning",
        },
        {
          name: "Spinal Curvature (Sagittal)",
          value: "Increased Thoracic Kyphosis",
          status: "warning",
        },
        {
          name: "Pelvic Tilt",
          value: "Slight Anterior Tilt",
          status: "warning",
        },
      ],
      diagramUrl: "https://via.placeholder.com/400x300.png?text=User+Posture+Analysis",
    },
    goalSuggestions: [
      {
        id: 'goal1',
        title: "Correct Forward Head Tilt",
        description: "Perform chin tucks (3 sets of 10) daily. Adjust monitor height to eye level.",
      },
      {
        id: 'goal2',
        title: "Improve Shoulder Symmetry",
        description: "Focus on scapular retraction exercises. Be mindful of bag carrying habits.",
      },
      {
        id: 'goal3',
        title: "Address Pelvic Tilt",
        description: "Incorporate core strengthening and hip flexor stretches.",
      },
    ],
  };

  const handleStartCalibration = () => {
    setCalibrationStep('calibrating');
    setIsLoading(true);
    setError(null);

    // Simulate calibration process
    setTimeout(async () => {
      try {
        setCalibrationResults(reportData);
        setCalibrationStep('summary');
      } catch (err) {
        setError('Failed to fetch calibration results. Please try again.');
        console.error(err);
        setCalibrationStep('start');
      } finally {
        setIsLoading(false);
      }
    }, 3000);
  };

  const handleRetakeCalibration = () => {
    setCalibrationResults(null);
    setCalibrationStep('start');
  };

  const handleProceedToDashboard = () => {
    navigation.navigate('Home');
  };

  const MetricGroup = ({title, children}) => (
    <View style={styles.metricGroup}>
      <CustomText style={styles.metricGroupTitle}>{title}</CustomText>
      <View style={styles.metricGroupContent}>{children}</View>
    </View>
  );

  const MetricItem = ({label, value, status}) => (
    <View style={[styles.metricItem, styles[`metric${status}`]]}>
      <CustomText style={styles.metricLabel}>{label}</CustomText>
      <CustomText style={styles.metricValue}>{value}</CustomText>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <CustomText style={styles.loadingText}>
            Calibrating your posture... Please hold still.
          </CustomText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>{error}</CustomText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleStartCalibration}>
            <CustomText style={styles.retryButtonText}>Try Again</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (calibrationStep === 'summary' && calibrationResults) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Calibration Summary</CustomText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.reportContainer}>
            <MetricGroup title="Your Posture Score">
              <View style={styles.scoreContainer}>
                <CustomText style={styles.scoreValue}>
                  {calibrationResults.postureScore}/100
                </CustomText>
                <CustomText style={styles.scoreDescription}>
                  {calibrationResults.visualBreakdown.overallAssessment}
                </CustomText>
              </View>
            </MetricGroup>

            <MetricGroup title="Visual Breakdown">
              {calibrationResults.visualBreakdown.keyMetrics.map((metric, index) => (
                <View key={index} style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <CustomText style={styles.metricName}>{metric.name}</CustomText>
                    <CustomText style={styles.metricValue}>{metric.value}</CustomText>
                  </View>
                  {metric.comment && (
                    <CustomText style={styles.metricComment}>{metric.comment}</CustomText>
                  )}
                </View>
              ))}
            </MetricGroup>

            <MetricGroup title="Improvement Goals">
              {calibrationResults.goalSuggestions.map((goal, index) => (
                <View key={index} style={styles.goalCard}>
                  <CustomText style={styles.goalTitle}>{goal.title}</CustomText>
                  <CustomText style={styles.goalDescription}>
                    {goal.description}
                  </CustomText>
                </View>
              ))}
            </MetricGroup>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.retakeButton]}
                onPress={handleRetakeCalibration}>
                <CustomText style={styles.actionButtonText}>
                  Retake Calibration
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.proceedButton]}
                onPress={handleProceedToDashboard}>
                <CustomText style={styles.actionButtonText}>Proceed</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
        <CustomText style={styles.headerTitle}>Posture Calibration</CustomText>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {calibrationStep === 'start' ? (
          <View style={styles.startContainer}>
            <CustomText style={styles.startDescription}>
              Let's calibrate your posture. Please stand or sit in your usual
              comfortable position.
            </CustomText>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartCalibration}>
              <CustomText style={styles.startButtonText}>
                Start Calibration
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.calibratingContainer}>
            <WebRTCViewer onStop={() => setCalibrationStep('start')} />
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  calibratingContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#4CAF50',
    fontSize: 18,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  reportContainer: {
    padding: 20,
  },
  metricGroup: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  metricGroupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  metricGroupContent: {
    gap: 12,
  },
  metricItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  metricComment: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  scoreDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  metricgood: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  metricwarning: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  metricpoor: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
});

export default CalibrationScreen; 