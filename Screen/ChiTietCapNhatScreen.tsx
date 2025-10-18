import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { 
  capNhatPhieuMuonTra, 
  getChiTietPhieuMuon,
  PhieuMuon,
  SuaPhieuMuon 
} from "../service/phieumuon";

// Temporary DateTimePicker component until library is installed
const TempDateTimePicker = ({ value, onChange, minimumDate, maximumDate }: any) => {
  const [tempDate, setTempDate] = useState(value);
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
    onChange(event, currentDate);
  };

  return (
    <View style={styles.tempDatePickerContainer}>
      <Text style={styles.tempDatePickerTitle}>Chọn ngày trả thực tế:</Text>
      <View style={styles.tempDatePickerButtons}>
        <TouchableOpacity 
          style={styles.tempDatePickerButton}
          onPress={() => {
            const today = new Date();
            handleDateChange(null, today);
          }}
        >
          <Text style={styles.tempDatePickerButtonText}>Hôm nay</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tempDatePickerButton}
          onPress={() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            handleDateChange(null, tomorrow);
          }}
        >
          <Text style={styles.tempDatePickerButtonText}>Ngày mai</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tempDatePickerButton}
          onPress={() => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            handleDateChange(null, nextWeek);
          }}
        >
          <Text style={styles.tempDatePickerButtonText}>Tuần sau</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tempDatePickerNote}>
        Ngày đã chọn: {tempDate.toLocaleDateString('vi-VN')}
      </Text>
    </View>
  );
};

interface ChiTietCapNhatScreenProps {
  phieuMuonId: number;
  onBack: () => void;
}

const ChiTietCapNhatScreen: React.FC<ChiTietCapNhatScreenProps> = ({ phieuMuonId, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [phieuMuon, setPhieuMuon] = useState<PhieuMuon | null>(null);
  const [formData, setFormData] = useState<Partial<SuaPhieuMuon>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchPhieuMuonDetail();
  }, [phieuMuonId]);

  const fetchPhieuMuonDetail = async () => {
    try {
      setLoadingDetail(true);
      const data = await getChiTietPhieuMuon(phieuMuonId);
      console.log("Chi tiết phiếu mượn:", JSON.stringify(data, null, 2));
      
      setPhieuMuon(data);
      
      // Parse ngayTraThucTe nếu có
      let initialDate = new Date();
      if (data.ngayTraThucTe) {
        const parsedDate = new Date(data.ngayTraThucTe);
        if (!isNaN(parsedDate.getTime())) {
          initialDate = parsedDate;
        }
      }
      setSelectedDate(initialDate);
      
      setFormData({
        id: data.id,
        ngayTraThucTe: data.ngayTraThucTe || "",
        ghiChu: data.ghiChu || "",
        trangThaiId: data.trangThaiId,
      });
    } catch (error: any) {
      console.error("Error fetching phieu muon detail:", error);
      Alert.alert("Lỗi", "Không thể tải chi tiết phiếu mượn: " + error.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    
    if (currentDate) {
      setSelectedDate(currentDate);
      // Format date to YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];
      handleInputChange("ngayTraThucTe", formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleInputChange = (field: keyof SuaPhieuMuon, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.id) {
      Alert.alert("Lỗi", "Không tìm thấy phiếu mượn");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!phieuMuon || !validateForm()) return;

    try {
      setLoading(true);
      
      const result = await capNhatPhieuMuonTra(formData as SuaPhieuMuon);
      
      if (result.success) {
        Alert.alert(
          "Thành công",
          "Đã cập nhật phiếu mượn thành công!",
          [
            {
              text: "OK",
              onPress: () => {
                onBack();
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", result.message || "Không thể cập nhật phiếu mượn");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật phiếu mượn: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const getTrangThaiText = (trangThaiId: number) => {
    const statusMap: { [key: number]: string } = {
      1: "Đang mượn",
      2: "Đã trả",
      3: "Quá hạn",
      4: "Hủy",
    };
    return statusMap[trangThaiId] || "Không xác định";
  };

  const getTrangThaiColor = (trangThaiId: number) => {
    const colorMap: { [key: number]: string } = {
      1: "#3498db",
      2: "#27ae60",
      3: "#e74c3c",
      4: "#95a5a6",
    };
    return colorMap[trangThaiId] || "#7f8c8d";
  };

  const renderInputField = (
    label: string,
    field: keyof SuaPhieuMuon,
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

  if (loadingDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9b59b6" />
          <Text style={styles.loadingText}>Đang tải chi tiết phiếu mượn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!phieuMuon) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy phiếu mượn</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết cập nhật</Text>
        <Text style={styles.headerSubtitle}>
          Phiếu mượn #{phieuMuon.id}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Thông tin phiếu mượn</Text>
          <Text style={styles.infoText}>
            Vật dụng: {phieuMuon.vatDung?.tenVatDung || "Không xác định"}
          </Text>
          <Text style={styles.infoText}>
            Vật dụng ID: {phieuMuon.vatDung?.id || "N/A"}
          </Text>
          <Text style={styles.infoText}>
            Số lượng: {phieuMuon.soLuong}
          </Text>
          {phieuMuon.vatDung?.moTa && (
            <Text style={styles.infoText}>
              Mô tả: {phieuMuon.vatDung.moTa}
            </Text>
          )}
          {phieuMuon.vatDung?.tinhTrang && (
            <Text style={styles.infoText}>
              Tình trạng: {phieuMuon.vatDung.tinhTrang}
            </Text>
          )}
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Ngày mượn:</Text>
          <Text style={styles.dateText}>{formatDate(phieuMuon.ngayMuon)}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Ngày trả dự kiến:</Text>
          <Text style={styles.dateText}>{formatDate(phieuMuon.ngayTraDuKien)}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getTrangThaiColor(phieuMuon.trangThaiId) }
          ]}>
            <Text style={styles.statusText}>
              {getTrangThaiText(phieuMuon.trangThaiId)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Cập nhật thông tin:</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Ngày trả thực tế</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={showDatePickerModal}
          >
            <Text style={[
              styles.datePickerButtonText,
              !formData.ngayTraThucTe && styles.datePickerPlaceholder
            ]}>
              {formData.ngayTraThucTe ? formatDate(formData.ngayTraThucTe) : "Chọn ngày trả thực tế"}
            </Text>
            <Text style={styles.datePickerIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <TempDateTimePicker
            value={selectedDate}
            onChange={handleDateChange}
            minimumDate={new Date(phieuMuon.ngayMuon)}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
          />
        )}
        
        {renderInputField("Ghi chú", "ghiChu", "Nhập ghi chú", "default", true)}
        
        {/* {renderInputField("Trạng thái ID", "trangThaiId", "1: Đang mượn, 2: Đã trả, 3: Quá hạn, 4: Hủy", "numeric")} */}

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
            <Text style={styles.submitButtonText}>Cập nhật phiếu mượn</Text>
          )}
        </TouchableOpacity>
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
    backgroundColor: "#9b59b6",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  dateText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
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
    backgroundColor: "#ffffff",
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
  submitButton: {
    backgroundColor: "#9b59b6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
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
  datePickerButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerButtonText: {
    fontSize: 14,
    color: "#2c3e50",
    flex: 1,
  },
  datePickerPlaceholder: {
    color: "#95a5a6",
  },
  datePickerIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  tempDatePickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  tempDatePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
  },
  tempDatePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  tempDatePickerButton: {
    backgroundColor: "#9b59b6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  tempDatePickerButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  tempDatePickerNote: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default ChiTietCapNhatScreen;
