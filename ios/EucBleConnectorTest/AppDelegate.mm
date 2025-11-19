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
  
  // Enable debugging to help find issues
  [settings setJsLocation:@"localhost"];
  
  NSURL *jsCodeLocation = [settings jsBundleURLForBundleRoot:@"index"];
  
  // If bundle URL is nil, try to provide a fallback or helpful error
  if (!jsCodeLocation) {
    NSLog(@"❌ Error: Could not find Metro bundler.");
    NSLog(@"📋 Troubleshooting steps:");
    NSLog(@"   1. Make sure Metro bundler is running: npm start");
    NSLog(@"   2. Check if Metro is running on port 8081: lsof -i :8081");
    NSLog(@"   3. Try resetting Metro cache: npm start -- --reset-cache");
    NSLog(@"   4. Verify you're on the same network (for physical devices)");
    NSLog(@"   5. Check Xcode console for connection errors");
    
    // Try to construct a default URL as last resort
    NSString *jsCodeLocationString = @"http://localhost:8081/index.bundle?platform=ios&dev=true";
    jsCodeLocation = [NSURL URLWithString:jsCodeLocationString];
    
    if (!jsCodeLocation) {
      // If we still can't create a URL, return nil to show the error screen
      return nil;
    }
  }
  
  NSLog(@"✅ Using bundle URL: %@", jsCodeLocation.absoluteString);
  return jsCodeLocation;
#else
  // In release mode, use the bundled JS file
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

