import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

const QuanLyChoThueScreen: React.FC = () => {

  const menuItems = [
    {
      id: "them-vatdung",
      title: "Thêm vật dụng cho thuê",
      description: "Thêm vật dụng mới vào danh mục cho thuê",
      icon: "➕",
      screen: "ThemVatDungScreen",
    },
    {
      id: "capnhat-vatdung",
      title: "Cập nhật vật dụng",
      description: "Chỉnh sửa thông tin vật dụng đã có",
      icon: "✏️",
      screen: "CapNhatVatDungScreen",
    },
    {
      id: "xoa-vatdung",
      title: "Xóa vật dụng",
      description: "Xóa vật dụng khỏi danh mục cho thuê",
      icon: "🗑️",
      screen: "XoaVatDungScreen",
    },
    {
      id: "danhsach-vatdung",
      title: "Danh sách vật dụng của tôi",
      description: "Xem tất cả vật dụng bạn đang cho thuê",
      icon: "📋",
      screen: "DanhSachVatDungChuSoHuuScreen",
    },
    {
      id: "capnhat-phieumuon",
      title: "Cập nhật phiếu mượn",
      description: "Cập nhật trạng thái phiếu mượn trả",
      icon: "📝",
      screen: "CapNhatPhieuMuonScreen",
    },
    {
      id: "xoa-phieumuon",
      title: "Xóa phiếu mượn",
      description: "Xóa phiếu mượn trả",
      icon: "❌",
      screen: "XoaPhieuMuonScreen",
    },
  ];

  const handleMenuPress = (screenName: string) => {
    // @ts-ignore - Navigation type sẽ được định nghĩa sau
    navigation.navigate(screenName);
  };

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.screen)}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuDescription}>{item.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý cho thuê đồ</Text>
        <Text style={styles.headerSubtitle}>
          Quản lý vật dụng và phiếu mượn trả
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  arrowContainer: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 24,
    color: "#bdc3c7",
    fontWeight: "300",
  },
});

export default QuanLyChoThueScreen;
