import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TAI_KHOAN_ID: 'taiKhoanId',
  CHU_SO_HUU: 'chuSoHuu',
  IS_LOGGED_IN: 'isLoggedIn',
};

export const StorageService = {
  // Lưu thông tin đăng nhập
  async saveLoginInfo(taiKhoanId: number, chuSoHuu: boolean): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TAI_KHOAN_ID, taiKhoanId.toString()],
        [STORAGE_KEYS.CHU_SO_HUU, chuSoHuu.toString()],
        [STORAGE_KEYS.IS_LOGGED_IN, 'true'],
      ]);
    } catch (error) {
      console.error('Error saving login info:', error);
      throw error;
    }
  },

  // Lấy ID tài khoản
  async getTaiKhoanId(): Promise<number | null> {
    try {
      const id = await AsyncStorage.getItem(STORAGE_KEYS.TAI_KHOAN_ID);
      return id ? parseInt(id, 10) : null;
    } catch (error) {
      console.error('Error getting tai khoan id:', error);
      return null;
    }
  },

  // Lấy thông tin chủ sở hữu
  async getChuSoHuu(): Promise<boolean | null> {
    try {
      const chuSoHuu = await AsyncStorage.getItem(STORAGE_KEYS.CHU_SO_HUU);
      return chuSoHuu ? chuSoHuu === 'true' : null;
    } catch (error) {
      console.error('Error getting chu so huu:', error);
      return null;
    }
  },

  // Kiểm tra trạng thái đăng nhập
  async isLoggedIn(): Promise<boolean> {
    try {
      const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return isLoggedIn === 'true';
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TAI_KHOAN_ID,
        STORAGE_KEYS.CHU_SO_HUU,
        STORAGE_KEYS.IS_LOGGED_IN,
      ]);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Lấy tất cả thông tin đăng nhập
  async getLoginInfo(): Promise<{
    taiKhoanId: number | null;
    chuSoHuu: boolean | null;
    isLoggedIn: boolean;
  }> {
    try {
      const [taiKhoanId, chuSoHuu, isLoggedIn] = await Promise.all([
        this.getTaiKhoanId(),
        this.getChuSoHuu(),
        this.isLoggedIn(),
      ]);

      return {
        taiKhoanId,
        chuSoHuu,
        isLoggedIn,
      };
    } catch (error) {
      console.error('Error getting login info:', error);
      return {
        taiKhoanId: null,
        chuSoHuu: null,
        isLoggedIn: false,
      };
    }
  },
};