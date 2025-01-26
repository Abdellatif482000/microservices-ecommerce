export interface signupInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum?: number;
  address?: string | number;
}

export interface signinInterface {
  email: string;
  password: string;
}

export interface userSessionData {
  id: number;
  username: string;
  email: string;
  role: "admin" | "customer";
}
