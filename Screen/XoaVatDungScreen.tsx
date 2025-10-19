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
  xoaVatDung, 
  getDanhSachVatDungTheoChuSoHuu, 
  VatDung 
} from "../service/vatdung";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon';

interface XoaVatDungScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const XoaVatDungScreen: React.FC<XoaVatDungScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [vatDungList, setVatDungList] = useState<VatDung[]>([]);
  const [chuSoHuuId, setChuSoHuuId] = useState<number>(1);

  useEffect(() => {
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (chuSoHuuId !== 1) {
      fetchVatDungList();
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

  const fetchVatDungList = async () => {
    try {
      setLoadingList(true);
      const data = await getDanhSachVatDungTheoChuSoHuu(chuSoHuuId);
      setVatDungList(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách vật dụng: " + error.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleDeleteVatDung = (vatDung: VatDung) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa vật dụng "${vatDung.tenVatDung}"?\n\nHành động này không thể hoàn tác!`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => confirmDelete(vatDung.id),
        },
      ]
    );
  };

  const confirmDelete = async (vatDungId: number) => {
    try {
      setLoading(true);
      
      const result = await xoaVatDung(vatDungId);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã xóa vật dụng thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Làm mới danh sách
                fetchVatDungList();
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể xóa vật dụng");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể xóa vật dụng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderVatDungItem = ({ item }: { item: VatDung }) => (
    <View style={styles.vatDungItem}>
      <View style={styles.vatDungItemContent}>
        <Text style={styles.vatDungName}>{item.tenVatDung}</Text>
        <Text style={styles.vatDungInfo}>
          Số lượng: {item.soLuongCon || 0}/{item.soLuongTong || 0}
        </Text>
        <Text style={styles.vatDungStatus}>
          {item.coTheMuon ? "Có thể mượn" : "Không thể mượn"}
        </Text>
        {item.moTa && (
          <Text style={styles.vatDungDescription} numberOfLines={2}>
            {item.moTa}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteVatDung(item)}
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
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Đang tải danh sách vật dụng...</Text>
        </View>
      </View>
    );
  }

  if (vatDungList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Xóa vật dụng</Text>
              <Text style={styles.headerSubtitle}>
                Quản lý và xóa vật dụng cho thuê
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
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Không có vật dụng nào</Text>
          <Text style={styles.emptyDescription}>
            Bạn chưa có vật dụng nào để quản lý
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
            <Text style={styles.headerTitle}>Xóa vật dụng</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý và xóa vật dụng cho thuê
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

      <FlatList
        data={vatDungList}
        renderItem={renderVatDungItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.vatDungList}
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
    backgroundColor: "#e74c3c",
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
  vatDungList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  vatDungItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vatDungItemContent: {
    flex: 1,
    marginRight: 12,
  },
  vatDungName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  vatDungInfo: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  vatDungStatus: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "500",
    marginBottom: 4,
  },
  vatDungDescription: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
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

export default XoaVatDungScreen;
