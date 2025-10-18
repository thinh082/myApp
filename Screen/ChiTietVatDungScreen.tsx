import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getChiTietVatDung, VatDung } from "../service/vatdung";
import { themPhieuMuonTra, ThemPhieuMuon } from "../service/phieumuon";

const ChiTietVatDungScreen: React.FC = () => {
  const [vatDung, setVatDung] = useState<VatDung | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  // Tạm thời sử dụng id = 12, sau này sẽ nhận từ route
  const vatDungId = 13;

  const fetchChiTietVatDung = async () => {
    try {
      const data = await getChiTietVatDung(vatDungId);
      setVatDung(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải chi tiết vật dụng: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChiTietVatDung();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChiTietVatDung();
  };

  const handleMuonVatDung = async () => {
    if (!vatDung || borrowing) return;

    // Kiểm tra xem vật dụng có thể mượn không
    if (!vatDung.coTheMuon || (vatDung.soLuongCon ?? 0) <= 0) {
      Alert.alert(
        "Không thể mượn", 
        "Vật dụng này hiện tại không thể mượn hoặc đã hết hàng."
      );
      return;
    }

    try {
      setBorrowing(true);

      // Tạo dữ liệu phiếu mượn
      const phieuMuonData: ThemPhieuMuon = {
        vatDungId: vatDung.id,
        nguoiMuonId: 1, // Tạm thời hardcode, sau này sẽ lấy từ user đăng nhập
        chuSoHuuId: vatDung.chuSoHuuId,
        soLuong: 1, // Mặc định mượn 1 cái
        ngayMuon: new Date().toISOString().split('T')[0] + 'T00:00:00', // Ngày hiện tại
        ngayTraDuKien: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00', // 7 ngày sau
        ghiChu: `Mượn ${vatDung.tenVatDung}`
      };

      const result = await themPhieuMuonTra(phieuMuonData);
      
      if (result.success) {
        Alert.alert(
          "Thành công", 
          "Đã tạo phiếu mượn thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Làm mới dữ liệu để cập nhật số lượng
                fetchChiTietVatDung();
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tạo phiếu mượn");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tạo phiếu mượn: " + error.message);
    } finally {
      setBorrowing(false);
    }
  };

  const renderImageSection = () => (
    <View style={styles.imageSection}>
      {vatDung?.hinhAnh ? (
        <Image
          source={{ uri: vatDung.hinhAnh }}
          style={styles.mainImage}
          resizeMode="cover"
          onError={() => {
            console.log('Lỗi tải hình ảnh:', vatDung.hinhAnh);
          }}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderIcon}>📦</Text>
          <Text style={styles.placeholderText}>Không có hình ảnh</Text>
        </View>
      )}
    </View>
  );

  const renderInfoSection = () => (
    <View style={styles.infoSection}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{vatDung?.tenVatDung}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: vatDung?.coTheMuon ? '#2ecc71' : '#e74c3c' }
        ]}>
          <Text style={styles.statusText}>
            {vatDung?.coTheMuon ? 'Có thể mượn' : 'Không thể mượn'}
          </Text>
        </View>
      </View>

      {vatDung?.moTa && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{vatDung.moTa}</Text>
        </View>
      )}

      <View style={styles.quantitySection}>
        <Text style={styles.sectionTitle}>Thông tin số lượng</Text>
        <View style={styles.quantityRow}>
          <View style={styles.quantityItem}>
            <Text style={styles.quantityLabel}>Tổng số lượng</Text>
            <Text style={styles.quantityValue}>{vatDung?.soLuongTong || 0}</Text>
          </View>
          <View style={styles.quantityItem}>
            <Text style={styles.quantityLabel}>Còn lại</Text>
            <Text style={[
              styles.quantityValue,
              { color: (vatDung?.soLuongCon || 0) > 0 ? '#2ecc71' : '#e74c3c' }
            ]}>
              {vatDung?.soLuongCon || 0}
            </Text>
          </View>
        </View>
      </View>

      {vatDung?.tinhTrang && (
        <View style={styles.conditionSection}>
          <Text style={styles.sectionTitle}>Tình trạng</Text>
          <Text style={styles.conditionText}>{vatDung.tinhTrang}</Text>
        </View>
      )}

      <View style={styles.metadataSection}>
        {/* <Text style={styles.sectionTitle}>Thông tin khác</Text>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>ID:</Text>
          <Text style={styles.metadataValue}>{vatDung?.id}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Chủ sở hữu ID:</Text>
          <Text style={styles.metadataValue}>{vatDung?.chuSoHuuId}</Text>
        </View>
        {vatDung?.danhMucId && (
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Danh mục ID:</Text>
            <Text style={styles.metadataValue}>{vatDung.danhMucId}</Text>
          </View>
        )} */}
        {/* <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Trạng thái:</Text>
          <Text style={[
            styles.metadataValue,
            { color: vatDung?.trangThai ? '#2ecc71' : '#e74c3c' }
          ]}>
            {vatDung?.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}
          </Text>
        </View> */}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity 
        style={[
          styles.primaryButton,
          (!vatDung?.coTheMuon || (vatDung?.soLuongCon ?? 0) <= 0 || borrowing) && styles.disabledButton
        ]}
        onPress={handleMuonVatDung}
        disabled={!vatDung?.coTheMuon || (vatDung?.soLuongCon ?? 0) <= 0 || borrowing}
      >
        {borrowing ? (
          <View style={styles.loadingButtonContent}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.primaryButtonText}>Đang xử lý...</Text>
          </View>
        ) : (
          <Text style={styles.primaryButtonText}>Mượn vật dụng</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onRefresh}>
        <Text style={styles.secondaryButtonText}>Làm mới</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải chi tiết vật dụng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vatDung) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Không tìm thấy vật dụng</Text>
          <Text style={styles.errorDescription}>
            Vật dụng với ID {vatDungId} không tồn tại hoặc đã bị xóa
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChiTietVatDung}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderImageSection()}
        {renderInfoSection()}
        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageSection: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  mainImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
  },
  placeholderIcon: {
    fontSize: 48,
    color: "#6c757d",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "500",
  },
  infoSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#7f8c8d",
    lineHeight: 24,
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quantityItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  conditionSection: {
    marginBottom: 20,
  },
  conditionText: {
    fontSize: 16,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  metadataSection: {
    marginBottom: 20,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  metadataLabel: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  metadataValue: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "600",
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  secondaryButtonText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
    opacity: 0.6,
  },
  loadingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChiTietVatDungScreen;
