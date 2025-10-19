import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import DangNhapScreen from './Screen/DangNhapScreen';
import DangKyScreen from './Screen/DangKyScreen';
import QuanLyChoThueScreen from './Screen/QuanLyChoThueScreen';
import DanhSachVatDungScreen from './Screen/DanhSachVatDungScreen';
import ChiTietVatDungScreen from './Screen/ChiTietVatDungScreen';
import ThemVatDungScreen from './Screen/ThemVatDungScreen';
import CapNhatVatDungScreen from './Screen/CapNhatVatDungScreen';
import XoaVatDungScreen from './Screen/XoaVatDungScreen';
import DanhSachVatDungChuSoHuuScreen from './Screen/DanhSachVatDungChuSoHuuScreen';
import CapNhatPhieuMuonScreen from './Screen/CapNhatPhieuMuonScreen';
import XoaPhieuMuonScreen from './Screen/XoaPhieuMuonScreen';
import QuanLyMuonVatDungScreen from './Screen/QuanLyMuonVatDungScreen';
import DanhSachVatDungCuaNguoiMuonScreen from './Screen/DanhSachVatDungCuaNguoiMuonScreen';
import ThongTinCaNhanScreen from './Screen/ThongTinCaNhanScreen';

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon' | 'quanlymuonvatdung' | 'cacvatdungdamuon' | 'thongtincanhan';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dangnhap');
  const [selectedVatDungId, setSelectedVatDungId] = useState<number | null>(null);

  const navigateTo = (screen: Screen, vatDungId?: number) => {
    setCurrentScreen(screen);
    if (vatDungId !== undefined) {
      setSelectedVatDungId(vatDungId);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dangnhap':
        return <DangNhapScreen onNavigate={navigateTo} />;
      case 'dangky':
        return <DangKyScreen onNavigate={navigateTo} />;
      case 'quanlychothue':
        return <QuanLyChoThueScreen onNavigate={navigateTo} />;
      case 'danhsachvatdung':
        return <DanhSachVatDungScreen onNavigate={navigateTo} />;
      case 'chitietvatdung':
        return <ChiTietVatDungScreen onNavigate={navigateTo} vatDungId={selectedVatDungId || 1} />;
      case 'themvatdung':
        return <ThemVatDungScreen onNavigate={navigateTo} />;
      case 'capnhatvatdung':
        return <CapNhatVatDungScreen onNavigate={navigateTo} />;
      case 'xoavatdung':
        return <XoaVatDungScreen onNavigate={navigateTo} />;
      case 'danhsachvatdungchusohuu':
        return <DanhSachVatDungChuSoHuuScreen onNavigate={navigateTo} />;
      case 'capnhatphieumuon':
        return <CapNhatPhieuMuonScreen onNavigate={navigateTo} />;
      case 'xoaphieumuon':
        return <XoaPhieuMuonScreen onNavigate={navigateTo} />;
      case 'quanlymuonvatdung':
        return <QuanLyMuonVatDungScreen onNavigate={navigateTo} />;
      case 'cacvatdungdamuon':
        return <DanhSachVatDungCuaNguoiMuonScreen onNavigate={navigateTo} />;
      case 'thongtincanhan':
        return <ThongTinCaNhanScreen onNavigate={navigateTo} />;
      default:
        return <DangNhapScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
