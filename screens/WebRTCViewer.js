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
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);

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

  const setupWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      socketRef.current = new WebSocket(`wss://${BACKEND_URL}/model/realtime/combined-realtime/results/${peerId}`);
      
      socketRef.current.onopen = () => {
        console.log('Connected to object detection/results server', peerId);
        setIsReconnecting(false);
        setError(null);
        
        // Setup ping interval to keep connection alive
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
        
        pingIntervalRef.current = setInterval(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            try {
              socketRef.current.send(JSON.stringify({ 
                type: 'ping',
                timestamp: Date.now()
              }));
            } catch (error) {
              console.error('Error sending ping:', error);
              // If we can't send a ping, the connection might be dead
              socketRef.current.close();
            }
          }
        }, 15000); // Reduced to 15 seconds for more frequent keep-alive
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received data from object detection/results server:', data);
          
          if (data.type === 'pong') {
            return; // Ignore pong messages
          }

          if (data.status === 'waiting') {
            // Handle waiting state
            setDisplayedStatus('Status: Waiting for video stream...');
            return;
          }

          if (data.error) {
            console.error('Server reported error:', data.error);
            setError(`Server error: ${data.error}`);
            return;
          }

          if (onPostureUpdate) {
            const postureInfo = determinePostureStatus(data);
            onPostureUpdate(postureInfo.status, postureInfo.details);
          }

          if (data.body_status) {
            setDisplayedStatus(`Status: ${data.body_status}`);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      socketRef.current.onclose = (event) => {
        console.log('Results WebSocket connection closed', event.code, event.reason);
        clearInterval(pingIntervalRef.current);
        
        // Handle different close codes
        if (event.code === 1001) {
          console.log('Stream end encountered, attempting to reconnect...');
          // For stream end, try to reconnect immediately
          if (isActive && !isReconnecting) {
            setIsReconnecting(true);
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Reconnecting after stream end...');
              setupWebSocket();
            }, 1000); // Shorter delay for stream end
          }
        } else if (event.code === 1006) {
          console.log('Connection closed abnormally, attempting to reconnect...');
          if (isActive && !isReconnecting) {
            setIsReconnecting(true);
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Reconnecting after abnormal closure...');
              setupWebSocket();
            }, 2000);
          }
        } else if (isActive && !isReconnecting) {
          setIsReconnecting(true);
          // For other cases, use normal reconnection delay
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            setupWebSocket();
          }, 3000);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('Results WebSocket error:', error);
        setError('Connection to posture analysis results failed.');
        // Close the connection on error to trigger reconnection
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setError('Failed to establish connection to server');
      if (isActive && !isReconnecting) {
        setIsReconnecting(true);
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Retrying WebSocket setup...');
          setupWebSocket();
        }, 3000);
      }
    }
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
      if (peerSocketRef.current) {
        peerSocketRef.current.close();
      }

      peerSocketRef.current = new WebSocket(`wss://${BACKEND_URL}/model/realtime/combined-realtime/offer/${peerId}`);

      peerSocketRef.current.onopen = () => {
        if (!localStream) {
          console.warn("Local stream not available when trying to create RTCPeerConnection");
          handlePermissionError({ name: "CustomError", message: "Camera stream was lost before WebRTC setup." });
          return;
        }

        if (peerRef.current) {
          peerRef.current.close();
        }

        peerRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:stun.services.mozilla.com' },
            { urls: 'stun:stun.stunprotocol.org:3478' },
            { urls: 'stun:stun.voiparound.com' },
            { urls: 'stun:stun.voipbuster.com' },
            { urls: 'stun:stun.voipstunt.com' },
            { urls: 'stun:stun.xten.com' }
          ],
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require'
        });

        // Monitor connection state
        peerRef.current.onconnectionstatechange = () => {
          if (!peerRef.current) {
            console.log('Connection state event fired after peerRef was cleared');
            return;
          }
          console.log('Connection state:', peerRef.current.connectionState);
          if (peerRef.current.connectionState === 'failed') {
            console.log('Connection failed, attempting to restart...');
            // Ensure peerRef.current still exists before calling restartIce
            if (peerRef.current) {
                peerRef.current.restartIce();
            }
          }
        };

        peerRef.current.oniceconnectionstatechange = () => {
          if (!peerRef.current) {
            console.log('ICE connection state event fired after peerRef was cleared');
            return;
          }
          console.log('ICE connection state:', peerRef.current.iceConnectionState);
          if (peerRef.current.iceConnectionState === 'failed') {
            console.log('ICE connection failed, attempting to restart...');
            // Ensure peerRef.current still exists before calling restartIce
            if (peerRef.current) {
                peerRef.current.restartIce();
            }
          }
        };

        peerRef.current.onicegatheringstatechange = () => {
          console.log('ICE gathering state:', peerRef.current.iceGatheringState);
        };

        peerRef.current.onsignalingstatechange = () => {
          console.log('Signaling state:', peerRef.current.signalingState);
        };

        localStream.getTracks().forEach(track => {
          peerRef.current.addTrack(track, localStream);
        });

        peerRef.current.onicecandidate = event => {
          if (event.candidate && peerSocketRef.current?.readyState === WebSocket.OPEN) {
            try {
              peerSocketRef.current.send(JSON.stringify({ candidate: event.candidate }));
            } catch (error) {
              console.error('Error sending ICE candidate:', error);
            }
          }
        };

        peerRef.current.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
          iceRestart: true
        })
          .then(offer => {
            return peerRef.current.setLocalDescription(offer);
          })
          .then(() => {
            if (peerSocketRef.current?.readyState === WebSocket.OPEN) {
              try {
                peerSocketRef.current.send(JSON.stringify({ sdp: peerRef.current.localDescription }));
              } catch (error) {
                console.error('Error sending offer:', error);
                setError('Failed to establish video connection');
              }
            }
          })
          .catch(error => {
            console.error('Error creating offer:', error);
            setError('Failed to establish video connection');
          });
      };

      peerSocketRef.current.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.sdp) {
            peerRef.current.setRemoteDescription(data.sdp);
          } else if (data.candidate) {
            peerRef.current.addIceCandidate(data.candidate);
          }
        } catch (error) {
          console.error('Error processing peer message:', error);
        }
      };

      peerSocketRef.current.onclose = () => {
        console.log('Peer WebSocket connection closed');
        if (isActive) {
          // Attempt to reconnect the peer connection
          setTimeout(() => {
            if (isActive && peerSocketRef.current?.readyState !== WebSocket.OPEN) {
              console.log('Attempting to reconnect peer connection...');
              start();
            }
          }, 3000);
        }
      };

      // Setup results WebSocket
      setupWebSocket();

    } catch (error) {
      handlePermissionError(error);
      setIsActive(false);
    }
  };

  const stop = () => {
    setIsActive(false);
    setModalVisible(false);
    setIsReconnecting(false);
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
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
      // Remove event listeners before closing and nullifying
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.oniceconnectionstatechange = null;
      peerRef.current.onicegatheringstatechange = null;
      peerRef.current.onsignalingstatechange = null;
      peerRef.current.onicecandidate = null;
      // Potentially other listeners like ontrack, onnegotiationneeded if used

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
          // 'Content-Type': 'application/json' // Not needed for GET request expecting JSON response
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Calibration request failed with status ${response.status}:`, errorText);
        setError(`Failed to calibrate. Server returned status ${response.status}.`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (data && data.image) {
          setCalibratedImageSrc(data.image);
          setError(null); // Clear previous errors on success
        } else {
          console.error('Calibration response did not contain image data:', data);
          setError('Calibration data is invalid. Please try again.');
        }
      } else {
        const responseText = await response.text();
        console.error('Calibration response was not JSON:', responseText);
        setError('Failed to calibrate. Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error during calibration:', error);
      // Check if it's a SyntaxError (JSON parse error) or a different kind of error
      if (error instanceof SyntaxError) {
        setError('Failed to calibrate. Invalid response format from server.');
      } else {
        setError('Failed to calibrate. Please check your connection and try again.');
      }
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

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.button, styles.calibrateButton]}
              onPress={handleCalibrate}
              disabled={!isActive}
            >
              <Text style={styles.buttonText}>Calibrate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={stop}
            >
              <Text style={styles.buttonText}>Close Camera</Text>
            </TouchableOpacity>
          </View>
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
    flex: 1,
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
    bottom: 90,
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
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default WebRTCViewer;