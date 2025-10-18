# Debug Guide - CapNhatPhieuMuonScreen UI Issue

## Vấn đề đã được sửa

### 1. **Syntax Error**
- **Lỗi**: Thiếu dấu chấm phẩy ở dòng 40
- **Sửa**: Thêm `;` sau `setPhieuMuonList(data)`

### 2. **Null Reference Error**
- **Lỗi**: `vatDung` có thể undefined khi API không trả về đầy đủ
- **Sửa**: Sử dụng optional chaining `?.` và fallback values

### 3. **Type Safety**
- **Lỗi**: Type `vatDung` là required nhưng API có thể không trả về
- **Sửa**: Đổi thành `vatDung?: VatDungInfo`

## Debug Steps

### 1. **Kiểm tra Console Logs**
Mở Developer Tools và xem console logs:
```javascript
// API Response sẽ được log khi load danh sách
console.log("API Response:", JSON.stringify(data, null, 2));

// Selected item sẽ được log khi click
console.log("Selected phieu muon:", JSON.stringify(phieuMuon, null, 2));
```

### 2. **Kiểm tra API Response Structure**
Đảm bảo API trả về đúng format:
```json
{
  "id": 1,
  "soLuong": 1,
  "ngayMuon": "2025-01-15T00:00:00",
  "ngayTraDuKien": "2025-01-22T00:00:00",
  "ngayTraThucTe": null,
  "ghiChu": "Mượn Tai nghe Bluetooth",
  "trangThaiId": 1,
  "ngayTao": "2025-01-15T10:30:00",
  "vatDung": {
    "id": 13,
    "tenVatDung": "Tai nghe Bluetooth",
    "moTa": "Tai nghe không dây",
    "tinhTrang": "Mới"
  }
}
```

### 3. **Kiểm tra Network Tab**
- Mở Network tab trong DevTools
- Reload màn hình
- Tìm request đến `/api/PhieuMuonTra/DanhSachPhieuMuonTra`
- Kiểm tra response body

## Code Changes Made

### 1. **Service Layer (`service/phieumuon.ts`)**
```typescript
export type PhieuMuon = {
  id: number;
  soLuong: number;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe?: string;
  ghiChu?: string;
  trangThaiId: number;
  ngayTao: string;
  vatDung?: VatDungInfo; // ✅ Optional để tránh lỗi
};
```

### 2. **UI Components**
```typescript
// Trước (có thể crash)
<Text>Vật dụng: {selectedPhieuMuon.vatDung.tenVatDung}</Text>

// Sau (safe)
<Text>Vật dụng: {selectedPhieuMuon.vatDung?.tenVatDung || "Không xác định"}</Text>
```

### 3. **Debug Logging**
```typescript
const fetchPhieuMuonList = async () => {
  try {
    setLoadingList(true);
    const data = await getDanhSachPhieuMuonTra();
    console.log("API Response:", JSON.stringify(data, null, 2)); // ✅ Debug
    setPhieuMuonList(data);
  } catch (error: any) {
    console.error("Error fetching phieu muon list:", error); // ✅ Error logging
    Alert.alert("Lỗi", "Không thể tải danh sách phiếu mượn: " + error.message);
  } finally {
    setLoadingList(false);
  }
};
```

## Troubleshooting

### Nếu vẫn có lỗi UI:

1. **Kiểm tra API Response**
   - Đảm bảo API trả về đúng format
   - Kiểm tra có `vatDung` object không

2. **Kiểm tra Network**
   - API có trả về 200 OK không?
   - Response body có đúng format không?

3. **Kiểm tra Console**
   - Có error nào trong console không?
   - Debug logs có hiển thị đúng không?

4. **Fallback Values**
   - Nếu `vatDung` null/undefined, sẽ hiển thị "Không xác định"
   - App sẽ không crash nữa

## Next Steps

1. **Test với API thực tế**
2. **Kiểm tra console logs**
3. **Verify UI hiển thị đúng**
4. **Remove debug logs khi hoàn thành**

## Expected Behavior

- ✅ App không crash khi click vào phiếu mượn
- ✅ Hiển thị thông tin vật dụng nếu có
- ✅ Hiển thị "Không xác định" nếu không có thông tin
- ✅ Form cập nhật hoạt động bình thường
- ✅ Debug logs giúp troubleshoot
