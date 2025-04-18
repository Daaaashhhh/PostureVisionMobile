import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text, Modal, Platform } from 'react-native';
import { mediaDevices, RTCView, RTCPeerConnection } from 'react-native-webrtc';
import Canvas from 'react-native-canvas';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const WebRTCViewer = ({ onStop }) => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const canvasRef = useRef(null);
  const peerRef = useRef(null);
  const peerSocketRef = useRef(null);
  const socketRef = useRef(null);
  const peerId = useRef(Math.floor(100000 + Math.random() * 900000)).current;

  const start = async () => {
    setError(null);
    console.log('Start button pressed');
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
      console.log('Starting camera...');
      const localStream = await mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(localStream);

      // Setup peer connection
      peerSocketRef.current = new WebSocket(`wss://api.posture.vision/ws/${peerId}`);

      peerSocketRef.current.onopen = () => {
        console.log('WebSocket connected');
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
        console.log('onmessessage results connected');
        const data = JSON.parse(event.data);
        if (data.sdp) {
          peerRef.current.setRemoteDescription(data.sdp);
        } else if (data.candidate) {
          peerRef.current.addIceCandidate(data.candidate);
        }
      };

      // Connect to object detection WebSocket
      socketRef.current = new WebSocket(`wss://api.posture.vision/results/${peerId}`);
      socketRef.current.onopen = () => {
        console.log("WebSocket connected to object detection server");
      };

      socketRef.current.onmessage = (event) => {
        console.log('onmessage results connected');
        const { boxes, poses } = JSON.parse(event.data);
        drawBoxesAndKeypoints(boxes, poses);
      };
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure you have granted permissions.');
      setIsActive(false);
    }
  };

  const stop = () => {
    setIsActive(false);
    setModalVisible(false);
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);

    if (peerSocketRef.current) {
      peerSocketRef.current.close();
      peerSocketRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (onStop) onStop();
  };

  const drawBoxesAndKeypoints = async (boxes, poses) => {
    console.log('drawBoxesAndKeypoints');
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = await canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'lime';
      ctx.lineWidth = 2;

      boxes.forEach(box => {
        const x = canvas.width * (1 - box.x - box.w);
        const y = canvas.height * box.y;
        const w = canvas.width * box.w;
        const h = canvas.height * box.h;
        ctx.strokeRect(x, y, w, h);
      });

      poses.forEach((pose, i) => {
        pose.forEach((point, idx) => {
          ctx.beginPath();
          ctx.fillStyle = 'red';
          const x = canvas.width * (1 - point.x);
          const y = canvas.height * point.y;
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

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

          <Canvas
            ref={canvasRef}
            style={styles.canvas}
          />

          <View style={styles.buttonContainer}>
            <Button title="Close Camera" onPress={stop} color="#f44336" />
          </View>
        </View>
      </Modal>

      <View style={styles.buttons}>
        <Button title="Start Camera" onPress={start} disabled={isActive} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '30%',
    zIndex: 20,
  },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 20 },
  error: { color: '#f44336', margin: 10 }
});

export default WebRTCViewer;