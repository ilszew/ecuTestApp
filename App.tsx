import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import BleManager, { bleEventEmitter, BleEvents, BleDevice } from 'euc-ble-connector';

function App(): JSX.Element {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [bluetoothState, setBluetoothState] = useState<string>('unknown');
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const scanTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Request permissions
    if (Platform.OS === 'android') {
      requestPermissions();
    }

    // Check Bluetooth state
    checkBluetoothState();

    // Set up event listeners
    const deviceDiscoveredListener = bleEventEmitter.addListener(
      BleEvents.DEVICE_FOUND,
      (device: BleDevice) => {
        setDevices(prevDevices => {
          const exists = prevDevices.find(d => d.id === device.id);
          if (exists) {
            return prevDevices;
          }
          return [...prevDevices, device];
        });
      }
    );

    const deviceConnectedListener = bleEventEmitter.addListener(
      BleEvents.DEVICE_CONNECTED,
      (deviceId: string) => {
        setConnectedDevice(deviceId);
        Alert.alert('Connected', `Connected to device: ${deviceId}`);
      }
    );

    const deviceDisconnectedListener = bleEventEmitter.addListener(
      BleEvents.DEVICE_DISCONNECTED,
      (deviceId: string) => {
        if (connectedDevice === deviceId) {
          setConnectedDevice(null);
        }
        Alert.alert('Disconnected', `Disconnected from device: ${deviceId}`);
      }
    );

    // Cleanup function
    return () => {
      deviceDiscoveredListener.remove();
      deviceConnectedListener.remove();
      deviceDisconnectedListener.remove();
      // Clear scan timeout if component unmounts
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      // Always try to stop scanning on unmount (safe to call even if not scanning)
      BleManager.stopScan().catch(error => {
        // Ignore errors if scan wasn't active
        if (error && !error.message?.includes('not scanning')) {
          console.error('Error stopping scan on unmount:', error);
        }
      });
    };
  }, [connectedDevice]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    }
  };

  const checkBluetoothState = async () => {
    try {
      const state = await BleManager.getBleState();
      setBluetoothState(state);
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
    }
  };

  const startScan = async () => {
    // Prevent multiple simultaneous scans
    if (isScanning) {
      return;
    }

    try {
      setDevices([]);
      setIsScanning(true);
      await BleManager.startScan();
      
      // Clear any existing timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      
      // Stop scan after 10 seconds
      scanTimeoutRef.current = setTimeout(async () => {
        await stopScan();
        scanTimeoutRef.current = null;
      }, 10000);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      Alert.alert('Error', `Failed to start scan: ${error}`);
    }
  };

  const stopScan = async () => {
    try {
      // Clear timeout if scan is stopped manually
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
      await BleManager.stopScan();
      setIsScanning(false);
    } catch (error) {
      console.error('Error stopping scan:', error);
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      await BleManager.connect(deviceId);
      console.log('Connected to device:', deviceId);
    } catch (error) {
      console.error('Error connecting to device:', error);
      Alert.alert('Error', `Failed to connect: ${error}`);
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;
    
    try {
      await BleManager.disconnect(connectedDevice);
      setConnectedDevice(null);
    } catch (error) {
      console.error('Error disconnecting device:', error);
      Alert.alert('Error', `Failed to disconnect: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>EUC BLE Connector Test</Text>
        <Text style={styles.state}>
          Bluetooth State: {bluetoothState}
        </Text>
        {connectedDevice && (
          <Text style={styles.connected}>
            Connected: {connectedDevice.substring(0, 8)}...
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={startScan}
          disabled={isScanning}>
          <Text style={styles.buttonText}>
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </Text>
        </TouchableOpacity>

        {isScanning && (
          <>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity
              style={styles.button}
              onPress={stopScan}>
              <Text style={styles.buttonText}>Stop Scan</Text>
            </TouchableOpacity>
          </>
        )}

        {connectedDevice && (
          <>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity
              style={[styles.button, styles.buttonDanger]}
              onPress={disconnectDevice}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView style={styles.deviceList}>
        <Text style={styles.deviceListTitle}>
          Discovered Devices ({devices.length})
        </Text>
        {devices.length === 0 && (
          <Text style={styles.emptyText}>
            No devices found. Press "Start Scan" to begin scanning.
          </Text>
        )}
        {devices.map(device => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceItem,
              connectedDevice === device.id && styles.deviceItemConnected
            ]}
            onPress={() => connectToDevice(device.id)}>
            <Text style={styles.deviceName}>
              {device.name || 'Unknown Device'}
            </Text>
            <Text style={styles.deviceId}>{device.id}</Text>
            {connectedDevice === device.id && (
              <Text style={styles.connectedLabel}>● Connected</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  state: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  connected: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceList: {
    flex: 1,
    padding: 20,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deviceItemConnected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#f1f8f4',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  connectedLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default App;

