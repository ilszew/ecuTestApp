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
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  
  // If bundle URL is nil, provide a helpful error message
  if (!jsCodeLocation) {
    NSLog(@"Error: Could not find Metro bundler. Make sure you're running 'npm start' or 'react-native start' in a terminal.");
    // Return nil to trigger the error handling in React Native
    return nil;
  }
  
  return jsCodeLocation;
#else
  // In release mode, use the bundled JS file
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

