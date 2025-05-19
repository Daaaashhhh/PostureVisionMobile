import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Modal, Image } from 'react-native';
import { mediaDevices, RTCView, RTCPeerConnection } from 'react-native-webrtc';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const BACKEND_URL = "api.posture.vision";

const determinePostureStatus = (data) => {
  let status = 'neutral';
  const details = { rawData: data };

  if (data && data.hns) {
    if (data.hns.emotions && data.hns.emotions.length > 0) {
      if (data.hns.emotions.includes('Happy')) {
        status = 'good';
      } else if (data.hns.emotions.some(e => ['Sad', 'Angry', 'Surprise'].includes(e))) {
        status = 'poor';
      }
    }
  }
  
  return { status, details };
};

const WebRTCViewer = forwardRef(({ onStop, onPostureUpdate }, ref) => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showTrackingPoints, setShowTrackingPoints] = useState(true);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [calibratedImageSrc, setCalibratedImageSrc] = useState(null);
  const [displayedStatus, setDisplayedStatus] = useState('Status: Waiting for video...');

  const peerRef = useRef(null);
  const peerSocketRef = useRef(null);
  const socketRef = useRef(null);
  const peerId = useRef(Math.floor(100000 + Math.random() * 900000)).current;

  const capturePhoto = () => {
    // In React Native, we'll need to implement photo capture differently
    // This could be done using a native module or a different approach
    console.warn("Photo capture not implemented in React Native version");
    return null;
  };

  useImperativeHandle(ref, () => ({
    startCamera: start,
    stopCamera: stop,
    capturePhoto: capturePhoto,
  }));

  const getVideoDevices = async () => {
    try {
      const devices = await mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting video devices:', error);
      setError('Failed to get available cameras. Please check your device permissions.');
    }
  };

  const handlePermissionError = (error) => {
    console.error('Camera access error:', error);
    let errorMessage = 'Failed to access camera: ';
    
    if (error.name === 'NotAllowedError') {
      errorMessage += 'Camera access was denied. Please allow camera access in your device settings and try again.';
    } else if (error.name === 'NotFoundError') {
      errorMessage += 'No camera found. Please connect a camera and try again.';
    } else if (error.name === 'NotReadableError') {
      errorMessage += 'Camera is already in use by another application. Please close other applications using the camera and try again.';
    } else {
      errorMessage += error.message || 'Please ensure you have granted camera permissions.';
    }
    
    setError(errorMessage);
    setIsActive(false);
  };

  const start = async () => {
    setError(null);
    setCalibratedImageSrc(null);
    
    try {
      // Check camera permissions
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });
      const result = await check(permission);
      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          setError('Camera permission is required to start the camera.');
          return;
        }
      }

      setIsActive(true);
      setModalVisible(true);

      if (availableDevices.length === 0) {
        await getVideoDevices();
      }

      const constraints = { 
        video: {
          ...(selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : {}),
          frameRate: { ideal: 15, max: 15 } 
        }
      };
      
      const localStream = await mediaDevices.getUserMedia(constraints);
      setStream(localStream);

      // Setup WebRTC connection
      peerSocketRef.current = new WebSocket(`wss://${BACKEND_URL}/model/realtime/combined-realtime/offer/${peerId}`);

      peerSocketRef.current.onopen = () => {
        peerRef.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        localStream.getTracks().forEach(track => peerRef.current.addTrack(track, localStream));

        peerRef.current.onicecandidate = event => {
          if (event.candidate) {
            peerSocketRef.current.send(JSON.stringify({ candidate: event.candidate }));
          }
        };

        peerRef.current.createOffer()
          .then(offer => {
            peerRef.current.setLocalDescription(offer);
            peerSocketRef.current.send(JSON.stringify({ sdp: offer }));
          });
      };

      peerSocketRef.current.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data.sdp) {
          peerRef.current.setRemoteDescription(data.sdp);
        } else if (data.candidate) {
          peerRef.current.addIceCandidate(data.candidate);
        }
      };

      // Connect to results WebSocket
      socketRef.current = new WebSocket(`wss://${BACKEND_URL}/model/realtime/combined-realtime/results/${peerId}`);
      socketRef.current.onopen = () => {
        console.log('Connected to object detection/results server');
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (onPostureUpdate) {
          const postureInfo = determinePostureStatus(data);
          onPostureUpdate(postureInfo.status, postureInfo.details);
        }

        if (data.body_status) {
          setDisplayedStatus(`Status: ${data.body_status}`);
        }
      };

      socketRef.current.onclose = () => {
        console.log('Results WebSocket connection closed');
      };

      socketRef.current.onerror = (error) => {
        console.error('Results WebSocket error:', error);
        setError('Connection to posture analysis results failed.');
      };

    } catch (error) {
      handlePermissionError(error);
      setIsActive(false);
    }
  };

  const stop = () => {
    setIsActive(false);
    setModalVisible(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (peerSocketRef.current) {
      peerSocketRef.current.close();
      peerSocketRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (onStop) {
      onStop();
    }
  };

  const handleCalibrate = async () => {
    try {
      const response = await fetch(`https://${BACKEND_URL}/model/realtime/calibrate/${peerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      if (data && data.image) {
        setCalibratedImageSrc(data.image);
      }
    } catch (error) {
      console.error('Error during calibration:', error);
      setError('Failed to calibrate. Please try again.');
    }
  };

  const toggleTrackingPoints = () => {
    setShowTrackingPoints(prevShow => !prevShow);
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              start();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isActive ? '#4CAF50' : '#f44336' }]} />
        
        <TouchableOpacity
          style={[styles.button, styles.startButton, isActive && styles.buttonDisabled]}
          onPress={start}
          disabled={isActive}
        >
          <Text style={styles.buttonText}>Start Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton, !isActive && styles.buttonDisabled]}
          onPress={stop}
          disabled={!isActive}
        >
          <Text style={styles.buttonText}>Stop Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.calibrateButton, !isActive && styles.buttonDisabled]}
          onPress={handleCalibrate}
          disabled={!isActive}
        >
          <Text style={styles.buttonText}>Calibrate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.trackingButton]}
          onPress={toggleTrackingPoints}
        >
          <Text style={styles.buttonText}>
            {showTrackingPoints ? 'Hide Tracking Points' : 'Show Tracking Points'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={stop}
      >
        <View style={styles.modalContainer}>
          {stream && (
            <RTCView
              streamURL={stream.toURL()}
              style={styles.video}
              objectFit="cover"
              mirror
            />
          )}

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{displayedStatus}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={stop}
          >
            <Text style={styles.buttonText}>Close Camera</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {calibratedImageSrc && (
        <View style={styles.calibratedImageContainer}>
          <Text style={styles.calibratedImageTitle}>Calibrated Image:</Text>
          <Image 
            source={{ uri: calibratedImageSrc }}
            style={styles.calibratedImage}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
});

WebRTCViewer.displayName = 'WebRTCViewer';

WebRTCViewer.propTypes = {
  onStop: PropTypes.func,
  onPostureUpdate: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    minWidth: 150,
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  calibrateButton: {
    backgroundColor: '#FF9800',
  },
  trackingButton: {
    backgroundColor: '#2196F3',
  },
  closeButton: {
    backgroundColor: '#f44336',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#f44336',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  retryButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  statusBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  calibratedImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  calibratedImageTitle: {
    color: '#555',
    fontSize: 18,
    marginBottom: 10,
  },
  calibratedImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
});

export default WebRTCViewer;