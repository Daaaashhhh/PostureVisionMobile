import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import CustomText from '../CustomText';

// Mock function to fetch analytics data
const fetchAllAnalyticsData = async ({date, type}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data
  return {
    sessions: [
      {
        id: '1',
        date: '2024-03-20',
        type: 'Real-Time Session',
        duration: '30m',
        score: 85,
        cva: 45,
        detailsLink: '/session/1',
      },
      {
        id: '2',
        date: '2024-03-19',
        type: 'Photo Calibration',
        duration: '15m',
        score: 82,
        cva: 43,
        detailsLink: '/session/2',
      },
    ],
    postureScoreTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [65, 70, 75, 72, 80, 85],
        },
      ],
    },
    cvaTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [35, 38, 40, 42, 43, 45],
        },
      ],
    },
  };
};

const AnalyticsScreen = ({navigation}) => {
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [postureScoreData, setPostureScoreData] = useState(null);
  const [cvaData, setCvaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllAnalyticsData({
          date: dateFilter,
          type: typeFilter,
        });
        setFilteredSessions(data.sessions);
        setPostureScoreData(data.postureScoreTrend);
        setCvaData(data.cvaTrend);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setFilteredSessions([]);
        setPostureScoreData(null);
        setCvaData(null);
      }
      setIsLoading(false);
    };

    loadAnalyticsData();
  }, [dateFilter, typeFilter]);

  const chartConfig = {
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#2c2c2c',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0a84ff',
    },
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
          <CustomText style={styles.headerTitle}>Analytics</CustomText>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a84ff" />
          <CustomText style={styles.loadingText}>
            Loading analytics data...
          </CustomText>
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
        <CustomText style={styles.headerTitle}>Analytics</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersCard}>
          <CustomText style={styles.filtersTitle}>Filters</CustomText>
          <View style={styles.filtersRow}>
            <View style={styles.filterInput}>
              <CustomText style={styles.filterLabel}>Date:</CustomText>
              <TextInput
                style={styles.input}
                value={dateFilter}
                onChangeText={setDateFilter}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <View style={styles.filterInput}>
              <CustomText style={styles.filterLabel}>Session Type:</CustomText>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    // Show picker or modal for session type selection
                  }}>
                  <CustomText style={styles.selectButtonText}>
                    {typeFilter === 'all'
                      ? 'All Types'
                      : typeFilter === 'Real-Time Session'
                      ? 'Real-Time Session'
                      : 'Photo Calibration'}
                  </CustomText>
                  <Icon name="chevron-down" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartsContainer}>
          <View style={styles.chartCard}>
            {postureScoreData ? (
              <LineChart
                data={postureScoreData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <CustomText style={styles.noDataText}>
                  No posture score data available
                </CustomText>
              </View>
            )}
            <CustomText style={styles.chartDescription}>
              Tracks improvements in overall posture score from sessions.
            </CustomText>
          </View>

          <View style={styles.chartCard}>
            {cvaData ? (
              <LineChart
                data={cvaData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <CustomText style={styles.noDataText}>
                  No CVA data available
                </CustomText>
              </View>
            )}
            <CustomText style={styles.chartDescription}>
              Monitors changes in head and neck alignment.
            </CustomText>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <CustomText style={styles.timelineTitle}>Session Timeline</CustomText>
          {filteredSessions.length > 0 ? (
            <View style={styles.timelineContainer}>
              {filteredSessions.map((session, index) => (
                <TouchableOpacity
                  key={session.id}
                  style={styles.timelineItem}
                  onPress={() => navigation.navigate('SessionReport', {sessionId: session.id})}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <CustomText style={styles.timelineDate}>
                        {session.date}
                      </CustomText>
                      <View style={styles.sessionTypeBadge}>
                        <CustomText style={styles.sessionTypeText}>
                          {session.type}
                        </CustomText>
                      </View>
                    </View>
                    <CustomText style={styles.timelineDetails}>
                      {`Duration: ${session.duration} | Score: ${session.score} | CVA: ${session.cva}°`}
                    </CustomText>
                    <CustomText style={styles.timelineHint}>
                      Tap to view details
                    </CustomText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <CustomText style={styles.noDataText}>
                No sessions found matching your filters.
              </CustomText>
            </View>
          )}
          <CustomText style={styles.timelineDescription}>
            Chronological view of your past sessions and calibrations.
          </CustomText>
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
  filtersCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  filtersRow: {
    gap: 16,
  },
  filterInput: {
    marginBottom: 12,
  },
  filterLabel: {
    color: '#FFFFFF',
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
  chartsContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  timelineCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  timelineContainer: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0a84ff',
    position: 'absolute',
    left: 0,
    top: 6,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a84ff',
  },
  sessionTypeBadge: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sessionTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineDetails: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timelineHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
  timelineDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

export default AnalyticsScreen; 