import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { 
  capNhatVatDung, 
  getDanhSachVatDungTheoChuSoHuu, 
  VatDung 
} from "../service/vatdung";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon';

interface CapNhatVatDungScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const CapNhatVatDungScreen: React.FC<CapNhatVatDungScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [vatDungList, setVatDungList] = useState<VatDung[]>([]);
  const [selectedVatDung, setSelectedVatDung] = useState<VatDung | null>(null);
  const [formData, setFormData] = useState<Partial<VatDung>>({});
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

  const handleSelectVatDung = (vatDung: VatDung) => {
    setSelectedVatDung(vatDung);
    setFormData({
      id: vatDung.id,
      chuSoHuuId: vatDung.chuSoHuuId,
      tenVatDung: vatDung.tenVatDung,
      moTa: vatDung.moTa || "",
      danhMucId: vatDung.danhMucId,
      soLuongTong: vatDung.soLuongTong || 0,
      soLuongCon: vatDung.soLuongCon || 0,
      coTheMuon: vatDung.coTheMuon ?? true,
      tinhTrang: vatDung.tinhTrang || "",
      hinhAnh: vatDung.hinhAnh || "",
      trangThai: vatDung.trangThai ?? true,
    });
  };

  const handleInputChange = (field: keyof VatDung, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.tenVatDung?.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên vật dụng");
      return false;
    }
    if (formData.soLuongTong && formData.soLuongTong <= 0) {
      Alert.alert("Lỗi", "Số lượng tổng phải lớn hơn 0");
      return false;
    }
    if (formData.soLuongCon && formData.soLuongCon < 0) {
      Alert.alert("Lỗi", "Số lượng còn lại không được âm");
      return false;
    }
    if (formData.soLuongTong && formData.soLuongCon && formData.soLuongCon > formData.soLuongTong) {
      Alert.alert("Lỗi", "Số lượng còn lại không được lớn hơn số lượng tổng");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!selectedVatDung || !validateForm()) return;

    try {
      setLoading(true);
      
      const result = await capNhatVatDung(formData as VatDung);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã cập nhật vật dụng thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedVatDung(null);
                setFormData({});
                fetchVatDungList();
                // Navigate back to management screen
                onNavigate('quanlychothue');
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể cập nhật vật dụng");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật vật dụng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderVatDungItem = ({ item }: { item: VatDung }) => (
    <TouchableOpacity
      style={[
        styles.vatDungItem,
        selectedVatDung?.id === item.id && styles.selectedVatDungItem
      ]}
      onPress={() => handleSelectVatDung(item)}
    >
      <View style={styles.vatDungItemContent}>
        <Text style={styles.vatDungName}>{item.tenVatDung}</Text>
        <Text style={styles.vatDungInfo}>
          Số lượng: {item.soLuongCon || 0}/{item.soLuongTong || 0}
        </Text>
        <Text style={styles.vatDungStatus}>
          {item.coTheMuon ? "Có thể mượn" : "Không thể mượn"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderInputField = (
    label: string,
    field: keyof VatDung,
    placeholder: string,
    keyboardType: "default" | "numeric" = "default",
    multiline: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={formData[field]?.toString() || ""}
        onChangeText={(value) => {
          if (keyboardType === "numeric") {
            const numValue = value === "" ? 0 : parseInt(value);
            handleInputChange(field, numValue);
          } else {
            handleInputChange(field, value);
          }
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  if (loadingList) {
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
            <Text style={styles.headerTitle}>Cập nhật vật dụng</Text>
            <Text style={styles.headerSubtitle}>
              Chọn và chỉnh sửa thông tin vật dụng
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

      <View style={styles.content}>
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Chọn vật dụng cần cập nhật:</Text>
          <FlatList
            data={vatDungList}
            renderItem={renderVatDungItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.vatDungList}
          />
        </View>

        {selectedVatDung && (
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Thông tin cập nhật:</Text>
            
            {renderInputField("Tên vật dụng *", "tenVatDung", "Nhập tên vật dụng")}
            
            {renderInputField("Mô tả", "moTa", "Nhập mô tả vật dụng", "default", true)}
            
            {renderInputField("Danh mục ID", "danhMucId", "Nhập ID danh mục", "numeric")}
            
            {renderInputField("Số lượng tổng", "soLuongTong", "Nhập số lượng tổng", "numeric")}
            
            {renderInputField("Số lượng còn lại", "soLuongCon", "Nhập số lượng còn lại", "numeric")}
            
            {renderInputField("Tình trạng", "tinhTrang", "Nhập tình trạng (VD: Mới, Cũ, Hỏng)")}
            
            {renderInputField("Hình ảnh URL", "hinhAnh", "Nhập URL hình ảnh")}

            <View style={styles.toggleGroup}>
              <Text style={styles.inputLabel}>Có thể mượn</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  formData.coTheMuon ? styles.toggleButtonActive : styles.toggleButtonInactive
                ]}
                onPress={() => handleInputChange("coTheMuon", !formData.coTheMuon)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  formData.coTheMuon ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
                ]}>
                  {formData.coTheMuon ? "Có" : "Không"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toggleGroup}>
              <Text style={styles.inputLabel}>Trạng thái hoạt động</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  formData.trangThai ? styles.toggleButtonActive : styles.toggleButtonInactive
                ]}
                onPress={() => handleInputChange("trangThai", !formData.trangThai)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  formData.trangThai ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
                ]}>
                  {formData.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.submitButtonText}>Đang cập nhật...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Cập nhật vật dụng</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#f39c12",
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
  content: {
    flex: 1,
    flexDirection: "row",
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderLeftWidth: 1,
    borderLeftColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  vatDungList: {
    flex: 1,
  },
  vatDungItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedVatDungItem: {
    borderColor: "#f39c12",
    backgroundColor: "#fef9e7",
  },
  vatDungItemContent: {
    flex: 1,
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  multilineInput: {
    height: 60,
    textAlignVertical: "top",
  },
  toggleGroup: {
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  toggleButtonActive: {
    backgroundColor: "#f39c12",
    borderColor: "#f39c12",
  },
  toggleButtonInactive: {
    backgroundColor: "#ffffff",
    borderColor: "#e74c3c",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
  toggleButtonTextInactive: {
    color: "#e74c3c",
  },
  submitButton: {
    backgroundColor: "#f39c12",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CapNhatVatDungScreen;
