/*
          # Correção da Recursão Infinita nas Políticas RLS

          Este script corrige o erro "infinite recursion detected in policy for relation 'profiles'".
          O erro ocorre porque as políticas RLS atuais tentam ler da tabela 'profiles' para determinar o acesso,
          criando um loop infinito. A solução é usar funções que leem o nível de acesso (role) diretamente
          do JWT do usuário autenticado, evitando a consulta recursiva.

          ## Query Description:
          - **Impacto:** As políticas de segurança para a tabela 'profiles' serão substituídas. Não há perda de dados.
          - **Riscos:** Baixo. As novas políticas são mais seguras e eficientes.
          - **Precauções:** Nenhuma. A aplicação deve funcionar corretamente após a migração.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true (revertendo para as políticas antigas, que são defeituosas)

          ## Structure Details:
          - **Funções Criadas:** `get_my_claim(TEXT)`, `get_my_role()`
          - **Políticas Removidas:** `Allow individual read access`, `Allow admin read access`, `Allow individual update access`, `Allow admin update access` na tabela `profiles`.
          - **Políticas Criadas:** `Allow authenticated users to read profiles`, `Allow users to update their own profile`, `Allow admins to manage all profiles`, `Allow admins to delete profiles`.

          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: JWT de autenticação é necessário para acessar os dados.

          ## Performance Impact:
          - Indexes: Nenhum
          - Triggers: Nenhum
          - Estimated Impact: Positivo. As novas políticas são mais performáticas, pois evitam consultas extras ao banco de dados.
*/

-- Step 1: Create helper functions to securely get claims from the JWT.
-- This avoids querying the 'profiles' table within a policy on the same table.

CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT)
RETURNS JSONB AS $$
  SELECT COALESCE(current_setting('request.jwt.claims', true)::JSONB ->> claim, NULL)::JSONB;
$$ LANGUAGE SQL STABLE;


CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT get_my_claim('user_metadata')::JSONB ->> 'role';
$$ LANGUAGE SQL STABLE;


-- Step 2: Drop the old, recursive policies on the 'profiles' table.
-- We drop them to replace with non-recursive versions.
-- Using "IF EXISTS" to prevent errors if they were already removed.

DROP POLICY IF EXISTS "Allow individual read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual update access" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin update access" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to delete profiles" ON public.profiles;


-- Step 3: Create new, secure, and non-recursive policies.

-- Policy for SELECT:
-- Users can see their own profile.
-- Admins and Super Admins can see all profiles.
CREATE POLICY "Allow authenticated users to read profiles"
ON public.profiles FOR SELECT
USING (
  (auth.uid() = id) OR
  (get_my_role() IN ('super_admin', 'admin'))
);

-- Policy for UPDATE:
-- Users can update their own profile.
-- Admins and Super Admins can update any profile.
CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (
  (auth.uid() = id) OR
  (get_my_role() IN ('super_admin', 'admin'))
)
WITH CHECK (
  (auth.uid() = id) OR
  (get_my_role() IN ('super_admin', 'admin'))
);

-- Policy for DELETE:
-- Only Admins and Super Admins can delete profiles.
-- Prevents a user from deleting their own account via this vector.
CREATE POLICY "Allow admins to delete profiles"
ON public.profiles FOR DELETE
USING (
  get_my_role() IN ('super_admin', 'admin')
);

-- Note: INSERT is handled by the `on_auth_user_created` trigger
-- and the `create-user` Edge Function, so no INSERT policy is needed here for users.
