import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import {RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate} from 'react-native-webrtc';
import {WebSocket} from 'react-native-webrtc';
import CustomText from '../CustomText';

const {width} = Dimensions.get('window');

const WebRTCViewer = ({onStop}) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const peerSocketRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);

  const start = useCallback(async () => {
    setError(null);
    setIsActive(true);

    try {
      const peerId = Math.floor(100000 + Math.random() * 900000);
      peerSocketRef.current = new WebSocket(
        `wss://api.posture.vision/ws/${peerId}`,
      );

      peerSocketRef.current.onopen = () => {
        console.log('WebSocket connected to signaling server');

        // Initialize WebRTC peer connection
        const configuration = {
          iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
        };

        peerRef.current = new RTCPeerConnection(configuration);

        // Get user media
        navigator.mediaDevices
          .getUserMedia({video: true, audio: false})
          .then(stream => {
            setStream(stream);
            stream.getTracks().forEach(track => {
              peerRef.current.addTrack(track, stream);
            });
          })
          .catch(err => {
            console.error('Error accessing camera:', err);
            setError('Failed to access camera. Please ensure you have granted camera permissions.');
            setIsActive(false);
          });

        peerRef.current.onicecandidate = event => {
          if (event.candidate) {
            peerSocketRef.current.send(
              JSON.stringify({type: 'candidate', candidate: event.candidate}),
            );
          }
        };

        peerRef.current.ontrack = event => {
          console.log('Received remote track:', event);
        };
      };

      peerSocketRef.current.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'offer') {
            peerRef.current
              .setRemoteDescription(new RTCSessionDescription(data))
              .then(() => {
                return peerRef.current.createAnswer();
              })
              .then(answer => {
                return peerRef.current.setLocalDescription(answer);
              })
              .then(() => {
                peerSocketRef.current.send(
                  JSON.stringify({
                    type: 'answer',
                    sdp: peerRef.current.localDescription,
                  }),
                );
              });
          } else if (data.type === 'candidate') {
            peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      // WebSocket for bounding boxes
      socketRef.current = new WebSocket(
        `wss://api.posture.vision/results/${peerId}`,
      );

      socketRef.current.onmessage = event => {
        const data = JSON.parse(event.data);
        // Handle bounding boxes and poses data
        console.log('Received detection data:', data);
      };
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setError('Failed to initialize WebRTC connection');
      setIsActive(false);
    }
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);

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
  }, [stream, onStop]);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            {backgroundColor: isActive ? '#4CAF50' : '#f44336'},
          ]}
        />
        <TouchableOpacity
          style={[styles.button, styles.startButton, !isActive && styles.disabled]}
          onPress={start}
          disabled={isActive}>
          <CustomText style={styles.buttonText}>Start Camera</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton, isActive && styles.disabled]}
          onPress={stop}
          disabled={!isActive}>
          <CustomText style={styles.buttonText}>Stop Camera</CustomText>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>{error}</CustomText>
        </View>
      )}

      {stream && (
        <RTCView
          streamURL={stream.toURL()}
          style={styles.video}
          objectFit="cover"
          mirror={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 4,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
  video: {
    width: width,
    height: width * (16 / 9),
    backgroundColor: '#000',
  },
});

export default WebRTCViewer; 