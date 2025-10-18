# Cập nhật API PhieuMuon - Migration Guide

## Thay đổi API Response Structure

### Trước đây (Legacy API):
```json
{
  "id": 1,
  "vatDungId": 12,
  "nguoiMuonId": 3,
  "chuSoHuuId": 2,
  "soLuong": 1,
  "ngayMuon": "2025-01-15T00:00:00",
  "ngayTraDuKien": "2025-01-22T00:00:00",
  "ngayTraThucTe": null,
  "ghiChu": "Mượn laptop",
  "trangThaiId": 1,
  "ngayTao": "2025-01-15T10:30:00"
}
```

### Hiện tại (New API):
```json
{
  "id": 1,
  "soLuong": 1,
  "ngayMuon": "2025-01-15T00:00:00",
  "ngayTraDuKien": "2025-01-22T00:00:00",
  "ngayTraThucTe": null,
  "ghiChu": "Mượn laptop",
  "trangThaiId": 1,
  "ngayTao": "2025-01-15T10:30:00",
  "vatDung": {
    "id": 12,
    "tenVatDung": "Laptop Dell XPS 13",
    "moTa": "Laptop cao cấp cho công việc",
    "tinhTrang": "Mới"
  }
}
```

## Thay đổi trong Code

### 1. Service Layer (`service/phieumuon.ts`)

#### Types mới:
```typescript
export type VatDungInfo = {
  id: number;
  tenVatDung: string;
  moTa?: string;
  tinhTrang?: string;
};

export type PhieuMuon = {
  id: number;
  soLuong: number;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe?: string;
  ghiChu?: string;
  trangThaiId: number;
  ngayTao: string;
  vatDung: VatDungInfo; // ✅ Thông tin vật dụng được embed
};

// Type cũ để backward compatibility
export type PhieuMuonLegacy = {
  id: number;
  vatDungId: number;      // ❌ Không còn trong API mới
  nguoiMuonId: number;    // ❌ Không còn trong API mới
  chuSoHuuId: number;     // ❌ Không còn trong API mới
  soLuong: number;
  ngayMuon: string;
  ngayTraDuKien: string;
  ngayTraThucTe?: string;
  ghiChu?: string;
  trangThaiId: number;
  ngayTao: string;
};
```

#### Functions:
```typescript
// ✅ Sử dụng type mới
export async function getDanhSachPhieuMuonTra(): Promise<PhieuMuon[]>

// 🔄 Backward compatibility
export async function getDanhSachPhieuMuonTraLegacy(): Promise<PhieuMuonLegacy[]>
```

### 2. Screen Updates

#### CapNhatPhieuMuonScreen.tsx
**Trước:**
```typescript
<Text style={styles.phieuMuonInfo}>
  Vật dụng ID: {item.vatDungId} | Số lượng: {item.soLuong}
</Text>
```

**Sau:**
```typescript
<Text style={styles.phieuMuonInfo}>
  Vật dụng: {item.vatDung.tenVatDung} | Số lượng: {item.soLuong}
</Text>
```

#### XoaPhieuMuonScreen.tsx
**Trước:**
```typescript
<Text style={styles.phieuMuonInfo}>
  Vật dụng ID: {item.vatDungId} | Người mượn ID: {item.nguoiMuonId}
</Text>
```

**Sau:**
```typescript
<Text style={styles.phieuMuonInfo}>
  Vật dụng: {item.vatDung.tenVatDung} | Số lượng: {item.soLuong}
</Text>
```

## Lợi ích của API mới

### 1. **Giảm số lượng API calls**
- Trước: Cần gọi API để lấy thông tin vật dụng riêng
- Sau: Thông tin vật dụng đã được embed trong response

### 2. **Cải thiện Performance**
- Giảm network requests
- Giảm loading time
- Better user experience

### 3. **Dữ liệu phong phú hơn**
- Hiển thị tên vật dụng thay vì chỉ ID
- Có thêm mô tả và tình trạng vật dụng
- Thông tin đầy đủ hơn cho người dùng

## Breaking Changes

### 1. **Loại bỏ fields**
- `vatDungId` → Sử dụng `vatDung.id`
- `nguoiMuonId` → Không còn trong API
- `chuSoHuuId` → Không còn trong API

### 2. **Thêm nested object**
- `vatDung` object chứa thông tin chi tiết vật dụng

### 3. **Lọc dữ liệu**
- Trước: Có thể lọc theo `chuSoHuuId`
- Sau: Cần implement logic lọc ở backend

## Migration Checklist

- [x] Cập nhật TypeScript types
- [x] Cập nhật service functions
- [x] Cập nhật CapNhatPhieuMuonScreen
- [x] Cập nhật XoaPhieuMuonScreen
- [x] Thêm backward compatibility
- [x] Test API integration
- [ ] Cập nhật backend để lọc theo chủ sở hữu
- [ ] Cập nhật các screen khác nếu cần

## Notes

1. **Backward Compatibility**: Giữ lại `PhieuMuonLegacy` type để hỗ trợ code cũ
2. **TODO**: Cần implement logic lọc theo chủ sở hữu ở backend
3. **Performance**: API mới hiệu quả hơn với ít requests hơn
4. **UX**: Người dùng thấy tên vật dụng thay vì chỉ ID

## Next Steps

1. Test với API backend mới
2. Implement filtering logic ở backend
3. Cập nhật các screen khác nếu cần
4. Remove legacy code sau khi migration hoàn tất
