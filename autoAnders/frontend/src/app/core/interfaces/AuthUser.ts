export interface AuthUser {
  uid: string;
  role: string;
  user: string;
  email: string;
  phoneNumber: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  lastName?: string;
  phoneNumber?: string;
}
