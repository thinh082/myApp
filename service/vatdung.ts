// services/vatdung.ts
import api from "./api";

// --- Types ---

export type VatDung = {
  id: number;
  chuSoHuuId: number;
  tenVatDung: string;
  moTa?: string;
  danhMucId?: number;
  soLuongTong?: number;
  soLuongCon?: number;
  coTheMuon?: boolean;
  tinhTrang?: string;
  hinhAnh?: string;
  trangThai?: boolean;
};

export type ThemVatDung = {
  chuSoHuuId: number;
  tenVatDung: string;
  moTa?: string;
  danhMucId?: number;
  soLuongTong?: number;
  soLuongCon?: number;
  coTheMuon?: boolean;
  tinhTrang?: string;
  hinhAnh?: string;
  trangThai?: boolean;
};

export type ApiResponse = {
  message: string;
  success: boolean;
};

// --- API functions ---

// Lấy danh sách tất cả vật dụng
export async function getDanhSachVatDung(): Promise<VatDung[]> {
  const response = await api.get<VatDung[]>("/api/VatDung/DanhSachVatDung");
  return response.data;
}

// Lấy danh sách vật dụng theo chủ sở hữu
export async function getDanhSachVatDungTheoChuSoHuu(
  chuSoHuuId: number
): Promise<VatDung[]> {
  const response = await api.post<VatDung[]>(
    "/api/VatDung/DanhSachVatDungTheoChuSoHuu",
    chuSoHuuId
  );
  return response.data;
}

// Thêm vật dụng mới
export async function themVatDung(vatDung: ThemVatDung): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(
    "/api/VatDung/ThemVatDung",
    vatDung
  );
  return response.data;
}

// Cập nhật vật dụng
export async function capNhatVatDung(vatDung: VatDung): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(
    "/api/VatDung/CapNhatVatDung",
    vatDung
  );
  return response.data;
}

// Xóa vật dụng
export async function xoaVatDung(id: number): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>("/api/VatDung/XoaVatDung", id);
  return response.data;
}

// Xem chi tiết vật dụng
export async function getChiTietVatDung(
  idVatDung: number
): Promise<VatDung | null> {
  const response = await api.post<VatDung>("/api/VatDung/ChiTietVatDung?idVatDung=" + idVatDung);
  return response.data;
}