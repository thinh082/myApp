import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";

import { DangKy } from "../service/auth";

type Screen = 'dangnhap' | 'dangky' | 'quanlychothue' | 'danhsachvatdung' | 'chitietvatdung';

interface DangKyScreenProps {
  onNavigate: (screen: Screen, vatDungId?: number) => void;
}

const DangKyScreen: React.FC<DangKyScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [LoaiTaiKhoanId, setLoaiTaiKhoanId] = useState<number>(2); // Mặc định là Chủ sở hữu
  const [showLoaiTaiKhoanModal, setShowLoaiTaiKhoanModal] = useState(false);

  const getLoaiTaiKhoanText = (LoaiTaiKhoanId: number) => {
    return LoaiTaiKhoanId === 2 ? "Chủ sở hữu" : "Người mượn";
  };

  const handleRegister = async () => {
    if (matKhau !== xacNhanMatKhau) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    try {
      const res = await DangKy({ email, soDienThoai, matKhau, hoTen, diaChi, LoaiTaiKhoanId });
      if (res.success) {
        Alert.alert(
          "Thành công", 
          res.message,
          [
            {
              text: "OK",
              onPress: () => onNavigate('dangnhap')
            }
          ]
        );
      } else {
        Alert.alert("Thất bại", res.message);
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể đăng ký");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Đăng Ký</Text>
          <Text style={styles.subtitle}>
            Tạo tài khoản mới để sử dụng ứng dụng
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              value={hoTen}
              onChangeText={setHoTen}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={soDienThoai}
              onChangeText={setSoDienThoai}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ"
              value={diaChi}
              onChangeText={setDiaChi}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vai trò</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowLoaiTaiKhoanModal(true)}
            >
              <Text style={styles.dropdownText}>{getLoaiTaiKhoanText(LoaiTaiKhoanId)}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              value={matKhau}
              onChangeText={setMatKhau}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              value={xacNhanMatKhau}
              onChangeText={setXacNhanMatKhau}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => onNavigate('dangnhap')}>
              <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal chọn loại tài khoản */}
      <Modal
        visible={showLoaiTaiKhoanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLoaiTaiKhoanModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLoaiTaiKhoanModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại tài khoản</Text>
            
            <TouchableOpacity
              style={[styles.modalOption, LoaiTaiKhoanId === 2 && styles.modalOptionSelected]}
              onPress={() => {
                setLoaiTaiKhoanId(2);
                setShowLoaiTaiKhoanModal(false);
              }}
            >
              <Text style={[styles.modalOptionText, LoaiTaiKhoanId === 2 && styles.modalOptionTextSelected]}>
                Chủ sở hữu
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalOption, LoaiTaiKhoanId === 3 && styles.modalOptionSelected]}
              onPress={() => {
                setLoaiTaiKhoanId(3);
                setShowLoaiTaiKhoanModal(false);
              }}
            >
              <Text style={[styles.modalOptionText, LoaiTaiKhoanId === 3 && styles.modalOptionTextSelected]}>
                Người mượn
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#7f8c8d", textAlign: "center" },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#2c3e50", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  modalOptionSelected: {
    backgroundColor: "#3498db",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#2c3e50",
    textAlign: "center",
  },
  modalOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { fontSize: 16, color: "#7f8c8d" },
  loginLinkText: { fontSize: 16, color: "#3498db", fontWeight: "600" },
});

export default DangKyScreen;
