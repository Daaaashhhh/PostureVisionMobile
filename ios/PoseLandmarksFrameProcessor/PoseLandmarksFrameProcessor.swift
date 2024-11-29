import VisionCamera
import MediaPipeTasksVision

@objc(PoseLandmarksFrameProcessorPlugin)
public class PoseLandmarksFrameProcessorPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    let buffer = frame.buffer
    
    let options = PoseLandmarkerOptions()
    options.baseOptions.modelAssetPath = "pose_landmarker_full.task"
    options.runningMode = .video
    options.minPoseDetectionConfidence = 0.5
    options.minPosePresenceConfidence = 0.5
    options.minTrackingConfidence = 0.5
    options.numPoses = 1  // Usually 1 pose is enough for most applications
    
    do {
      let poseLandmarker = try PoseLandmarker(options: options)
      let image = try MPImage(sampleBuffer: buffer)
      let result = try poseLandmarker.detect(videoFrame: image, timestampInMilliseconds: Int(frame.timestamp))
      
      var landmarks = [] as Array
      
      for pose in result.landmarks {
        var marks = [] as Array
        
        for posemark in pose {
          marks.append([
            "x": posemark.x,
            "y": posemark.y,
            "z": posemark.z,
            "visibility": posemark.visibility,
            "presence": posemark.presence
          ])
        }
        
        landmarks.append(marks)
      }
      
      return landmarks
    } catch {
      return nil
    }
  }
}