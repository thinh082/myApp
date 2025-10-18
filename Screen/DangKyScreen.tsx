import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DangKy } from "../service/auth";

const DangKyScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");

  const handleRegister = async () => {
    if (matKhau !== xacNhanMatKhau) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    try {
      const res = await DangKy({ email, soDienThoai, matKhau });
      if (res.success) {
        Alert.alert("Thành công", res.message);
      } else {
        Alert.alert("Thất bại", res.message);
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể đăng ký");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
            <TouchableOpacity>
              <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
