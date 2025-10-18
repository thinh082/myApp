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
};

export type DangKyRequest = {
  email: string;
  matKhau: string;
  soDienThoai: string;
};

export type DangKyResponse = {
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
