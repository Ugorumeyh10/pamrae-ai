import { Platform } from 'react-native';

// API Configuration
// Change this to your backend URL based on your testing platform

// For iOS Simulator (Mac):
// export const API_BASE_URL = 'http://localhost:8000';

// For Android Emulator:
// export const API_BASE_URL = 'http://10.0.2.2:8000';

// For Physical Device (replace with your computer's IP):
// Find your IP: Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
//              Windows: ipconfig (look for IPv4 Address)

// Use your computer's IP for physical device testing:
export const API_BASE_URL = 'http://192.168.0.142:8000';

// Auto-detect (uncomment to use instead of fixed IP above):
// export const API_BASE_URL = __DEV__ 
//   ? (Platform.OS === 'ios' 
//       ? 'http://localhost:8000'  // iOS Simulator
//       : 'http://10.0.2.2:8000')   // Android Emulator
//   : 'http://localhost:8000';

