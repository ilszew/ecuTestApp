#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"EucBleConnectorTest";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  // In debug mode, try to get bundle URL from Metro bundler
  RCTBundleURLProvider *settings = [RCTBundleURLProvider sharedSettings];
  
  // Let React Native automatically detect the correct IP address
  // It will use localhost for simulators and the correct IP for physical devices
  // [settings setJsLocation:@"localhost"]; // Removed - let React Native auto-detect
  
  NSURL *jsCodeLocation = [settings jsBundleURLForBundleRoot:@"index"];
  
  // If bundle URL is nil, provide helpful error message
  if (!jsCodeLocation) {
    NSLog(@"❌ Error: Could not find Metro bundler.");
    NSLog(@"📋 Troubleshooting steps:");
    NSLog(@"   1. Make sure Metro bundler is running: npm start");
    NSLog(@"   2. Check if Metro is running on port 8081: lsof -i :8081");
    NSLog(@"   3. Try resetting Metro cache: npm start -- --reset-cache");
    NSLog(@"   4. For physical devices: Ensure device and computer are on the same Wi-Fi network");
    NSLog(@"   5. For physical devices: Shake device and select 'Configure Bundler' to set IP manually");
    NSLog(@"   6. Check Xcode console for connection errors");
    
    // Return nil to show the error screen - don't use localhost fallback as it won't work on physical devices
    return nil;
  }
  
  NSLog(@"✅ Using bundle URL: %@", jsCodeLocation.absoluteString);
  return jsCodeLocation;
#else
  // In release mode, use the bundled JS file
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

