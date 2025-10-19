import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { 
  xoaPhieuMuonTra, 
  getDanhSachPhieuMuonTra, 
  PhieuMuon 
} from "../service/phieumuon";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon';

interface XoaPhieuMuonScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const XoaPhieuMuonScreen: React.FC<XoaPhieuMuonScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [phieuMuonList, setPhieuMuonList] = useState<PhieuMuon[]>([]);
  const [chuSoHuuId, setChuSoHuuId] = useState<number>(1);

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (chuSoHuuId !== 1) {
      fetchPhieuMuonList();
    }
  }, [chuSoHuuId]);

  const loadUserInfo = async () => {
    try {
      const taiKhoanId = await getIdTaiKhoan();
      if (taiKhoanId) {
        setChuSoHuuId(taiKhoanId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    }
  };

  const fetchPhieuMuonList = async () => {
    try {
      setLoadingList(true);
      const data = await getDanhSachPhieuMuonTra();
      // API mới không có chuSoHuuId, hiển thị tất cả phiếu mượn
      // TODO: Cần thêm logic lọc theo chủ sở hữu từ backend
      setPhieuMuonList(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách phiếu mượn: " + error.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDeletePhieuMuon = (phieuMuon: PhieuMuon) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa phiếu mượn #${phieuMuon.id}?\n\nHành động này không thể hoàn tác!`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => confirmDelete(phieuMuon.id),
        },
      ]
    );
  };

  const confirmDelete = async (phieuMuonId: number) => {
    try {
      setLoading(true);
      
      const result = await xoaPhieuMuonTra(phieuMuonId);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã xóa phiếu mượn thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Làm mới danh sách
                fetchPhieuMuonList();
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể xóa phiếu mượn");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể xóa phiếu mượn: " + error.message);
    } finally {
      setLoading(false);
    }
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
    <View style={styles.phieuMuonItem}>
      <View style={styles.phieuMuonItemContent}>
        <Text style={styles.phieuMuonId}>Phiếu #{item.id}</Text>
        <Text style={styles.phieuMuonInfo}>
          Vật dụng: {item.vatDung?.tenVatDung || "Không xác định"} | Số lượng: {item.soLuong}
        </Text>
        <Text style={styles.phieuMuonDate}>
          Mượn: {formatDate(item.ngayMuon)} | Trả dự kiến: {formatDate(item.ngayTraDuKien)}
        </Text>
        {item.ngayTraThucTe && (
          <Text style={styles.phieuMuonDate}>
            Trả thực tế: {formatDate(item.ngayTraThucTe)}
          </Text>
        )}
        {item.ghiChu && (
          <Text style={styles.phieuMuonGhiChu} numberOfLines={2}>
            Ghi chú: {item.ghiChu}
          </Text>
        )}
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
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhieuMuon(item)}
        disabled={loading}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loadingList) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e67e22" />
          <Text style={styles.loadingText}>Đang tải danh sách phiếu mượn...</Text>
        </View>
      </View>
    );
  }

  if (phieuMuonList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Xóa phiếu mượn</Text>
              <Text style={styles.headerSubtitle}>
                Quản lý và xóa phiếu mượn trả
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => onNavigate('quanlychothue')}
            >
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Không có phiếu mượn nào</Text>
          <Text style={styles.emptyDescription}>
            Bạn chưa có phiếu mượn nào để quản lý
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Xóa phiếu mượn</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý và xóa phiếu mượn trả
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('quanlychothue')}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.warningContainer}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          Cẩn thận! Hành động xóa không thể hoàn tác
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{phieuMuonList.length}</Text>
          <Text style={styles.statLabel}>Tổng số phiếu</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {phieuMuonList.filter(item => item.trangThaiId === 1).length}
          </Text>
          <Text style={styles.statLabel}>Đang mượn</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {phieuMuonList.filter(item => item.trangThaiId === 2).length}
          </Text>
          <Text style={styles.statLabel}>Đã trả</Text>
        </View>
      </View>

      <FlatList
        data={phieuMuonList}
        renderItem={renderPhieuMuonItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.phieuMuonList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#e67e22",
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
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    flexDirection: "row",
    alignItems: "center",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },
  phieuMuonList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  phieuMuonItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  phieuMuonItemContent: {
    flex: 1,
    marginRight: 12,
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
    marginBottom: 4,
  },
  phieuMuonGhiChu: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
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
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default XoaPhieuMuonScreen;
