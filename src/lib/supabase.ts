import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'super_admin' | 'admin' | 'corretor' | 'suporte';

export interface Profile {
  id: string;
  email: string;
  cpf?: string;
  nome_completo: string;
  telefone?: string;
  role: UserRole;
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}
