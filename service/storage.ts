import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "idTaiKhoan";

export async function setIdTaiKhoan(id: number) {
  try {
    await AsyncStorage.setItem(KEY, id.toString());
  } catch (error) {
    console.error("Lỗi khi lưu idTaiKhoan:", error);
  }
}

export async function getIdTaiKhoan(): Promise<number | null> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value ? parseInt(value, 10) : null;
  } catch (error) {
    console.error("Lỗi khi lấy idTaiKhoan:", error);
    return null;
  }
}

export async function removeIdTaiKhoan() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error("Lỗi khi xóa idTaiKhoan:", error);
  }
}
