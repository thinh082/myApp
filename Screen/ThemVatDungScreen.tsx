import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { themVatDung, ThemVatDung } from "../service/vatdung";

const ThemVatDungScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ThemVatDung>({
    chuSoHuuId: 1, // Tạm thời hardcode, sau này lấy từ user đăng nhập
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

  const handleInputChange = (field: keyof ThemVatDung, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.tenVatDung.trim()) {
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
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Tự động tính số lượng còn lại nếu chưa được set
      const finalData = {
        ...formData,
        soLuongCon: formData.soLuongCon ?? formData.soLuongTong,
      };

      const result = await themVatDung(finalData);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã thêm vật dụng mới thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setFormData({
                  chuSoHuuId: 1,
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
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể thêm vật dụng");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể thêm vật dụng: " + error.message);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thêm vật dụng cho thuê</Text>
        <Text style={styles.headerSubtitle}>
          Thêm vật dụng mới vào danh mục cho thuê
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
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
                <Text style={styles.submitButtonText}>Đang thêm...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Thêm vật dụng</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});

export default ThemVatDungScreen;
