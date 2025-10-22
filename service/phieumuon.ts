// services/phieumuon.ts
import api from "./api";

// --- Types ---

export type VatDungInfo = {
  id: number;
  tenVatDung: string;
  moTa?: string;
  tinhTrang?: string;
};

export type PhieuMuon = {
  id: number;
  soLuong: number;
  ngayMuon: string;         // ISO string "2025-10-18T00:00:00"
  ngayTraDuKien: string;    // ISO string
  ngayTraThucTe?: string;   // ISO string
  ghiChu?: string;
  trangThaiId: number;
  ngayTao: string;          // ISO string
  vatDung?: VatDungInfo;    // Optional để tránh lỗi khi API không trả về đầy đủ
};

// Type cũ để backward compatibility
export type PhieuMuonLegacy = {
  id: number;
  vatDungId: number;
  nguoiMuonId: number;
  chuSoHuuId: number;
  soLuong: number;
  ngayMuon: string;         // ISO string "2025-10-18T00:00:00"
  ngayTraDuKien: string;    // ISO string
  ngayTraThucTe?: string;   // ISO string
  ghiChu?: string;
  trangThaiId: number;
  ngayTao: string;          // ISO string
};

export type ThemPhieuMuon = {
  vatDungId: number;
  nguoiMuonId: number;
  chuSoHuuId: number;
  soLuong: number;
  ngayMuon: string;         // ISO string "2025-10-18T00:00:00"
  ngayTraDuKien: string;    // ISO string
  ghiChu?: string;
};

export type SuaPhieuMuon = {
  id: number;
  ngayTraThucTe?: string;   // ISO string
  ghiChu?: string;
  trangThaiId?: number;
};

export type ApiResponse = {
  message: string;
  success: boolean;
};

// --- API functions ---

// Lấy danh sách phiếu mượn trả (với thông tin vật dụng)
export async function getDanhSachPhieuMuonTra(): Promise<PhieuMuon[]> {
  const response = await api.get<PhieuMuon[]>("/api/PhieuMuonTra/DanhSachPhieuMuonTra");
  return response.data;
}

// Lấy danh sách phiếu mượn trả theo người mượn
export async function getDanhSachPhieuMuonTraTheoNguoiMuon(nguoiMuonId: number): Promise<PhieuMuon[]> {
  if (nguoiMuonId === 0) {
    throw new Error("Người mượn Id không được để trống");
  }
  
  const response = await api.post<PhieuMuon[]>(
    "/api/PhieuMuonTra/DanhSachPhieuMuonTraTheoNguoiMuon?nguoiMuonId=" + nguoiMuonId,
  );
  return response.data;
}

// Lấy danh sách phiếu mượn trả theo chủ sở hữu
export async function getDanhSachPhieuMuonTraTheoChuSoHuu(idTaiKhoan: number): Promise<PhieuMuon[]> {
  if (idTaiKhoan === 0) {
    throw new Error("ID tài khoản không được để trống");
  }
  
  const response = await api.post<PhieuMuon[]>(
    "/api/PhieuMuonTra/DanhSachPhieuMuonTraTheoChuSoHuu?idTaiKhoan=" + idTaiKhoan
  );
  return response.data;
}

// Lấy danh sách phiếu mượn trả (format cũ - backward compatibility)
export async function getDanhSachPhieuMuonTraLegacy(): Promise<PhieuMuonLegacy[]> {
  const response = await api.get<PhieuMuonLegacy[]>("/api/PhieuMuonTra/DanhSachPhieuMuonTra");
  return response.data;
}

// Lấy chi tiết phiếu mượn trả theo ID
export async function getChiTietPhieuMuon(id: number): Promise<PhieuMuon> {
  const response = await api.post<PhieuMuon>('/api/PhieuMuonTra/chitiet?id=' + id);
  return response.data;
}

// Thêm phiếu mượn trả
export async function themPhieuMuonTra(
  body: ThemPhieuMuon
): Promise<ApiResponse> {
  console.log('Gửi request đến API:', {
    url: "/api/PhieuMuonTra/ThemPhieuMuonTra",
    data: body
  });
  
  try {
    const response = await api.post<ApiResponse>(
      "/api/PhieuMuonTra/ThemPhieuMuonTra",
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log('Response từ API:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Lỗi API themPhieuMuonTra:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

// Cập nhật phiếu mượn trả
export async function capNhatPhieuMuonTra(
  body: SuaPhieuMuon
): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(
    "/api/PhieuMuonTra/CapNhatPhieuMuonTra",
    body
  );
  return response.data;
}

// Xóa phiếu mượn trả
export async function xoaPhieuMuonTra(
  id: number
): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>(
    "/api/PhieuMuonTra/XoaPhieuMuonTra?id="+id
  );
  return response.data;
}
