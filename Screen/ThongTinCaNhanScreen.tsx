import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { XemThongTinCaNhan, CapNhatThongTinCaNhan, ThongTinCaNhan, CapNhatThongTinRequest } from "../service/auth";
import { getIdTaiKhoan } from "../service/storage";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung' | 
             'themvatdung' | 'capnhatvatdung' | 'xoavatdung' | 'danhsachvatdungchusohuu' | 
             'capnhatphieumuon' | 'xoaphieumuon' | 'quanlymuonvatdung' | 'cacvatdungdamuon' | 'thongtincanhan';

interface ThongTinCaNhanScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const ThongTinCaNhanScreen: React.FC<ThongTinCaNhanScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [thongTin, setThongTin] = useState<ThongTinCaNhan | null>(null);
  const [formData, setFormData] = useState<CapNhatThongTinRequest>({
    email: "",
    matKhau: "",
    soDienThoai: "",
    diaChi: "",
    hoTen: "",
  });

  useEffect(() => {
    loadThongTin();
  }, []);

  const loadThongTin = async () => {
    try {
      setLoading(true);
      const taiKhoanId = await getIdTaiKhoan();
      if (taiKhoanId) {
        const data = await XemThongTinCaNhan(taiKhoanId);
        setThongTin(data);
        setFormData({
          email: data.email,
          matKhau: "",
          soDienThoai: data.soDienThoai,
          diaChi: data.diaChi,
          hoTen: data.hoTen,
        });
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin cá nhân: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!thongTin) return;

    // Validation
    if (!formData.email || !formData.hoTen || !formData.soDienThoai || !formData.diaChi) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (formData.matKhau && formData.matKhau.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setSaving(true);
      const result = await CapNhatThongTinCaNhan(thongTin.id, formData);
      
      if (result.success) {
        Alert.alert("Thành công", result.message);
        setEditing(false);
        loadThongTin(); // Reload data
      } else {
        Alert.alert("Lỗi", result.message);
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (thongTin) {
      setFormData({
        email: thongTin.email,
        matKhau: "",
        soDienThoai: thongTin.soDienThoai,
        diaChi: thongTin.diaChi,
        hoTen: thongTin.hoTen,
      });
    }
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInputField = (label: string, field: keyof CapNhatThongTinRequest, placeholder: string, secureTextEntry = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
        secureTextEntry={secureTextEntry}
        editable={editing}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
              <Text style={styles.headerSubtitle}>
                Xem và cập nhật thông tin cá nhân
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
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            <Text style={styles.headerSubtitle}>
              Xem và cập nhật thông tin cá nhân
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {thongTin?.hoTen?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.avatarName}>{thongTin?.hoTen || 'Chưa có tên'}</Text>
          </View>

          {/* Form section */}
          <View style={styles.formSection}>
            {renderInputField("Email *", "email", "Nhập email", false)}
            {renderInputField("Họ và tên *", "hoTen", "Nhập họ và tên", false)}
            {renderInputField("Số điện thoại *", "soDienThoai", "Nhập số điện thoại", false)}
            {renderInputField("Địa chỉ *", "diaChi", "Nhập địa chỉ", false)}
            {renderInputField("Mật khẩu mới", "matKhau", "Nhập mật khẩu mới (để trống nếu không đổi)", true)}
          </View>

          {/* Info section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ID tài khoản:</Text>
              <Text style={styles.infoValue}>{thongTin?.id}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ngày tạo:</Text>
              <Text style={styles.infoValue}>{thongTin ? formatDate(thongTin.ngayTao) : 'N/A'}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionSection}>
            {editing ? (
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, saving && styles.disabledButton]} 
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <View style={styles.loadingContent}>
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text style={styles.saveButtonText}>Đang lưu...</Text>
                    </View>
                  ) : (
                    <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setEditing(true)}
              >
                <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  formSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2c3e50",
    backgroundColor: "#f8f9fa",
  },
  infoSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  infoLabel: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "600",
  },
  actionSection: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
});

export default ThongTinCaNhanScreen;
