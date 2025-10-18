import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DangNhapScreen from './Screen/DangNhapScreen';
import DanhSachVatDungScreen from './Screen/DanhSachVatDungScreen';
import ChiTietVatDungScreen from './Screen/ChiTietVatDungScreen';
import QuanLyChoThueScreen from './Screen/QuanLyChoThueScreen';
import ThemVatDungScreen from './Screen/ThemVatDungScreen';
import CapNhatPhieuMuonScreen from './Screen/CapNhatPhieuMuonScreen';
import DanhSachVatDungChuSoHuuScreen from './Screen/DanhSachVatDungChuSoHuuScreen';

export default function App() {
  return (
    <QuanLyChoThueScreen   />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
