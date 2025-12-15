import { User } from "@/types/auth";

export interface IAuthService {
  login(email: string, pass: string): Promise<{ user: User; token: string }>;
  logout(): void;
  getCurrentUser(): Promise<User | null>;
  isAdmin(user: User): boolean;
}