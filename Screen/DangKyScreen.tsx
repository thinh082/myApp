import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DangKy } from "../service/auth";

const DangKyScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !matKhau || !soDienThoai) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await DangKy({ email, matKhau, soDienThoai });

      if (res.success) {
        Alert.alert("Thành công", res.message);
      } else {
        Alert.alert("Thất bại", res.message || "Không thể đăng ký");
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Đăng Ký</Text>
          <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
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

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.registerButtonText}>Đang đăng ký...</Text>
              </View>
            ) : (
              <Text style={styles.registerButtonText}>Đăng Ký</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Đã có tài khoản? Đăng nhập
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
  registerButton: {
    backgroundColor: "#27ae60",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  registerButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLink: { alignItems: "center" },
  loginLinkText: { fontSize: 16, color: "#27ae60", fontWeight: "600" },
});

export default DangKyScreen;