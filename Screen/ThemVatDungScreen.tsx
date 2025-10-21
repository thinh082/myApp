
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
  Modal,
} from "react-native";
import { themVatDung, ThemVatDung } from "../service/vatdung";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon';

interface ThemVatDungScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const ThemVatDungScreen: React.FC<ThemVatDungScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [showDanhMucModal, setShowDanhMucModal] = useState(false);
  const [formData, setFormData] = useState<ThemVatDung>({
    chuSoHuuId: 0, // Sẽ được cập nhật từ storage
    tenVatDung: "",
    moTa: "",
    danhMucId: undefined,
    soLuongTong: 1,
    soLuongCon: 1,
    coTheMuon: true,
    tinhTrang: "Mới",
    hinhAnh: "",
    trangThai: true,
  });

  const danhMucList = [
    { id: 1, tenDanhMuc: "Đồ điện tử" },
    { id: 2, tenDanhMuc: "Dụng Cụ Học Tập" },
    { id: 3, tenDanhMuc: "Dụng Cụ Thể Thao" },
    { id: 4, tenDanhMuc: "Sách - Tài Liệu" },
    { id: 5, tenDanhMuc: "Đồ Gia Dụng" },
    { id: 6, tenDanhMuc: "Thiết Bị Văn Phòng" },
    { id: 7, tenDanhMuc: "Đồ Trang Trí" },
    { id: 8, tenDanhMuc: "Dụng Cụ Sửa Chữa" },
    { id: 9, tenDanhMuc: "Phụ Kiện Máy Tính" },
    { id: 10, tenDanhMuc: "Khác" },
  ];

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const taiKhoanId = await getIdTaiKhoan();
      console.log('Lấy ID tài khoản từ storage:', taiKhoanId);
      
      if (taiKhoanId && taiKhoanId > 0) {
        setFormData(prev => ({
          ...prev,
          chuSoHuuId: taiKhoanId
        }));
        console.log('Đã cập nhật chuSoHuuId:', taiKhoanId);
      } else {
        Alert.alert("Lỗi", "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        onNavigate('dangnhap');
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      Alert.alert("Lỗi", "Không thể lấy thông tin người dùng: " + (error as Error).message);
      onNavigate('dangnhap');
    }
  };

  const handleInputChange = (field: keyof ThemVatDung, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Tự động cập nhật soLuongCon khi soLuongTong thay đổi
      if (field === 'soLuongTong') {
        newData.soLuongCon = value as number;
      }
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.tenVatDung || formData.tenVatDung.trim() === '') {
      Alert.alert("Lỗi", "Vui lòng nhập tên vật dụng");
      return false;
    }
    if (!formData.chuSoHuuId || formData.chuSoHuuId <= 0) {
      Alert.alert("Lỗi", "Không xác định được chủ sở hữu. Vui lòng đăng nhập lại.");
      return false;
    }
    if (!formData.danhMucId) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục");
      return false;
    }
    if (!formData.soLuongTong || formData.soLuongTong <= 0) {
      Alert.alert("Lỗi", "Số lượng tổng phải lớn hơn 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Chuẩn bị dữ liệu theo format VatDungModel
      const finalData: ThemVatDung = {
        chuSoHuuId: Number(formData.chuSoHuuId),
        tenVatDung: formData.tenVatDung.trim(),
        moTa: formData.moTa?.trim() || undefined,
        danhMucId: formData.danhMucId ? Number(formData.danhMucId) : undefined,
        soLuongTong: Number(formData.soLuongTong),
        soLuongCon: Number(formData.soLuongTong), // Luôn bằng soLuongTong
        coTheMuon: formData.coTheMuon ?? true,
        tinhTrang: formData.tinhTrang?.trim() || undefined,
        hinhAnh: formData.hinhAnh?.trim() || undefined,
        trangThai: formData.trangThai ?? true,
      };

      console.log('Dữ liệu gửi lên API:', JSON.stringify(finalData, null, 2));

      const result = await themVatDung(finalData);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã thêm vật dụng mới thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form (giữ nguyên chuSoHuuId từ storage)
                setFormData(prev => ({
                  ...prev,
                  tenVatDung: "",
                  moTa: "",
                  danhMucId: undefined,
                  soLuongTong: 1,
                  soLuongCon: 1, // Sẽ được tự động cập nhật khi soLuongTong thay đổi
                  coTheMuon: true,
                  tinhTrang: "Mới",
                  hinhAnh: "",
                  trangThai: true,
                }));
                // Navigate back to management screen
                onNavigate('quanlychothue');
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể thêm vật dụng");
      }
    } catch (error: any) {
      console.error('Lỗi khi thêm vật dụng:', error);
      
      let errorMessage = "Không thể thêm vật dụng";
      
      if (error.response) {
        // Lỗi từ server
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 400) {
          errorMessage = "Dữ liệu không hợp lệ: " + (error.response.data?.message || "Vui lòng kiểm tra lại thông tin");
        } else if (error.response.status === 500) {
          errorMessage = "Lỗi server: " + (error.response.data?.message || "Vui lòng thử lại sau");
        } else {
          errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || error.message}`;
        }
      } else if (error.request) {
        // Lỗi network
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Lỗi khác
        errorMessage = error.message || "Có lỗi xảy ra";
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof ThemVatDung,
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

  const renderDanhMucDropdown = () => {
    const selectedDanhMuc = danhMucList.find(dm => dm.id === formData.danhMucId);
    
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Danh mục *</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDanhMucModal(true)}
        >
          <Text style={[
            styles.dropdownButtonText,
            !selectedDanhMuc && styles.placeholderText
          ]}>
            {selectedDanhMuc ? selectedDanhMuc.tenDanhMuc : "Chọn danh mục"}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDanhMucModal = () => (
    <Modal
      visible={showDanhMucModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowDanhMucModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDanhMucModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalList}>
            {danhMucList.map((danhMuc) => (
              <TouchableOpacity
                key={danhMuc.id}
                style={[
                  styles.modalItem,
                  formData.danhMucId === danhMuc.id && styles.modalItemSelected
                ]}
                onPress={() => {
                  handleInputChange("danhMucId", danhMuc.id);
                  setShowDanhMucModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  formData.danhMucId === danhMuc.id && styles.modalItemTextSelected
                ]}>
                  {danhMuc.tenDanhMuc}
                </Text>
                {formData.danhMucId === danhMuc.id && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Thêm vật dụng cho thuê</Text>
            <Text style={styles.headerSubtitle}>
              Thêm vật dụng mới vào danh mục cho thuê
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {renderInputField("Tên vật dụng *", "tenVatDung", "Nhập tên vật dụng")}
          
          {renderInputField("Mô tả", "moTa", "Nhập mô tả vật dụng", "default", true)}
          
          {renderDanhMucDropdown()}
          
          {renderInputField("Số lượng tổng", "soLuongTong", "Nhập số lượng tổng", "numeric")}
          
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
                <Text style={styles.submitButtonText}>Đang thêm...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Thêm vật dụng</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {renderDanhMucModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#27ae60",
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  toggleGroup: {
    marginBottom: 20,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: "flex-start",
  },
  toggleButtonActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  toggleButtonInactive: {
    backgroundColor: "#ffffff",
    borderColor: "#e74c3c",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  toggleButtonTextActive: {
    color: "#ffffff",
  },
  toggleButtonTextInactive: {
    color: "#e74c3c",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Dropdown styles
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#2c3e50",
    flex: 1,
  },
  placeholderText: {
    color: "#7f8c8d",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#7f8c8d",
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "bold",
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  modalItemSelected: {
    backgroundColor: "#e8f5e8",
  },
  modalItemText: {
    fontSize: 16,
    color: "#2c3e50",
    flex: 1,
  },
  modalItemTextSelected: {
    color: "#27ae60",
    fontWeight: "600",
  },
  checkIcon: {
    fontSize: 16,
    color: "#27ae60",
    fontWeight: "bold",
  },
});

export default ThemVatDungScreen;
