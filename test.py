from ultralytics import YOLO

# Load the YOLO11 model
model = YOLO("best.pt")

# Export the model to CoreML format
model.export(format="coreml")  # creates 'yolo11n.mlpackage'
