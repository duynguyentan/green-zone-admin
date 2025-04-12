import axiosInstance from "../../api/axios";

class StorageService {
  private static ACCESS_TOKEN_KEY = 'accessToken';
  private static REFRESH_TOKEN_KEY = 'refreshToken';

  /**
   * Lấy Access Token từ localStorage
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Lưu Access Token vào localStorage
   */
  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Xóa Access Token khỏi localStorage
   */
  static removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Lấy Refresh Token từ localStorage
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Lưu Refresh Token vào localStorage
   */
  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Xóa Refresh Token khỏi localStorage
   */
  static removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static onLogout() {
    this.removeAccessToken();
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

export default StorageService;
