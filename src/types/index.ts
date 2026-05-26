export interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string;
}

export interface AuthUser {
  id: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
