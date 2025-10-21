// services/auth.ts
import api from "./api";

// --- Request & Response types ---

export type DangNhapRequest = {
  email: string;
  matKhau: string;
};

export type DangNhapResponse = {
  message: string;
  taiKhoanId?: number; // chỉ có khi đăng nhập thành công
  chuSoHuu?: boolean; // true: chủ sở hữu, false: người mượn
};

export type DangKyRequest = {
  email: string;
  matKhau: string;
  soDienThoai: string;
  diaChi: string;
  hoTen: string;
  LoaiTaiKhoanId: number; // 2: Chủ sở hữu, 3: Người mượn
};

export type DangKyResponse = {
  message: string;
  success: boolean;
};

export type ThongTinCaNhan = {
  id: number;
  email: string;
  hoTen: string;
  diaChi: string;
  soDienThoai: string;
  ngayTao: string;
  hinhAnh?: string;
};

export type CapNhatThongTinRequest = {
  email: string;
  matKhau: string;
  soDienThoai: string;
  diaChi: string;
  hoTen: string;
};

export type CapNhatThongTinResponse = {
  message: string;
  success: boolean;
};

// --- API functions ---

// Đăng nhập
export async function DangNhap(
  body: DangNhapRequest
): Promise<DangNhapResponse> {
  const response = await api.post<DangNhapResponse>(
    "/api/XacThuc/DangNhap",
    {
      email: body.email,
      matKhau: body.matKhau
    }
  );
  return response.data;
}

// Đăng ký
export async function DangKy(
  body: DangKyRequest
): Promise<DangKyResponse> {
  const response = await api.post<DangKyResponse>(
    "/api/XacThuc/DangKy",
    body
  );
  return response.data;
}

// Xem thông tin cá nhân
export async function XemThongTinCaNhan(
  idTaiKhoan: number
): Promise<ThongTinCaNhan> {
  const response = await api.get<ThongTinCaNhan>(
    `/api/XacThuc/XemThongTinCaNhan?idTaiKhoan=${idTaiKhoan}`
  );
  return response.data;
}

// Cập nhật thông tin cá nhân
export async function CapNhatThongTinCaNhan(
  idTaiKhoan: number,
  body: CapNhatThongTinRequest
): Promise<CapNhatThongTinResponse> {
  const response = await api.post<CapNhatThongTinResponse>(
    `/api/XacThuc/CapNhatThongTinCaNhan?idTaiKhoan=${idTaiKhoan}`,
    body
  );
  return response.data;
}
