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

