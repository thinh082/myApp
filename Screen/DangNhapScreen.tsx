import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DangNhap } from "../service/auth";
import { setIdTaiKhoan } from "../service/storage";

const DangNhapScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");

  const handleLogin = async () => {
    try {
      const res = await DangNhap({ email, matKhau });

      if (res.taiKhoanId) {
        await setIdTaiKhoan(res.taiKhoanId);
        Alert.alert("Thành công", res.message);
      } else {
        Alert.alert("Thất bại", res.message || "Sai email hoặc mật khẩu");
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể đăng nhập");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại!</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Chưa có tài khoản? Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: { fontSize: 18, color: "#7f8c8d", textAlign: "center" },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  registerLink: { alignItems: "center" },
  registerLinkText: { fontSize: 16, color: "#3498db", fontWeight: "600" },
});

export default DangNhapScreen;
