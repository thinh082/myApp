import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { getDanhSachPhieuMuonTraTheoNguoiMuon, PhieuMuon } from "../service/phieumuon";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon' | 'quanlymuonvatdung' | 'cacvatdungdamuon' | 'thongtincanhan';

interface DanhSachVatDungCuaNguoiMuonScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const DanhSachVatDungCuaNguoiMuonScreen: React.FC<DanhSachVatDungCuaNguoiMuonScreenProps> = ({ onNavigate }) => {
  const [phieuMuonList, setPhieuMuonList] = useState<PhieuMuon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nguoiMuonId, setNguoiMuonId] = useState<number>(1);

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (nguoiMuonId !== 1) {
      fetchPhieuMuonList();
    }
  }, [nguoiMuonId]);

  const loadUserInfo = async () => {
    try {
      const taiKhoanId = await getIdTaiKhoan();
      if (taiKhoanId) {
        setNguoiMuonId(taiKhoanId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
    }
  };

  const fetchPhieuMuonList = async () => {
    try {
      setLoading(true);
      const data = await getDanhSachPhieuMuonTraTheoNguoiMuon(nguoiMuonId);
      console.log(data)
      setPhieuMuonList(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách phiếu mượn: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhieuMuonList();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusColor = (trangThaiId: number) => {
    switch (trangThaiId) {
      case 1: return '#f39c12'; // Đang mượn
      case 2: return '#2ecc71'; // Đã trả
      case 3: return '#e74c3c'; // Quá hạn
      default: return '#95a5a6';
    }
  };

  const getStatusText = (trangThaiId: number) => {
    switch (trangThaiId) {
      case 1: return 'Đang mượn';
      case 2: return 'Đã trả';
      case 3: return 'Quá hạn';
      default: return 'Không xác định';
    }
  };

  const renderPhieuMuonItem = ({ item }: { item: PhieuMuon }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <View style={styles.itemMainContent}>
          {/* Hình ảnh vật dụng */}
          <View style={styles.imageContainer}>
            {item.vatDung?.hinhAnh ? (
              <Image
                source={{ uri: item.vatDung.hinhAnh }}
                style={styles.itemImage}
                resizeMode="cover"
                onError={() => {
                  console.log('Lỗi tải hình ảnh:', item.vatDung?.hinhAnh);
                }}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>

          {/* Thông tin phiếu mượn */}
          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.vatDung?.tenVatDung || 'Không có tên'}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.trangThaiId) }
              ]}>
                <Text style={styles.statusText}>
                  {getStatusText(item.trangThaiId)}
                </Text>
              </View>
            </View>

            {item.vatDung?.moTa && (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.vatDung.moTa}
              </Text>
            )}

            <View style={styles.itemDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Số lượng:</Text>
                <Text style={styles.detailValue}>{item.soLuong}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngày mượn:</Text>
                <Text style={styles.detailValue}>{formatDate(item.ngayMuon)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hạn trả:</Text>
                <Text style={[
                  styles.detailValue,
                  { color: item.trangThaiId === 3 ? '#e74c3c' : '#2c3e50' }
                ]}>
                  {formatDate(item.ngayTraDuKien)}
                </Text>
              </View>
              {item.ngayTraThucTe && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ngày trả:</Text>
                  <Text style={styles.detailValue}>{formatDate(item.ngayTraThucTe)}</Text>
                </View>
              )}
            </View>

            {item.ghiChu && (
              <Text style={styles.noteText}>
                Ghi chú: {item.ghiChu}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Chưa có phiếu mượn nào</Text>
      <Text style={styles.emptyDescription}>
        Bạn chưa mượn vật dụng nào trong hệ thống
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Làm mới</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Các vật dụng đã mượn</Text>
              <Text style={styles.headerSubtitle}>
                Danh sách vật dụng bạn đã mượn
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => onNavigate('quanlymuonvatdung')}
            >
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Đang tải danh sách phiếu mượn...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Các vật dụng đã mượn</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('quanlymuonvatdung')}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={phieuMuonList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPhieuMuonItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
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
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemContent: {
    padding: 20,
  },
  itemMainContent: {
    flexDirection: "row",
  },
  imageContainer: {
    marginRight: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 32,
    color: "#6c757d",
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 16,
  },
  itemDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "600",
  },
  noteText: {
    fontSize: 14,
    color: "#95a5a6",
    fontStyle: "italic",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 8,
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
    paddingVertical: 60,
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
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DanhSachVatDungCuaNguoiMuonScreen;
