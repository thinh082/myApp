# Hệ thống Quản lý Cho thuê Đồ

## Tổng quan
Hệ thống quản lý cho thuê đồ được thiết kế cho người cho thuê (chủ sở hữu) để quản lý vật dụng và phiếu mượn trả.

## Cấu trúc Screen

### 1. QuanLyChoThueScreen.tsx
**Màn hình chính** - Menu điều hướng cho tất cả chức năng quản lý
- **Chức năng**: Hiển thị menu các chức năng quản lý
- **API sử dụng**: Không trực tiếp
- **Navigation**: Điều hướng đến các screen con

### 2. ThemVatDungScreen.tsx
**Thêm vật dụng mới**
- **Chức năng**: Form thêm vật dụng mới vào danh mục cho thuê
- **API sử dụng**: `themVatDung()` từ `service/vatdung.ts`
- **Tính năng**:
  - Form validation
  - Loading state
  - Toggle cho các trường boolean
  - Reset form sau khi thêm thành công

### 3. CapNhatVatDungScreen.tsx
**Cập nhật vật dụng**
- **Chức năng**: Chọn và chỉnh sửa thông tin vật dụng đã có
- **API sử dụng**: 
  - `getDanhSachVatDungTheoChuSoHuu()` để lấy danh sách
  - `capNhatVatDung()` để cập nhật
- **Tính năng**:
  - Layout 2 cột: danh sách bên trái, form bên phải
  - Chọn vật dụng từ danh sách
  - Form validation
  - Tự động làm mới danh sách sau khi cập nhật

### 4. XoaVatDungScreen.tsx
**Xóa vật dụng**
- **Chức năng**: Xem danh sách và xóa vật dụng
- **API sử dụng**: 
  - `getDanhSachVatDungTheoChuSoHuu()` để lấy danh sách
  - `xoaVatDung()` để xóa
- **Tính năng**:
  - Hiển thị thông tin chi tiết vật dụng
  - Xác nhận trước khi xóa
  - Warning message
  - Empty state khi không có dữ liệu

### 5. DanhSachVatDungChuSoHuuScreen.tsx
**Danh sách vật dụng của tôi**
- **Chức năng**: Xem tất cả vật dụng đang cho thuê
- **API sử dụng**: `getDanhSachVatDungTheoChuSoHuu()`
- **Tính năng**:
  - Hiển thị thống kê tổng quan
  - Card layout với hình ảnh
  - Status badges (Có sẵn, Sắp hết hàng, Hết hàng)
  - Pull-to-refresh
  - Empty state

### 6. CapNhatPhieuMuonScreen.tsx
**Cập nhật phiếu mượn**
- **Chức năng**: Chọn và cập nhật trạng thái phiếu mượn trả
- **API sử dụng**: 
  - `getDanhSachPhieuMuonTra()` để lấy danh sách
  - `capNhatPhieuMuonTra()` để cập nhật
- **Tính năng**:
  - Layout 2 cột: danh sách bên trái, form bên phải
  - Lọc phiếu mượn theo chủ sở hữu
  - Hiển thị thông tin chi tiết phiếu mượn
  - Cập nhật ngày trả thực tế, ghi chú, trạng thái

### 7. XoaPhieuMuonScreen.tsx
**Xóa phiếu mượn**
- **Chức năng**: Xem danh sách và xóa phiếu mượn trả
- **API sử dụng**: 
  - `getDanhSachPhieuMuonTra()` để lấy danh sách
  - `xoaPhieuMuonTra()` để xóa
- **Tính năng**:
  - Lọc phiếu mượn theo chủ sở hữu
  - Hiển thị thống kê theo trạng thái
  - Xác nhận trước khi xóa
  - Warning message
  - Empty state

## API Mapping

| Screen | API Functions |
|--------|---------------|
| QuanLyChoThueScreen | - |
| ThemVatDungScreen | `themVatDung()` |
| CapNhatVatDungScreen | `getDanhSachVatDungTheoChuSoHuu()`, `capNhatVatDung()` |
| XoaVatDungScreen | `getDanhSachVatDungTheoChuSoHuu()`, `xoaVatDung()` |
| DanhSachVatDungChuSoHuuScreen | `getDanhSachVatDungTheoChuSoHuu()` |
| CapNhatPhieuMuonScreen | `getDanhSachPhieuMuonTra()`, `capNhatPhieuMuonTra()` |
| XoaPhieuMuonScreen | `getDanhSachPhieuMuonTra()`, `xoaPhieuMuonTra()` |

## Tính năng chung

### UI/UX
- **Design system**: Consistent color scheme và typography
- **Loading states**: ActivityIndicator cho tất cả API calls
- **Error handling**: Alert messages cho lỗi
- **Empty states**: Friendly messages khi không có dữ liệu
- **Validation**: Form validation với thông báo lỗi rõ ràng

### Navigation
- Sử dụng `useNavigation` hook
- TypeScript support với `@ts-ignore` cho navigation types
- Screen names được định nghĩa rõ ràng

### State Management
- Local state với `useState`
- Loading states riêng biệt cho từng chức năng
- Form data management với controlled components

### Error Handling
- Try-catch cho tất cả API calls
- User-friendly error messages
- Graceful fallbacks

## Cách sử dụng

1. **QuanLyChoThueScreen** làm entry point
2. Chọn chức năng từ menu
3. Thực hiện các thao tác CRUD tương ứng
4. Hệ thống tự động cập nhật dữ liệu và UI

## Lưu ý kỹ thuật

- Tất cả screen đều sử dụng `SafeAreaView`
- Responsive design với flexbox
- TypeScript strict mode
- Consistent naming convention
- Proper error boundaries
- Memory leak prevention với proper cleanup
