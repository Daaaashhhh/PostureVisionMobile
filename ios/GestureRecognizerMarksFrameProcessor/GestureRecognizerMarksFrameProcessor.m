#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("PostureVisionMobile/PostureVisionMobile-Swift.h")
#import "PostureVisionMobile/PostureVisionMobile-Swift.h"
#else
#import "PostureVisionMobile-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(GestureRecognizerMarksFrameProcessorPlugin, gestureRecognizerMarks)