import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Headers CORS para permitir requisições do seu app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Trata a requisição preflight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Cria um cliente admin do Supabase que pode contornar as políticas de RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtém os dados do novo usuário do corpo da requisição
    const { email, password, nome_completo, cpf, telefone, role } = await req.json()

    if (!email || !password || !nome_completo || !role) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios ausentes.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    // Cria o usuário usando o cliente admin
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Envia um e-mail de confirmação para o novo usuário
      user_metadata: {
        nome_completo,
        role,
        cpf: cpf?.replace(/\D/g, '') || null,
        telefone: telefone?.replace(/\D/g, '') || null,
      },
    })

    if (error) {
      throw error
    }

    // O gatilho 'on_auth_user_created' que criamos anteriormente irá popular a tabela 'profiles' automaticamente.

    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
