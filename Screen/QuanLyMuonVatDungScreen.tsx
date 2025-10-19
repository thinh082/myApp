import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon' | 'quanlymuonvatdung' | 'cacvatdungdamuon' | 'thongtincanhan';

interface QuanLyMuonVatDungScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const QuanLyMuonVatDungScreen: React.FC<QuanLyMuonVatDungScreenProps> = ({ onNavigate }) => {

  const menuItems = [
    {
      id: "cac-vatdung-damuon",
      title: "Các vật dụng đã mượn",
      description: "Xem danh sách vật dụng bạn đã mượn",
      icon: "📋",
      screen: "cacvatdungdamuon" as Screen,
    },
    {
      id: "thong-tin-ca-nhan",
      title: "Thông tin cá nhân",
      description: "Xem và cập nhật thông tin cá nhân",
      icon: "👤",
      screen: "thongtincanhan" as Screen,
    },
    {
      id: "danh-sach-vatdung",
      title: "Danh sách vật dụng",
      description: "Xem tất cả vật dụng có thể mượn",
      icon: "📦",
      screen: "danhsachvatdung" as Screen,
    },
  ];

  const handleMenuPress = (screenName: Screen) => {
    console.log('Navigate to:', screenName);
    onNavigate(screenName);
  };

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.screen)}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemIcon}>
          <Text style={styles.menuItemIconText}>{item.icon}</Text>
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
        </View>
        <View style={styles.menuItemArrow}>
          <Text style={styles.menuItemArrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Quản lý mượn vật dụng</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý việc mượn và trả vật dụng
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => onNavigate('dangnhap')}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ecf0f1",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  menuItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemIconText: {
    fontSize: 28,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  menuItemArrow: {
    marginLeft: 12,
  },
  menuItemArrowText: {
    fontSize: 24,
    color: "#bdc3c7",
    fontWeight: "bold",
  },
});

export default QuanLyMuonVatDungScreen;
