/*
          # [CORREÇÃO] Políticas de Segurança (RLS)

          Este script corrige um erro de recursão infinita nas políticas da tabela 'profiles' e garante que a tabela 'system_config' seja legível por usuários autenticados.

          ## Descrição da Consulta:
          - **Impacto:** Esta operação substitui as políticas de segurança existentes. Não há perda de dados.
          - **Riscos:** Baixo. As novas políticas são mais seguras e eficientes.
          - **Precauções:** Nenhuma precaução especial é necessária.

          ## Metadata:
          - Categoria do Esquema: "Segurança"
          - Nível de Impacto: "Baixo"
          - Requer Backup: false
          - Reversível: true (reaplicando as políticas antigas)

          ## Detalhes da Estrutura:
          - Tabelas Afetadas: `profiles`, `system_config`
          - Políticas Removidas: `Enable read access for authenticated users`, `Admins can manage all profiles`
          - Políticas Adicionadas: Novas políticas para `profiles` e `system_config`

          ## Implicações de Segurança:
          - Status RLS: Ativado
          - Mudanças de Política: Sim
          - Requisitos de Autenticação: As políticas dependem do `auth.uid()` e `auth.role()`.
*/

-- 1. Remover políticas antigas e problemáticas da tabela 'profiles'
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON "public"."profiles";
DROP POLICY IF EXISTS "Admins can manage all profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "public"."profiles";

-- 2. Criar políticas novas e seguras para a tabela 'profiles'

-- Política 1: Usuários podem ver e editar seu próprio perfil.
-- Esta política é a mais importante. Ela compara diretamente o ID do usuário autenticado com o ID da linha, evitando a recursão.
CREATE POLICY "Usuários podem gerenciar seu próprio perfil"
ON "public"."profiles"
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política 2: Admins e Super Admins podem ver todos os perfis.
-- Esta política verifica a role do usuário *solicitante* uma única vez para evitar recursão.
CREATE POLICY "Admins podem visualizar todos os perfis"
ON "public"."profiles"
FOR SELECT
USING (
  (get_user_role(auth.uid()) IN ('admin', 'super_admin'))
);

-- Política 3: Admins e Super Admins podem atualizar qualquer perfil.
CREATE POLICY "Admins podem atualizar todos os perfis"
ON "public"."profiles"
FOR UPDATE
USING (
  (get_user_role(auth.uid()) IN ('admin', 'super_admin'))
);

-- Política 4: Apenas Super Admins podem deletar perfis (e não podem deletar a si mesmos).
CREATE POLICY "Super Admins podem deletar perfis"
ON "public"."profiles"
FOR DELETE
USING (
  (get_user_role(auth.uid()) = 'super_admin') AND (auth.uid() <> id)
);


-- 3. Garantir que a tabela 'system_config' seja legível

-- Remove a política antiga se existir
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."system_config";

-- Adiciona uma política que permite que qualquer usuário autenticado leia a configuração do sistema.
-- Isso é necessário para a função 'checkSystemInitialization' funcionar corretamente.
CREATE POLICY "Usuários autenticados podem ler a configuração do sistema"
ON "public"."system_config"
FOR SELECT
USING (auth.role() = 'authenticated');
