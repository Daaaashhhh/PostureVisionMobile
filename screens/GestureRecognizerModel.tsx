import {PaintStyle, Skia} from '@shopify/react-native-skia';
import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, useWindowDimensions, ScrollView} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  VisionCameraProxy,
  Frame,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import {Worklets} from 'react-native-worklets-core';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('gestureRecognizerMarks', {});

export function gestureRecognizerMarks(frame: Frame) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame);
}

// Define hand connections for visualization
const handConnections = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // index finger
  [0, 9], [9, 10], [10, 11], [11, 12],      // middle finger
  [0, 13], [13, 14], [14, 15], [15, 16],    // ring finger
  [0, 17], [17, 18], [18, 19], [19, 20],    // pinky
  [5, 9], [9, 13], [13, 17],                // palm
];

type Question = {
  id: number;
  text: string;
};

const questions: Question[] = [
  {
    id: 1,
    text: 'Are you experiencing neck pain from looking down at devices?'
  },
  {
    id: 2,
    text: 'Do you sit for more than 4 hours continuously?'
  },
  {
    id: 3,
    text: 'Do you maintain proper shoulder alignment while sitting?'
  },
  {
    id: 4,
    text: 'Do you take regular breaks to stretch?'
  },
  {
    id: 5,
    text: 'Is your computer screen at eye level?'
  },
  {
    id: 6,
    text: 'Do you use proper lumbar support while sitting?'
  },
  {
    id: 7,
    text: 'Do you experience lower back pain?'
  },
  {
    id: 8,
    text: 'Are your feet flat on the ground while sitting?'
  }
];

function GestureRecognizerModel(): React.JSX.Element {
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [gestureText, setGestureText] = useState<string>('');
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: boolean}>({});
  const [showResults, setShowResults] = useState(false);
  const [lastGestureTime, setLastGestureTime] = useState(0);

  // Create a worklet function to update gesture text
  const updateGestureText = useCallback((text: string) => {
    setGestureText(text);
  }, []);

  // Create the JS function using the new API
  const updateGestureTextJS = Worklets.createRunOnJS(updateGestureText);
  // OR you can use this alternative syntax:
  // const updateGestureTextJS = (text: string) => Worklets.runOnJS(updateGestureText)(text);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Paint for landmarks
  const landmarkPaint = Skia.Paint();
  landmarkPaint.setStyle(PaintStyle.Fill);
  landmarkPaint.setStrokeWidth(2);
  landmarkPaint.setColor(Skia.Color('yellow'));

  // Paint for connections
  const connectionPaint = Skia.Paint();
  connectionPaint.setStyle(PaintStyle.Stroke);
  connectionPaint.setStrokeWidth(2);
  connectionPaint.setColor(Skia.Color('cyan'));

  // Function to handle answers
  const handleAnswer = useCallback((gesture: string) => {
    const currentTime = Date.now();
    // Prevent multiple gestures within 2 seconds
    if (currentTime - lastGestureTime < 2000) return;
    
    if (gesture === 'Thumb_Up' || gesture === 'Thumb_Down') {
      const answer = gesture === 'Thumb_Up';
      setAnswers(prev => ({...prev, [questions[currentQuestionIndex].id]: answer}));
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
      }
      
      setLastGestureTime(currentTime);
    }
  }, [currentQuestionIndex, lastGestureTime]);

  // Create the JS function using Worklets
  const handleAnswerJS = Worklets.createRunOnJS(handleAnswer);

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';
    const data = gestureRecognizerMarks(frame);
    frame.render();

    const frameWidth = frame.width;
    const frameHeight = frame.height;

    if (data && data.length > 0) {
      for (const hand of data) {
        const landmarks = hand.landmarks;
        const gesture = hand.gesture;
        const score = hand.score;
        const handedness = hand.handedness;

        if (score > 0.7) {
          updateGestureTextJS(`${handedness} hand: ${gesture}`);
        }

        // Handle gesture recognition
        if (score > 0.7 && !showResults) {
          handleAnswerJS(gesture);
        }

        // Draw connections
        for (const [start, end] of handConnections) {
          frame.drawLine(
            landmarks[start].x * frameWidth,
            landmarks[start].y * frameHeight,
            landmarks[end].x * frameWidth,
            landmarks[end].y * frameHeight,
            connectionPaint,
          );
        }

        // Draw landmarks
        for (const landmark of landmarks) {
          frame.drawCircle(
            landmark.x * frameWidth,
            landmark.y * frameHeight,
            4,
            landmarkPaint,
          );
        }
      }
    }
  }, [updateGestureTextJS, handleAnswerJS, showResults]);

  // Results component
  const ResultsView = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Your Responses:</Text>
      {questions.map((question) => (
        <View key={question.id} style={styles.resultRow}>
          <Text style={styles.questionText}>{question.text}</Text>
          <Text style={styles.answerText}>
            {answers[question.id] ? '👍 Yes' : '👎 No'}
          </Text>
        </View>
      ))}
      <Text 
        style={styles.resetButton}
        onPress={() => {
          setCurrentQuestionIndex(0);
          setAnswers({});
          setShowResults(false);
        }}>
        Start Over
      </Text>
    </View>
  );

  if (!hasPermission) {
    return <Text>No permission</Text>;
  }
  if (device == null) {
    return <Text>No device</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          fps={30}
          pixelFormat="rgb"
        />
      </View>
      
      {!showResults ? (
        <View style={[
          styles.questionContainer,
          isLandscape && styles.questionContainerLandscape
        ]}>
          <Text style={styles.assessmentTitle}>Posture Assessment</Text>
          <Text style={[
            styles.questionText,
            isLandscape && styles.questionTextLandscape
          ]}>
            {questions[currentQuestionIndex].text}
          </Text>
          <Text style={[
            styles.instructionText,
            isLandscape && styles.instructionTextLandscape
          ]}>
            👍 Thumbs up for Yes | 👎 Thumbs down for No
          </Text>
          <Text style={[
            styles.progressText,
            isLandscape && styles.progressTextLandscape
          ]}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      ) : (
        <View style={[
          styles.resultsContainer,
          isLandscape && styles.resultsContainerLandscape
        ]}>
          <Text style={styles.assessmentTitle}>Posture Assessment Results</Text>
          <ScrollView style={styles.resultsScroll}>
            {questions.map((question) => (
              <View key={question.id} style={[
                styles.resultRow,
                isLandscape && styles.resultRowLandscape
              ]}>
                <Text style={[
                  styles.questionText,
                  styles.resultQuestionText,
                  isLandscape && styles.questionTextLandscape
                ]}>
                  {question.text}
                </Text>
                <Text style={[
                  styles.answerText,
                  isLandscape && styles.answerTextLandscape,
                  answers[question.id] ? styles.positiveAnswer : styles.negativeAnswer
                ]}>
                  {answers[question.id] ? '👍 Yes' : '👎 No'}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Text 
            style={[
              styles.resetButton,
              isLandscape && styles.resetButtonLandscape
            ]}
            onPress={() => {
              setCurrentQuestionIndex(0);
              setAnswers({});
              setShowResults(false);
            }}>
            Retake Assessment
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    flex: 1,
  },
  assessmentTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  questionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  questionContainerLandscape: {
    bottom: 20,
    right: 20,
    left: 'auto',
    width: 350,
  },
  resultsContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderRadius: 15,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resultsContainerLandscape: {
    top: 20,
    right: 20,
    left: 'auto',
    width: 450,
  },
  resultsScroll: {
    maxHeight: '70%',
  },
  questionText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 28,
  },
  resultQuestionText: {
    fontSize: 18,
    textAlign: 'left',
    flex: 1,
    marginRight: 10,
  },
  instructionText: {
    color: '#A8E6CF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  progressText: {
    color: '#FFD3B6',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  positiveAnswer: {
    color: '#A8E6CF',
  },
  negativeAnswer: {
    color: '#FFB6B6',
  },
  resetButton: {
    color: '#A8E6CF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(168,230,207,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default GestureRecognizerModel;
