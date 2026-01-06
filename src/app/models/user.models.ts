export interface User {
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message?: string;
  user?: User;
}
