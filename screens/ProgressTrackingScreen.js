import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';
import {LineChart, BarChart} from 'react-native-chart-kit';

const {width} = Dimensions.get('window');

const ProgressTrackingScreen = ({navigation}) => {
  // Placeholder data
  const timePeriod = "Last 90 Days";
  const overallScoreTrend = {
    data: [65, 68, 70, 75, 72, 78, 80, 85],
    improvement: "+8%",
  };
  const keyMetricTrends = [
    {
      id: 1,
      name: 'Forward Head Angle',
      trend: "-5°",
      chartType: 'line',
      data: [18, 17, 15, 14, 13],
    },
    {
      id: 2,
      name: 'Shoulder Balance',
      trend: "Improved Consistently",
      chartType: 'status',
    },
    {
      id: 3,
      name: 'Lumbar Lordosis',
      trend: "Stable",
      chartType: 'line',
      data: [32, 33, 31, 32, 32],
    },
    {
      id: 4,
      name: 'Exercise Adherence',
      trend: "85%",
      chartType: 'bar',
      data: [70, 80, 75, 85, 90],
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const StatusIndicator = ({status}) => {
    let color = 'rgba(255, 255, 255, 0.7)';
    if (status.toLowerCase().includes('improved')) color = '#4CAF50';
    if (status.toLowerCase().includes('worsened')) color = '#F44336';

    return (
      <View style={styles.statusContainer}>
        <CustomText style={[styles.statusText, {color}]}>{status}</CustomText>
      </View>
    );
  };

  const renderChart = (metric) => {
    const data = {
      labels: ['', '', '', '', ''],
      datasets: [
        {
          data: metric.data,
        },
      ],
    };

    switch (metric.chartType) {
      case 'line':
        return (
          <LineChart
            data={data}
            width={width - 60}
            height={100}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={data}
            width={width - 60}
            height={100}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
          />
        );
      case 'status':
        return <StatusIndicator status={metric.trend} />;
      default:
        return null;
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
          <CustomText style={styles.headerTitle}>Progress Tracking</CustomText>
          <View style={styles.headerRight} />
        </View>

        {/* Time Period Display */}
        <View style={styles.timePeriodContainer}>
          <CustomText style={styles.timePeriodText}>
            Showing progress for:{' '}
            <CustomText style={styles.timePeriodValue}>{timePeriod}</CustomText>
          </CustomText>
        </View>

        {/* Main Progress Chart */}
        <View style={styles.mainChartContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={20}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={StyleSheet.absoluteFill}
          />
          <CustomText style={styles.chartTitle}>
            Overall Posture Score Trend ({overallScoreTrend.improvement})
          </CustomText>
          <LineChart
            data={{
              labels: ['', '', '', '', '', '', '', ''],
              datasets: [{data: overallScoreTrend.data}],
            }}
            width={width - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
          />
        </View>

        {/* Key Metric Trends */}
        <CustomText style={styles.sectionTitle}>Key Metric Trends</CustomText>
        <View style={styles.metricsGrid}>
          {keyMetricTrends.map(metric => (
            <View key={metric.id} style={styles.metricCard}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={20}
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={StyleSheet.absoluteFill}
              />
              <CustomText style={styles.metricName}>{metric.name}</CustomText>
              <CustomText style={styles.metricTrend}>
                Trend: <CustomText style={styles.trendValue}>{metric.trend}</CustomText>
              </CustomText>
              {renderChart(metric)}
            </View>
          ))}
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
  timePeriodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timePeriodText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timePeriodValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mainChartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  metricsGrid: {
    padding: 10,
    gap: 10,
  },
  metricCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  metricName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metricTrend: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
  },
  trendValue: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProgressTrackingScreen; 