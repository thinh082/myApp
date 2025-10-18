# Hướng dẫn cài đặt DateTimePicker cho CapNhatPhieuMuonScreen

## 📦 Cài đặt thư viện

### 1. **Cài đặt package**
```bash
npm install @react-native-community/datetimepicker
```

### 2. **Cài đặt cho iOS (nếu cần)**
```bash
cd ios && pod install
```

### 3. **Cài đặt cho Android**
Thư viện sẽ tự động link với Android.

## 🔧 **Code đã được cập nhật**

### **Import và State**
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from "react-native";

// State mới
const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
```

### **Hàm xử lý DateTimePicker**
```typescript
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
```

### **UI Component**
```typescript
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
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={handleDateChange}
    minimumDate={new Date(selectedPhieuMuon?.ngayMuon || new Date())}
    maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
  />
)}
```

### **Styles**
```typescript
datePickerButton: {
  backgroundColor: "#f8f9fa",
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
```

## ✨ **Tính năng**

### **1. Date Validation**
- **Minimum Date**: Không thể chọn ngày trước ngày mượn
- **Maximum Date**: Không thể chọn ngày quá 1 năm trong tương lai

### **2. Platform Support**
- **iOS**: Spinner display
- **Android**: Default modal display

### **3. User Experience**
- **Placeholder text**: "Chọn ngày trả thực tế"
- **Calendar icon**: 📅
- **Formatted display**: Hiển thị ngày theo format Việt Nam

### **4. Data Handling**
- **Auto format**: Tự động format thành YYYY-MM-DD
- **State sync**: Đồng bộ với formData
- **Initial value**: Load giá trị hiện tại nếu có

## 🚀 **Cách sử dụng**

1. **Click vào button** "Chọn ngày trả thực tế"
2. **DateTimePicker sẽ hiển thị**
3. **Chọn ngày** từ picker
4. **Ngày sẽ được format** và hiển thị trong button
5. **Submit form** với ngày đã chọn

## 🔍 **Troubleshooting**

### **Nếu gặp lỗi import:**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules
npm install

# Hoặc sử dụng yarn
yarn install
```

### **Nếu iOS không hoạt động:**
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### **Nếu Android không hoạt động:**
```bash
npx react-native run-android
```

## 📱 **Screenshots**

- **Button state**: Hiển thị placeholder hoặc ngày đã chọn
- **iOS picker**: Spinner style
- **Android picker**: Modal style
- **Validation**: Không cho chọn ngày không hợp lệ

## ✅ **Hoàn thành**

Sau khi cài đặt thư viện, DateTimePicker sẽ hoạt động hoàn hảo trong CapNhatPhieuMuonScreen!
