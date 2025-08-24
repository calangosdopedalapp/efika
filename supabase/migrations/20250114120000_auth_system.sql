/*
# Sistema de Autenticação Efika Seguros
Criação das tabelas e estruturas necessárias para autenticação e gerenciamento de usuários

## Query Description: 
Esta migração criará o sistema completo de autenticação incluindo perfis de usuários, níveis de acesso e configurações de segurança. Os dados existentes não serão afetados pois são tabelas novas.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- profiles: Perfis de usuários estendidos
- user_roles: Definição de níveis de acesso
- system_config: Configurações do sistema

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Integração com auth.users

## Performance Impact:
- Indexes: Added for performance optimization
- Triggers: Added for automatic profile creation
- Estimated Impact: Minimal impact on performance
*/

-- Enum para tipos de usuário
CREATE TYPE user_role_type AS ENUM ('super_admin', 'admin', 'corretor', 'suporte');

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    role user_role_type NOT NULL DEFAULT 'corretor',
    is_active BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de log de atividades
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_cpf ON profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, nome_completo, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', 'Usuário'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_type, 'corretor')
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Configuração inicial do sistema
INSERT INTO system_config (key, value, description) VALUES
('system_initialized', 'false', 'Indica se o sistema foi inicializado com Super Admin'),
('maintenance_mode', 'false', 'Modo de manutenção do sistema'),
('registration_enabled', 'true', 'Permite registro de novos usuários'),
('two_factor_required', 'false', 'Exige autenticação de dois fatores')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super Admin and Admin can view all profiles" ON profiles
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
    )
);

CREATE POLICY "Super Admin and Admin can insert profiles" ON profiles
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
    )
);

CREATE POLICY "Super Admin and Admin can update profiles" ON profiles
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
    )
);

-- Policies para user_activity_log
CREATE POLICY "Users can view own activity" ON user_activity_log
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity" ON user_activity_log
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all activity" ON user_activity_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
    )
);

-- Policies para system_config
CREATE POLICY "Admin can view config" ON system_config
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin')
        AND is_active = true
    )
);

CREATE POLICY "Super Admin can modify config" ON system_config
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role = 'super_admin'
        AND is_active = true
    )
);
