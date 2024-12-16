import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import io from 'socket.io-client';

const VideoCameraStream = () => {
  const [selectedView, setSelectedView] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [tiltAnalysis, setTiltAnalysis] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
 
  const camera = useRef(null);
  const socket = useRef(null);
  const device = useCameraDevice('front');
  useEffect(() => {
    const getPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      setHasPermission(newCameraPermission === 'granted');
    };
    getPermission();
  }, []);

  const handleViewSelection = (view) => {
    setSelectedView(view);
    setProcessedImage(null);
    setTiltAnalysis(null);

    if (!socket.current) {
      socket.current = io('http://209.38.17.88:5000', { transports: ['websocket'] });

      socket.current.on('connect', () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      });

      socket.current.on('frame_response', (data) => {
       
        if (data.processed_frame) {
          setProcessedImage(`data:image/jpeg;base64,${data.processed_frame}`);
        }
        if (data.tilt_analysis) {
          setTiltAnalysis(data.tilt_analysis);
        }
      });

      socket.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      });
    }
  };

  useEffect(() => {
    if (selectedView && isConnected && camera.current) {
      const interval = setInterval(async () => {
        try {
          const photo = await camera.current.takePhoto({
            qualityPrioritization: 'speed',
            flash: 'off',
            enableAutoRedEyeReduction: false,
          });

          if (photo?.path) {
            // Convert photo to base64 and send to server
            // Note: You'll need to implement the conversion to base64
            // socket.current.emit('process_frame', { frame: base64Data, view: selectedView });
          }
        } catch (error) {
          console.error('Error capturing frame:', error);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [selectedView, isConnected]);

  console.log('hasPermission', isConnected);

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedView ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleViewSelection('Frontview')}>
            <Text style={styles.buttonText}>Frontview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleViewSelection('Right-sideview')}>
            <Text style={styles.buttonText}>Right-sideview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleViewSelection('Left-sideview')}>
            <Text style={styles.buttonText}>Left-sideview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleViewSelection('Backview')}>
            <Text style={styles.buttonText}>Backview</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Text style={styles.title}>{selectedView} Analysis</Text>
          <Camera
            ref={camera}
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
          />
          {processedImage && (
            <Image
              source={{ uri: processedImage }}
              style={styles.processedImage}
            />
          )}
          {tiltAnalysis && (
            <Text style={styles.analysisText}>
              <Text style={styles.bold}>Tilt Analysis:</Text> {tiltAnalysis}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (4/3),
  },
  processedImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (4/3),
    resizeMode: 'contain',
  },
  analysisText: {
    padding: 10,
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});

export default VideoCameraStream;