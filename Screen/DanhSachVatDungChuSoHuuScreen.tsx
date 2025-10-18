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
  RefreshControl,
  Image,
} from "react-native";
import { 
  getDanhSachVatDungTheoChuSoHuu, 
  VatDung 
} from "../service/vatdung";

const DanhSachVatDungChuSoHuuScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vatDungList, setVatDungList] = useState<VatDung[]>([]);

  const chuSoHuuId = 1; // Tạm thời hardcode, sau này lấy từ user đăng nhập

  useEffect(() => {
    fetchVatDungList();
  }, []);

  const fetchVatDungList = async () => {
    try {
      setLoading(true);
      const data = await getDanhSachVatDungTheoChuSoHuu(chuSoHuuId);
      setVatDungList(data);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải danh sách vật dụng: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVatDungList();
  };

  const getStatusColor = (vatDung: VatDung) => {
    if (!vatDung.coTheMuon) return "#e74c3c";
    if ((vatDung.soLuongCon ?? 0) <= 0) return "#e74c3c";
    if ((vatDung.soLuongCon ?? 0) <= (vatDung.soLuongTong ?? 0) * 0.2) return "#f39c12";
    return "#27ae60";
  };

  const getStatusText = (vatDung: VatDung) => {
    if (!vatDung.coTheMuon) return "Không thể mượn";
    if ((vatDung.soLuongCon ?? 0) <= 0) return "Hết hàng";
    if ((vatDung.soLuongCon ?? 0) <= (vatDung.soLuongTong ?? 0) * 0.2) return "Sắp hết hàng";
    return "Có sẵn";
  };

  const renderVatDungItem = ({ item }: { item: VatDung }) => (
    <TouchableOpacity style={styles.vatDungItem}>
      <View style={styles.imageContainer}>
        {item.hinhAnh ? (
          <Image
            source={{ uri: item.hinhAnh }}
            style={styles.vatDungImage}
            resizeMode="cover"
            onError={() => {
              console.log('Lỗi tải hình ảnh:', item.hinhAnh);
            }}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>📦</Text>
          </View>
        )}
      </View>

      <View style={styles.vatDungContent}>
        <Text style={styles.vatDungName} numberOfLines={2}>
          {item.tenVatDung}
        </Text>
        
        {item.moTa && (
          <Text style={styles.vatDungDescription} numberOfLines={2}>
            {item.moTa}
          </Text>
        )}

        <View style={styles.quantityContainer}>
          <View style={styles.quantityItem}>
            <Text style={styles.quantityLabel}>Tổng</Text>
            <Text style={styles.quantityValue}>{item.soLuongTong || 0}</Text>
          </View>
          <View style={styles.quantityItem}>
            <Text style={styles.quantityLabel}>Còn lại</Text>
            <Text style={[
              styles.quantityValue,
              { color: (item.soLuongCon ?? 0) > 0 ? "#27ae60" : "#e74c3c" }
            ]}>
              {item.soLuongCon || 0}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(item)}
            </Text>
          </View>
          
          {item.tinhTrang && (
            <Text style={styles.conditionText}>
              {item.tinhTrang}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải danh sách vật dụng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (vatDungList.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh sách vật dụng của tôi</Text>
          <Text style={styles.headerSubtitle}>
            Quản lý tất cả vật dụng bạn đang cho thuê
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Chưa có vật dụng nào</Text>
          <Text style={styles.emptyDescription}>
            Bạn chưa thêm vật dụng nào vào danh mục cho thuê
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm vật dụng mới</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách vật dụng của tôi</Text>
        <Text style={styles.headerSubtitle}>
          Quản lý tất cả vật dụng bạn đang cho thuê
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{vatDungList.length}</Text>
          <Text style={styles.statLabel}>Tổng số vật dụng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {vatDungList.filter(item => (item.soLuongCon ?? 0) > 0).length}
          </Text>
          <Text style={styles.statLabel}>Còn hàng</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {vatDungList.filter(item => (item.soLuongCon ?? 0) <= 0).length}
          </Text>
          <Text style={styles.statLabel}>Hết hàng</Text>
        </View>
      </View>

      <FlatList
        data={vatDungList}
        renderItem={renderVatDungItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.vatDungList}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
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
  vatDungList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  vatDungItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  vatDungImage: {
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
  placeholderIcon: {
    fontSize: 32,
    color: "#6c757d",
  },
  vatDungContent: {
    flex: 1,
  },
  vatDungName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  vatDungDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
    lineHeight: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  quantityItem: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginHorizontal: 2,
  },
  quantityLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  conditionText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
});

export default DanhSachVatDungChuSoHuuScreen;
