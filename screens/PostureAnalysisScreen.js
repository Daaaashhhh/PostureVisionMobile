import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';

const {width} = Dimensions.get('window');

const PostureAnalysisScreen = ({navigation}) => {
  // Placeholder data specific to posture analysis
  const analysisDate = "2024-07-24";
  const overallStatus = "Needs Improvement";
  const sideViewFindings = {
    forwardHead: {value: "15°", assessment: "Moderate", color: "orange"},
    thoracicKyphosis: {value: "45°", assessment: "Slight Increase", color: "yellow"},
    lumbarLordosis: {value: "35°", assessment: "Within Normal Limits", color: "green"},
  };
  const frontViewFindings = {
    shoulderTilt: {value: "3° Left High", assessment: "Mild Imbalance", color: "yellow"},
    pelvicTilt: {value: "2° Right High", assessment: "Mild Imbalance", color: "yellow"},
  };

  const getStatusColor = (color) => {
    switch (color) {
      case 'green':
        return '#4CAF50';
      case 'yellow':
        return '#FFC107';
      case 'orange':
        return '#FF9800';
      case 'red':
        return '#F44336';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Posture Analysis</CustomText>
          <View style={styles.headerRight} />
        </View>

        {/* Analysis Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <CustomText style={styles.summaryLabel}>Analysis Date:</CustomText>
            <CustomText style={styles.summaryValue}>{analysisDate}</CustomText>
          </View>
          <View style={styles.summaryItem}>
            <CustomText style={styles.summaryLabel}>Overall Status:</CustomText>
            <CustomText
              style={[
                styles.summaryValue,
                {color: getStatusColor(overallStatus === "Needs Improvement" ? 'orange' : 'green')},
              ]}>
              {overallStatus}
            </CustomText>
          </View>
        </View>

        {/* Main Visualization Area */}
        <View style={styles.visualizationArea}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={StyleSheet.absoluteFill}
          />
          <CustomText style={styles.visualizationTitle}>
            Posture Visualization
          </CustomText>
          <CustomText style={styles.visualizationSubtitle}>
            (Image / Skeleton)
          </CustomText>
          <CustomText style={styles.visualizationNote}>
            Visualization controls and annotations here
          </CustomText>
        </View>

        {/* Detailed Findings */}
        <CustomText style={styles.sectionTitle}>Detailed Findings</CustomText>
        <View style={styles.findingsGrid}>
          {/* Side View Card */}
          <View style={styles.metricCard}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
            />
            <CustomText style={styles.cardTitle}>Side View</CustomText>
            <View style={styles.findingsList}>
              {Object.entries(sideViewFindings).map(([key, finding]) => (
                <View key={key} style={styles.findingItem}>
                  <CustomText style={styles.findingLabel}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </CustomText>
                  <CustomText
                    style={[styles.findingValue, {color: getStatusColor(finding.color)}]}>
                    {finding.value} ({finding.assessment})
                  </CustomText>
                </View>
              ))}
            </View>
          </View>

          {/* Front View Card */}
          <View style={styles.metricCard}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
            />
            <CustomText style={styles.cardTitle}>Front View</CustomText>
            <View style={styles.findingsList}>
              {Object.entries(frontViewFindings).map(([key, finding]) => (
                <View key={key} style={styles.findingItem}>
                  <CustomText style={styles.findingLabel}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </CustomText>
                  <CustomText
                    style={[styles.findingValue, {color: getStatusColor(finding.color)}]}>
                    {finding.value} ({finding.assessment})
                  </CustomText>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations Card */}
          <View style={styles.metricCard}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={20}
            />
            <CustomText style={styles.cardTitle}>Recommendations</CustomText>
            <CustomText style={styles.recommendationText}>
              Specific exercises or advice based on findings will appear here.
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
  scrollView: {
    flex: 1,
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
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#FFFFFF',
    marginRight: 8,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  visualizationArea: {
    height: 350,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  visualizationSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  visualizationNote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  findingsGrid: {
    padding: 10,
    gap: 10,
  },
  metricCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  findingsList: {
    gap: 10,
  },
  findingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  findingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  findingValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PostureAnalysisScreen; 