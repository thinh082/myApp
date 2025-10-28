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
  TextInput,
} from "react-native";
import { getDanhSachVatDung, VatDung } from "../service/vatdung";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon' | 'quanlymuonvatdung' | 'cacvatdungdamuon' | 'thongtincanhan';

interface DanhSachVatDungScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const DanhSachVatDungScreen: React.FC<DanhSachVatDungScreenProps> = ({ onNavigate }) => {
  const [vatDungList, setVatDungList] = useState<VatDung[]>([]);
  const [filteredList, setFilteredList] = useState<VatDung[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchVatDung = async () => {
    try {
      const data = await getDanhSachVatDung();
      setVatDungList(data);
      setFilteredList(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách vật dụng: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hàm tìm kiếm và lọc
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredList(vatDungList);
    } else {
      const filtered = vatDungList.filter((item) =>
        item.tenVatDung.toLowerCase().includes(text.toLowerCase()) ||
        (item.moTa && item.moTa.toLowerCase().includes(text.toLowerCase())) ||
        (item.tinhTrang && item.tinhTrang.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredList(filtered);
    }
  };

  // Hàm xóa tìm kiếm
  const clearSearch = () => {
    setSearchText("");
    setFilteredList(vatDungList);
  };

  useEffect(() => {
    fetchVatDung();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVatDung();
  };

  const renderVatDungItem = ({ item }: { item: VatDung }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => onNavigate('chitietvatdung', item.id)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemMainContent}>
          {/* Hình ảnh vật dụng */}
          <View style={styles.imageContainer}>
            {item.hinhAnh ? (
              <Image
                source={{ uri: item.hinhAnh }}
                style={styles.itemImage}
                resizeMode="cover"
                onError={() => {
                  // Fallback khi hình ảnh lỗi
                  console.log('Lỗi tải hình ảnh:', item.hinhAnh);
                }}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>

          {/* Thông tin vật dụng */}
          <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.tenVatDung}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.coTheMuon ? '#2ecc71' : '#e74c3c' }
              ]}>
                <Text style={styles.statusText}>
                  {item.coTheMuon ? 'Có thể mượn' : 'Không thể mượn'}
                </Text>
              </View>
            </View>

            {item.moTa && (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.moTa}
              </Text>
            )}

            <View style={styles.itemFooter}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Còn lại:</Text>
                <Text style={[
                  styles.quantityValue,
                  { color: (item.soLuongCon || 0) > 0 ? '#2ecc71' : '#e74c3c' }
                ]}>
                  {item.soLuongCon || 0}
                </Text>
              </View>
            </View>

            {item.tinhTrang && (
              <Text style={styles.conditionText}>
                Tình trạng: {item.tinhTrang}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>Không có vật dụng</Text>
      <Text style={styles.emptyDescription}>
        Hiện tại chưa có vật dụng nào trong hệ thống
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Làm mới</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải danh sách vật dụng...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Danh Sách Vật Dụng</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => onNavigate('quanlymuonvatdung')}
            >
              <Text style={styles.backButtonText}>Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => onNavigate('dangnhap')}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm vật dụng..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#95a5a6"
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVatDungItem}
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
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#e9ecef",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "bold",
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
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    marginRight: 8,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  conditionText: {
    fontSize: 14,
    color: "#95a5a6",
    fontStyle: "italic",
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
    backgroundColor: "#3498db",
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

export default DanhSachVatDungScreen;
