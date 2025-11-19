# EUC BLE Connector Test App

This is a React Native test application for the `euc-ble-connector` library.

## Prerequisites

- Node.js >= 16
- React Native development environment set up
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

## Setup

1. Install dependencies:
```bash
npm install
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

## Running the App

### Important: Start Metro Bundler First

**Before running the app, you MUST start the Metro bundler in a separate terminal:**

```bash
npm start
```

Or if you need to clear the cache:
```bash
npm start -- --reset-cache
```

Keep this terminal running while developing. The Metro bundler serves your JavaScript bundle to the app.

### iOS

**Option 1: Using npm (recommended)**
```bash
npm run ios
```
This will automatically start Metro bundler and launch the app.

**Option 2: Using Xcode directly**
1. Start Metro bundler in a terminal: `npm start`
2. Open `ios/EucBleConnectorTest.xcworkspace` in Xcode
3. Select your target device/simulator
4. Press Cmd+R to build and run

**Note:** If you see "No bundle URL present" error, make sure Metro bundler is running!

### Android
```bash
npm run android
```
This will automatically start Metro bundler and launch the app.

## Library Location

The app is configured to use the library from:
`C:\Users\kolew\Documents\Projekty\euc-ble-connector`

The library is linked via the `file:../euc-ble-connector` path in `package.json`.

## Features

- Scan for BLE devices
- Connect to discovered devices
- Display Bluetooth state
- Handle device connection/disconnection events

## Troubleshooting

### "No bundle URL present" Error

If you see this error when opening the app:

```
No bundle URL present.
Make sure you're running a packager server or have included a .jsbundle file in your application bundle.
```

**Solution:**
1. Open a terminal in the project root
2. Run `npm start` to start the Metro bundler
3. Wait for Metro to start (you'll see "Metro waiting on port 8081")
4. Rebuild and run your app from Xcode

**For Release builds:** If you're building a release version, you need to create a bundled JS file:
```bash
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios
```

### Missing .xcworkspace File Error

If you see an error about missing `.xcworkspace` file when starting Metro:

**On Windows:**
- Metro bundler should still work for Android development even without the workspace file
- The workspace file is only needed for iOS development on macOS
- You can ignore this warning if you're only developing for Android on Windows

**On macOS:**
- The `.xcworkspace` file is created when you run `pod install`
- Run this command in the `ios` directory:
  ```bash
  cd ios
  pod install
  cd ..
  ```
- This will create `EucBleConnectorTest.xcworkspace` which you should use instead of `.xcodeproj` when opening in Xcode

### Folly timedef Build Error

If you encounter a "rct folly timedef" error when building, try the following:

#### For iOS (Xcode on Mac):

1. Clean the iOS build and reinstall pods:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

2. Clean Xcode build folder:
   - In Xcode: Product → Clean Build Folder (Shift + Cmd + K)
   - Or from terminal: `rm -rf ~/Library/Developer/Xcode/DerivedData`

3. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

4. Clear Metro bundler cache:
```bash
npm start -- --reset-cache
```

The Podfile includes a fix in the `post_install` hook to add the necessary compiler flags for Folly. The Xcode project file has also been updated with the required preprocessor definitions.

**Important:** After pulling these changes, you MUST:
1. Delete `ios/Pods` and `ios/Podfile.lock`
2. Run `pod install` in the `ios` directory
3. Clean the Xcode build folder (Shift + Cmd + K)
4. Close and reopen Xcode if the issue persists

#### For Android (Windows):

1. Clean the Android build:
```bash
cd android
gradlew.bat clean
cd ..
```

2. Delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

3. Clear Metro bundler cache:
```bash
npm start -- --reset-cache
```

4. If the issue persists, ensure your Android NDK version matches the one specified in `android/build.gradle` (currently NDK 23.1.7779620).

The project includes configuration fixes in `android/app/build.gradle` and `android/gradle.properties` to help prevent this issue.

