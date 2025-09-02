export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type: string;
  expires_in: number;
  user: User;
}