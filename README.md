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

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

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

