import VisionCamera
import MediaPipeTasksVision

@objc(GestureRecognizerMarksFrameProcessorPlugin)
public class GestureRecognizerMarksFrameProcessorPlugin: FrameProcessorPlugin {
  private var gestureRecognizer: GestureRecognizer?
  
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
    
    // Get the bundle path for the model file
    guard let modelPath = Bundle.main.path(forResource: "gesture_recognizer", ofType: "task") else {
      print("Error: Could not find gesture_recognizer.task in bundle")
      return
    }
    
    // Initialize the gesture recognizer once during setup
    let options = GestureRecognizerOptions()
    options.baseOptions.modelAssetPath = modelPath
    options.runningMode = .video
    options.minHandDetectionConfidence = 0.5
    options.minHandPresenceConfidence = 0.5
    options.minTrackingConfidence = 0.5
    options.numHands = 2
    
    do {
      gestureRecognizer = try GestureRecognizer(options: options)
      print("Successfully initialized GestureRecognizer")
    } catch {
      print("Error initializing GestureRecognizer: \(error)")
    }
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    guard let gestureRecognizer = gestureRecognizer else {
      print("GestureRecognizer not initialized")
      return nil 
    }
    
    let buffer = frame.buffer
    
    do {
      let image = try MPImage(sampleBuffer: buffer)
      let result = try gestureRecognizer.recognize(videoFrame: image, timestampInMilliseconds: Int(frame.timestamp))
        
      var gestures = [] as [[String: Any]]
      
      // Process each detected hand
      for i in 0..<result.gestures.count {
        let handGestures = result.gestures[i]
        let handLandmarks = result.landmarks[i]
        let handedness = result.handedness[i]
        
        var gestureInfo = [String: Any]()
        
        // Add handedness information
        if let topHandedness = handedness.first {
          gestureInfo["handedness"] = topHandedness.categoryName
          gestureInfo["handednessScore"] = topHandedness.score
        }
        
        // Add gesture categories and scores with debug logging
        if let topGesture = handGestures.first {
          print("Raw gesture category: \(String(describing: topGesture.categoryName))")
          print("Gesture score: \(topGesture.score)")
          
          let mappedGesture: String
          if let categoryName = topGesture.categoryName {
            switch categoryName {
            case "None":
              mappedGesture = "None"
            case "Closed_Fist":
              mappedGesture = "Closed_Fist"
            case "Open_Palm":
              mappedGesture = "Open_Palm"
            case "Pointing_Up":
              mappedGesture = "Pointing_Up"
            case "Thumb_Down":
              mappedGesture = "Thumb_Down"
            case "Thumb_Up":
              mappedGesture = "Thumb_Up"
            case "Victory":
              mappedGesture = "Victory"
            case "ILoveYou":
              mappedGesture = "ILoveYou"
            default:
              mappedGesture = "Unknown: \(categoryName)"
            }
          } else {
            mappedGesture = "Unknown (nil category)"
          }
          
          gestureInfo["gesture"] = mappedGesture
          gestureInfo["score"] = topGesture.score
        }
        
        // Add hand landmarks
        var landmarks = [] as [[String: Any]]
        for landmark in handLandmarks {
          landmarks.append([
            "x": landmark.x,
            "y": landmark.y,
            "z": landmark.z,
            "visibility": landmark.visibility ?? 0,
            "presence": landmark.presence ?? 0
          ])
        }
        gestureInfo["landmarks"] = landmarks
        
        gestures.append(gestureInfo)
      }
      
      return gestures.isEmpty ? nil : gestures
      
    } catch {
      print("Error processing frame: \(error)")
      return nil
    }
  }
}
