export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole; // This drives the RBAC
}