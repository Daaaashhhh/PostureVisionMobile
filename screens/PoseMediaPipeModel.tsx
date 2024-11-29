import {PaintStyle, Skia} from '@shopify/react-native-skia';
import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  VisionCameraProxy,
  Frame,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('poseLandmarks', {});

export function poseLandmarks(frame: Frame) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame);
}

// Define pose connections for visualization
const poseConnections = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Left arm
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  // Right arm
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
  // Left leg
  [23, 25], [25, 27], [27, 29], [27, 31],
  // Right leg
  [24, 26], [26, 28], [28, 30], [28, 32],
];

function App(): React.JSX.Element {
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Paint for landmarks
  const landmarkPaint = Skia.Paint();
  landmarkPaint.setStyle(PaintStyle.Fill);
  landmarkPaint.setStrokeWidth(2);
  landmarkPaint.setColor(Skia.Color('red'));

  // Paint for connections
  const connectionPaint = Skia.Paint();
  connectionPaint.setStyle(PaintStyle.Fill);
  connectionPaint.setStrokeWidth(4);
  connectionPaint.setColor(Skia.Color('lime'));

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';
    const data = poseLandmarks(frame);
    frame.render();

    const frameWidth = frame.width;
    const frameHeight = frame.height;

    for (const pose of data || []) {
      // Draw connections
      for (const [from, to] of poseConnections) {
        if (
          pose[from].visibility > 0.5 &&
          pose[to].visibility > 0.5
        ) {
          frame.drawLine(
            pose[from].x * Number(frameWidth),
            pose[from].y * Number(frameHeight),
            pose[to].x * Number(frameWidth),
            pose[to].y * Number(frameHeight),
            connectionPaint,
          );
        }
      }

      // Draw landmarks
      for (const landmark of pose) {
        if (landmark.visibility > 0.5) {
          frame.drawCircle(
            landmark.x * Number(frameWidth),
            landmark.y * Number(frameHeight),
            6,
            landmarkPaint,
          );
        }
      }
    }
  }, []);

  if (!hasPermission) {
    return <Text>No permission</Text>;
  }
  if (device == null) {
    return <Text>No device</Text>;
  }
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      fps={30}
      pixelFormat="rgb"
    />
  );
}

export default App;
