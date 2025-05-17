import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';

const AppointmentsScreen = ({navigation}) => {
  // Placeholder data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-08-01',
      time: '10:00 AM',
      specialist: 'Dr. Brian Hutcheson',
      type: 'Follow-up Session',
    },
    {
      id: 2,
      date: '2024-08-15',
      time: '02:30 PM',
      specialist: 'Dr. Brian Hutcheson',
      type: 'Physical Therapy Eval',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      date: '2024-07-15',
      time: '10:00 AM',
      specialist: 'Dr. Brian Hutcheson',
      type: 'Follow-up Session',
    },
    {
      id: 4,
      date: '2024-07-01',
      time: '09:00 AM',
      specialist: 'Dr. Brian Hutcheson',
      type: 'Initial Consultation',
    },
  ];

  // Placeholder action handlers
  const handleScheduleNew = () => {
    Alert.alert('Schedule New', 'Navigate to scheduling interface...');
  };

  const handleReschedule = (id) => {
    Alert.alert('Reschedule', `Initiate reschedule for appointment ID: ${id}`);
  };

  const handleCancel = (id) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            Alert.alert('Cancelled', `Cancelling appointment ID: ${id}`);
            // Add logic to update state/API
          },
        },
      ],
    );
  };

  const handleViewSummary = (id) => {
    Alert.alert('View Summary', `Viewing summary for past appointment ID: ${id}`);
  };

  const AppointmentCard = ({appointment, isPast}) => (
    <View style={styles.appointmentCard}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.appointmentContent}>
        <View style={styles.appointmentInfo}>
          <CustomText style={styles.appointmentDateTime}>
            {appointment.date} at {appointment.time}
          </CustomText>
          <CustomText style={styles.appointmentType}>
            {appointment.type}
          </CustomText>
          <CustomText style={styles.appointmentSpecialist}>
            With: {appointment.specialist}
          </CustomText>
        </View>
        <View style={styles.appointmentActions}>
          {isPast ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => handleViewSummary(appointment.id)}>
              <CustomText style={styles.actionButtonText}>View Summary</CustomText>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => handleReschedule(appointment.id)}>
                <CustomText style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  Reschedule
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.dangerButton]}
                onPress={() => handleCancel(appointment.id)}>
                <CustomText style={[styles.actionButtonText, styles.dangerButtonText]}>
                  Cancel
                </CustomText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Appointments</CustomText>
          <View style={styles.headerRight} />
        </View>

        {/* Schedule New Button */}
        <View style={styles.scheduleButtonContainer}>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleScheduleNew}>
            <Icon name="add" size={20} color="#fff" style={styles.scheduleButtonIcon} />
            <CustomText style={styles.scheduleButtonText}>
              Schedule New Appointment
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments */}
        <CustomText style={styles.sectionTitle}>Upcoming Appointments</CustomText>
        <View style={styles.appointmentsList}>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} isPast={false} />
            ))
          ) : (
            <CustomText style={styles.emptyText}>
              No upcoming appointments scheduled.
            </CustomText>
          )}
        </View>

        {/* Past Appointments */}
        <CustomText style={styles.sectionTitle}>Past Appointments</CustomText>
        <View style={styles.appointmentsList}>
          {pastAppointments.length > 0 ? (
            pastAppointments.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} isPast={true} />
            ))
          ) : (
            <CustomText style={styles.emptyText}>
              No past appointment history.
            </CustomText>
          )}
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
  scheduleButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonIcon: {
    marginRight: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  appointmentsList: {
    padding: 10,
    gap: 10,
  },
  appointmentCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  appointmentContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDateTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appointmentSpecialist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  appointmentActions: {
    marginLeft: 16,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    borderColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
  dangerButton: {
    borderColor: '#F44336',
  },
  dangerButtonText: {
    color: '#F44336',
  },
  viewButton: {
    borderColor: '#4CAF50',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default AppointmentsScreen; 