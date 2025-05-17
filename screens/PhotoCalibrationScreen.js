import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';
import WebRTCViewer from './WebRTCViewer';

const STEPS = {
  INSTRUCTIONS_START: 'INSTRUCTIONS_START',
  CAPTURE_FRONT: 'CAPTURE_FRONT',
  PREVIEW_FRONT: 'PREVIEW_FRONT',
  CAPTURE_LEFT: 'CAPTURE_LEFT',
  PREVIEW_LEFT: 'PREVIEW_LEFT',
  CAPTURE_RIGHT: 'CAPTURE_RIGHT',
  PREVIEW_RIGHT: 'PREVIEW_RIGHT',
  UPLOADING: 'UPLOADING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR',
};

const stepDetails = {
  [STEPS.INSTRUCTIONS_START]: {
    title: 'Photo Calibration',
    instructions:
      'We need to take three photos to calibrate your posture: Front, Left, and Right views. Please ensure good lighting and a clear background.',
    progress: 0,
  },
  [STEPS.CAPTURE_FRONT]: {
    title: 'Front View',
    instructions: 'Face the camera directly. Align your full body within the frame.',
    progress: 1,
  },
  [STEPS.PREVIEW_FRONT]: {
    title: 'Preview Front View',
    instructions: 'Review your photo. If it looks good, confirm. Otherwise, retake.',
    progress: 1,
  },
  [STEPS.CAPTURE_LEFT]: {
    title: 'Left Side View',
    instructions: 'Turn to your left side. Ensure your full body is visible.',
    progress: 2,
  },
  [STEPS.PREVIEW_LEFT]: {
    title: 'Preview Left View',
    instructions: 'Review your photo. If it looks good, confirm. Otherwise, retake.',
    progress: 2,
  },
  [STEPS.CAPTURE_RIGHT]: {
    title: 'Right Side View',
    instructions: 'Turn to your right side. Ensure your full body is visible.',
    progress: 3,
  },
  [STEPS.PREVIEW_RIGHT]: {
    title: 'Preview Right View',
    instructions: 'Review your photo. If it looks good, confirm. Otherwise, retake.',
    progress: 3,
  },
  [STEPS.UPLOADING]: {
    title: 'Processing',
    instructions: 'Uploading your photos and analyzing posture... Please wait.',
    progress: 4,
  },
  [STEPS.COMPLETED]: {
    title: 'Calibration Complete!',
    instructions: 'Your posture calibration is complete. You can now proceed.',
    progress: 5,
  },
  [STEPS.ERROR]: {
    title: 'Calibration Error',
    instructions: 'Something went wrong. Please try again.',
    progress: 0,
  },
};

const totalStepsForProgressBar = 3; // Front, Left, Right actual captures

const PhotoCalibrationScreen = ({navigation}) => {
  const [currentStep, setCurrentStep] = useState(STEPS.INSTRUCTIONS_START);
  const [photos, setPhotos] = useState({
    front: null,
    left: null,
    right: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const webRTCViewerRef = useRef(null);

  const handleTakePhoto = async () => {
    if (webRTCViewerRef.current) {
      const photoDataUrl = webRTCViewerRef.current.capturePhoto();
      if (photoDataUrl) {
        if (currentStep === STEPS.CAPTURE_FRONT) {
          setPhotos(prev => ({...prev, front: photoDataUrl}));
          setCurrentStep(STEPS.PREVIEW_FRONT);
        } else if (currentStep === STEPS.CAPTURE_LEFT) {
          setPhotos(prev => ({...prev, left: photoDataUrl}));
          setCurrentStep(STEPS.PREVIEW_LEFT);
        } else if (currentStep === STEPS.CAPTURE_RIGHT) {
          setPhotos(prev => ({...prev, right: photoDataUrl}));
          setCurrentStep(STEPS.PREVIEW_RIGHT);
        }
      } else {
        setErrorMessage(
          'Could not capture photo. Camera might not be ready or permissions denied.',
        );
      }
    } else {
      setErrorMessage('Camera component is not available.');
    }
  };

  const handleRetakePhoto = () => {
    if (currentStep === STEPS.PREVIEW_FRONT) {
      setPhotos(prev => ({...prev, front: null}));
      setCurrentStep(STEPS.CAPTURE_FRONT);
    } else if (currentStep === STEPS.PREVIEW_LEFT) {
      setPhotos(prev => ({...prev, left: null}));
      setCurrentStep(STEPS.CAPTURE_LEFT);
    } else if (currentStep === STEPS.PREVIEW_RIGHT) {
      setPhotos(prev => ({...prev, right: null}));
      setCurrentStep(STEPS.CAPTURE_RIGHT);
    }
  };

  const handleConfirmPhoto = () => {
    if (currentStep === STEPS.PREVIEW_FRONT) {
      setCurrentStep(STEPS.CAPTURE_LEFT);
    } else if (currentStep === STEPS.PREVIEW_LEFT) {
      setCurrentStep(STEPS.CAPTURE_RIGHT);
    } else if (currentStep === STEPS.PREVIEW_RIGHT) {
      handleUploadPhotos();
    }
  };

  const handleUploadPhotos = async () => {
    setCurrentStep(STEPS.UPLOADING);
    setErrorMessage('');
    console.log('Uploading photos:', photos);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Upload successful, backend processing complete.');
      setCurrentStep(STEPS.COMPLETED);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Failed to upload photos. Please try again.');
      setCurrentStep(STEPS.ERROR);
    }
  };

  const handleProceed = () => {
    console.log('Proceeding to dashboard or main app...');
    navigation.navigate('Home');
  };

  const handleRetryFromError = () => {
    setErrorMessage('');
    setPhotos({front: null, left: null, right: null});
    setCurrentStep(STEPS.INSTRUCTIONS_START);
  };

  const progress = stepDetails[currentStep]?.progress || 0;
  const progressBarWidth =
    totalStepsForProgressBar > 0
      ? (Math.min(progress, totalStepsForProgressBar) / totalStepsForProgressBar) * 100
      : 0;

  const getPhotoForPreview = () => {
    if (currentStep === STEPS.PREVIEW_FRONT) return photos.front;
    if (currentStep === STEPS.PREVIEW_LEFT) return photos.left;
    if (currentStep === STEPS.PREVIEW_RIGHT) return photos.right;
    return null;
  };

  const renderContent = () => {
    const currentPhoto = getPhotoForPreview();

    return (
      <View style={styles.card}>
        <CustomText style={styles.title}>
          {stepDetails[currentStep].title}
        </CustomText>

        {currentStep !== STEPS.COMPLETED &&
          currentStep !== STEPS.UPLOADING &&
          currentStep !== STEPS.INSTRUCTIONS_START &&
          totalStepsForProgressBar > 0 && (
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${progressBarWidth}%`},
                ]}
              />
            </View>
          )}

        <CustomText style={styles.instructions}>
          {stepDetails[currentStep].instructions}
        </CustomText>

        {errorMessage && (
          <CustomText style={styles.errorText}>{errorMessage}</CustomText>
        )}

        {currentStep.startsWith('CAPTURE_') && (
          <View style={styles.cameraContainer}>
            <WebRTCViewer ref={webRTCViewerRef} />
          </View>
        )}

        {currentStep.startsWith('PREVIEW_') && currentPhoto && (
          <View style={styles.previewContainer}>
            <Image
              source={{uri: currentPhoto}}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          {currentStep === STEPS.INSTRUCTIONS_START && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => setCurrentStep(STEPS.CAPTURE_FRONT)}>
              <CustomText style={styles.buttonText}>Start Calibration</CustomText>
            </TouchableOpacity>
          )}

          {currentStep.startsWith('CAPTURE_') && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleTakePhoto}>
              <CustomText style={styles.buttonText}>Take Photo</CustomText>
            </TouchableOpacity>
          )}

          {currentStep.startsWith('PREVIEW_') && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRetakePhoto}>
                <CustomText style={styles.secondaryButtonText}>Retake</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleConfirmPhoto}>
                <CustomText style={styles.buttonText}>Confirm</CustomText>
              </TouchableOpacity>
            </>
          )}

          {currentStep === STEPS.UPLOADING && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#177ddc" />
              <CustomText style={styles.loadingText}>
                Processing... please wait.
              </CustomText>
            </View>
          )}

          {currentStep === STEPS.COMPLETED && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleProceed}>
              <CustomText style={styles.buttonText}>
                Proceed to Dashboard
              </CustomText>
            </TouchableOpacity>
          )}

          {currentStep === STEPS.ERROR && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleRetryFromError}>
              <CustomText style={styles.buttonText}>Try Again</CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Photo Calibration</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
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
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(0, 55, 107, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#177ddc',
    borderRadius: 5,
  },
  errorText: {
    color: '#f5222d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#177ddc',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#c7c7c7',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
});

export default PhotoCalibrationScreen; 