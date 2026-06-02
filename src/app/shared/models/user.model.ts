export type UserRole =
  | 'learner'
  | 'instructor'
  | 'branch_manager'
  | 'branch_viewer'
  | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profile_photo_url?: string;

  // Schema fields
  tenant_id?: number;
  username?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  is_active?: boolean;
  user_type_id?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
