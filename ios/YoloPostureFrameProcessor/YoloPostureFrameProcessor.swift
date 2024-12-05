import VisionCamera
import UIKit
import CoreML
import Vision

@objc(YoloPostureFrameProcessorPlugin)
public class YoloPostureFrameProcessorPlugin: FrameProcessorPlugin {
    private var model: VNCoreMLModel?
    private let keypointIndexes: [String: Int] = [
        "Center_head": 0, "MidForehead": 1, "Glabella": 2,
        "R_med_canthus": 3, "R_pupil": 4, "R_lat_canthus": 5,
        "L_med_canthus": 6, "L_pupil": 7, "L_lat_canthus": 8,
        "L_tragus": 9, "NoseTip": 10, "R_tragus": 11,
        "R_jaw_angle": 12, "Chin": 13, "L_jaw_angle": 14,
        "L_SCM": 15, "Thyroid_cartilage": 16, "Jugular_notch": 17,
        "R_SCM": 18, "R_ACJ": 19, "Occiput": 20, "C7": 21,
        "L_ACJ": 22
    ]
    
    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
        super.init(proxy: proxy, options: options)
        
        // Load and compile model using .mlpackage
        guard let modelURL = Bundle.main.url(forResource: "best", withExtension: "mlpackage") else {
            print("ERROR: Could not find best.mlpackage in bundle")
            print("Bundle path: \(Bundle.main.bundlePath)")
            if let resources = Bundle.main.urls(forResourcesWithExtension: "mlpackage", subdirectory: nil) {
                print("Available .mlpackage files: \(resources)")
            }
            return
        }
        
        do {
            let config = MLModelConfiguration()
            config.computeUnits = .all
            
            let compiledModel = try MLModel(contentsOf: modelURL, configuration: config)
            self.model = try VNCoreMLModel(for: compiledModel)
            print("Successfully initialized YOLO Posture Model")
        } catch {
            print("Error initializing YOLO Posture Model: \(error)")
            print("Model URL: \(modelURL)")
        }
    }
    
    private func calculateHeadTiltAngle(noseTip: CGPoint, thyroidCartilage: CGPoint) -> Double {
        let dx = noseTip.x - thyroidCartilage.x
        let dy = thyroidCartilage.y - noseTip.y
        let angleRad = atan2(dx, dy)
        return abs(angleRad * 180 / .pi)
    }
    
    private func categorizeTilt(angleDeg: Double) -> String {
        switch angleDeg {
        case 0...5: return "No tilt"
        case 6...10: return "Mild tilt"
        case 11...15: return "Moderate tilt"
        default: return "Severe tilt"
        }
    }
    
    public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
        guard let model = model else {
            print("YOLO Posture Model not initialized")
            return nil
        }
        
        let pixelBuffer = frame.buffer
      let imageRequestHandler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer as! CVPixelBuffer, orientation: .up)
        
        var processingResults: [String: Any]?
        let semaphore = DispatchSemaphore(value: 0)
        
        let request = VNCoreMLRequest(model: model) { [weak self] request, error in
            defer { semaphore.signal() }
            
            guard let self = self,
                  let observations = request.results as? [VNRecognizedPointsObservation],
                  !observations.isEmpty else { 
                processingResults = ["keypoints": [], "angle": 0, "tiltAnalysis": "Unknown"]
                return 
            }
            
            let observation = observations[0] // Take first detection
            guard let points = try? observation.recognizedPoints(forGroupKey: .all) else { 
                processingResults = ["keypoints": [], "angle": 0, "tiltAnalysis": "Unknown"]
                return 
            }
            
            var keypoints: [[String: Any]] = []
            
            // Process keypoints
            for (name, _) in self.keypointIndexes {
                if let point = points[VNRecognizedPointKey(rawValue: name)] {
                    // Only include points with good confidence
                    if point.confidence > 0.5 {
                        keypoints.append([
                            "name": name,
                            "x": point.location.x,
                            "y": 1 - point.location.y, // Flip y coordinate
                            "confidence": point.confidence
                        ])
                    }
                }
            }
            
            // Calculate head tilt if key points are available
            if let noseTip = points[VNRecognizedPointKey(rawValue: "NoseTip")],
               let thyroidCartilage = points[VNRecognizedPointKey(rawValue: "Thyroid_cartilage")],
               noseTip.confidence > 0.5,
               thyroidCartilage.confidence > 0.5 {
                
                let angle = self.calculateHeadTiltAngle(
                    noseTip: noseTip.location,
                    thyroidCartilage: thyroidCartilage.location
                )
                
                processingResults = [
                    "keypoints": keypoints,
                    "angle": angle,
                    "tiltAnalysis": self.categorizeTilt(angleDeg: angle)
                ]
            } else {
                processingResults = [
                    "keypoints": keypoints,
                    "angle": 0,
                    "tiltAnalysis": "Unknown"
                ]
            }
        }
        
        request.imageCropAndScaleOption = .scaleFit
        
        do {
            try imageRequestHandler.perform([request])
            semaphore.wait()
            return processingResults
        } catch {
            print("Error processing frame: \(error)")
            return ["keypoints": [], "angle": 0, "tiltAnalysis": "Error"]
        }
    }
}
