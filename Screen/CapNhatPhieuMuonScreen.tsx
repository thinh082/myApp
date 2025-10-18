import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { 
  getDanhSachPhieuMuonTra, 
  PhieuMuon
} from "../service/phieumuon";
import ChiTietCapNhatScreen from "./ChiTietCapNhatScreen";


const CapNhatPhieuMuonScreen: React.FC = () => {
  const [loadingList, setLoadingList] = useState(true);
  const [phieuMuonList, setPhieuMuonList] = useState<PhieuMuon[]>([]);
  const [selectedPhieuMuon, setSelectedPhieuMuon] = useState<PhieuMuon | null>(null);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Detect screen size changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // Determine if screen is wide enough for side-by-side layout
  const isWideScreen = screenData.width > 768;

  const chuSoHuuId = 1; // Tạm thời hardcode, sau này lấy từ user đăng nhập

  useEffect(() => {
    fetchPhieuMuonList();
  }, []);

  const fetchPhieuMuonList = async () => {
    try {
      setLoadingList(true);
      const data = await getDanhSachPhieuMuonTra();
      // Debug: Log dữ liệu để kiểm tra cấu trúc
      console.log("API Response:", JSON.stringify(data, null, 2));
      
      // API mới không có chuSoHuuId, hiển thị tất cả phiếu mượn
      // TODO: Cần thêm logic lọc theo chủ sở hữu từ backend
      setPhieuMuonList(data);
    } catch (error: any) {
      console.error("Error fetching phieu muon list:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách phiếu mượn: " + error.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectPhieuMuon = (phieuMuon: PhieuMuon) => {
    console.log("Selected phieu muon:", JSON.stringify(phieuMuon, null, 2));
    setSelectedPhieuMuon(phieuMuon);
  };


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getTrangThaiText = (trangThaiId: number) => {
    const statusMap: { [key: number]: string } = {
      1: "Đang mượn",
      2: "Đã trả",
      3: "Quá hạn",
      4: "Hủy",
    };
    return statusMap[trangThaiId] || "Không xác định";
  };

  const getTrangThaiColor = (trangThaiId: number) => {
    const colorMap: { [key: number]: string } = {
      1: "#3498db",
      2: "#27ae60",
      3: "#e74c3c",
      4: "#95a5a6",
    };
    return colorMap[trangThaiId] || "#7f8c8d";
  };

  const renderPhieuMuonItem = ({ item }: { item: PhieuMuon }) => (
    <TouchableOpacity
      style={[
        styles.phieuMuonItem,
        selectedPhieuMuon?.id === item.id && styles.selectedPhieuMuonItem
      ]}
      onPress={() => handleSelectPhieuMuon(item)}
    >
      <View style={styles.phieuMuonItemContent}>
        <Text style={styles.phieuMuonId}>Phiếu #{item.id}</Text>
        <Text style={styles.phieuMuonInfo}>
          Vật dụng: {item.vatDung?.tenVatDung || "Không xác định"} | Số lượng: {item.soLuong}
        </Text>
        <Text style={styles.phieuMuonDate}>
          Mượn: {formatDate(item.ngayMuon)} | Trả dự kiến: {formatDate(item.ngayTraDuKien)}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getTrangThaiColor(item.trangThaiId) }
          ]}>
            <Text style={styles.statusText}>
              {getTrangThaiText(item.trangThaiId)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );


  if (loadingList) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={styles.loadingText}>Đang tải danh sách phiếu mượn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Nếu đã chọn phiếu mượn, hiển thị ChiTietCapNhatScreen
  if (selectedPhieuMuon) {
    return <ChiTietCapNhatScreen phieuMuonId={selectedPhieuMuon.id} onBack={() => setSelectedPhieuMuon(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cập nhật phiếu mượn</Text>
        <Text style={styles.headerSubtitle}>
          Quản lý và cập nhật trạng thái phiếu mượn trả
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Chọn phiếu mượn cần cập nhật:</Text>
          <Text style={styles.debugText}>
            Debug: {phieuMuonList.length} phiếu mượn, Screen width: {screenData.width}px
          </Text>
          <FlatList
            data={phieuMuonList}
            renderItem={renderPhieuMuonItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.phieuMuonList}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>Không có phiếu mượn nào</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#9b59b6",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#7f8c8d",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  phieuMuonList: {
    flex: 1,
  },
  phieuMuonItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedPhieuMuonItem: {
    borderColor: "#9b59b6",
    backgroundColor: "#f4f0f7",
  },
  phieuMuonItemContent: {
    flex: 1,
  },
  phieuMuonId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  phieuMuonInfo: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  phieuMuonDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  debugText: {
    fontSize: 12,
    color: "#e74c3c",
    marginBottom: 8,
    fontStyle: "italic",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyListText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

export default CapNhatPhieuMuonScreen;
