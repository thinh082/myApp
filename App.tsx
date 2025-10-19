import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DangNhapScreen from './Screen/DangNhapScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <DangNhapScreen />
    </>
  );
}

