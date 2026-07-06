export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  activeStatus: "ACTIVE" | "BANNED";
  role: "TENANT" | "LANDLORD" | "ADMIN";
}