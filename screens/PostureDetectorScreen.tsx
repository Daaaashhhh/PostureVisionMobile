import React, {useCallback, useState} from 'react';
import {StyleSheet, View, Text, useWindowDimensions} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  VisionCameraProxy,
  Frame,
} from 'react-native-vision-camera';
import {Worklets} from 'react-native-worklets-core';
import {Skia, Canvas, Path, Circle} from '@shopify/react-native-skia';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('yoloPosture', {});

export function postureDetector(frame: Frame) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame);
}

// Move DrawKeypoints outside of PostureDetectorScreen
const DrawKeypoints = ({ keypoints, width, height }: {
  keypoints: any[];
  width: number;
  height: number;
}) => {
  if (keypoints.length === 0) return null;

  // Find the required keypoints
  const noseTip = keypoints.find(kp => kp.name === 'NoseTip');
  const thyroid = keypoints.find(kp => kp.name === 'Thyroid_cartilage');

  if (!noseTip || !thyroid) return null;

  // Create paths for vertical line and angle line
  const verticalPath = Skia.Path.Make();
  // Draw vertical line from top to bottom of screen through thyroid point
  verticalPath.moveTo(thyroid.x * width, 0);
  verticalPath.lineTo(thyroid.x * width, height);

  // Create angle line from nose tip to thyroid cartilage
  const anglePath = Skia.Path.Make();
  anglePath.moveTo(noseTip.x * width, noseTip.y * height);
  anglePath.lineTo(thyroid.x * width, thyroid.y * height);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Draw vertical reference line */}
      <Path 
        path={verticalPath} 
        color="rgba(255, 0, 0, 0.7)"  // Semi-transparent red
        style="stroke" 
        strokeWidth={2}
      />
      
      {/* Draw angle line */}
      <Path 
        path={anglePath} 
        color="rgba(0, 0, 255, 0.7)"  // Semi-transparent blue
        style="stroke" 
        strokeWidth={2}
      />
      
      {/* Draw keypoints */}
      {keypoints.map((point, index) => (
        <Circle
          key={index}
          cx={point.x * width}
          cy={point.y * height}
          r={4}
          color="rgba(255, 255, 0, 0.8)"  // Semi-transparent yellow
        />
      ))}
    </Canvas>
  );
};

// Add this interface to properly type the frame processor results
interface ProcessorResults {
  tiltAnalysis?: string;
  angle?: number;
  keypoints: Array<{
    name: string;
    x: number;
    y: number;
    confidence: number;
  }>;
}

function PostureDetectorScreen() {
  const [tiltAnalysis, setTiltAnalysis] = useState('');
  const [angle, setAngle] = useState(0);
  const [keypoints, setKeypoints] = useState<any[]>([]);
  const device = useCameraDevice('front');
  const {width, height} = useWindowDimensions();

  // Create a worklet function to update state
  const updateAnalysis = useCallback((analysis: string, newAngle: number, points: any[]) => {
    setTiltAnalysis(analysis);
    setAngle(newAngle);
    setKeypoints(points);
  }, []);

  // Create the JS function using Worklets
  const updateAnalysisJS = Worklets.createRunOnJS(updateAnalysis);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const results = postureDetector(frame) as ProcessorResults;
    
    if (results) {
      console.log('Frame processor results:', JSON.stringify(results));
      updateAnalysisJS(
        results.tiltAnalysis || 'Unknown', 
        results.angle || 0, 
        results.keypoints
      );
    }
  }, []);

  if (!device) return <Text>No camera device</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="rgb"
      />
      <DrawKeypoints keypoints={keypoints} width={width} height={height} />
      <View style={styles.overlay}>
        <Text style={styles.debugText}>
          Keypoints detected: {keypoints.length}
        </Text>
        <Text style={styles.title}>Posture Analysis</Text>
        <Text style={[
          styles.analysisText,
          tiltAnalysis === 'No tilt' ? styles.goodPosture : styles.badPosture
        ]}>
          Head Tilt: {tiltAnalysis}
        </Text>
        <Text style={styles.angleText}>
          Angle: {angle.toFixed(1)}°
        </Text>
        <Text style={styles.instructionText}>
          Keep your head straight and aligned with your spine
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analysisText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  goodPosture: {
    color: '#4CAF50', // Green
  },
  badPosture: {
    color: '#FF5252', // Red
  },
  angleText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    color: '#FFD700', // Gold
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  debugText: {
    color: 'yellow',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default PostureDetectorScreen; 