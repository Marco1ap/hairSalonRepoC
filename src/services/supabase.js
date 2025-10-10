import { createClient } from '@supabase/supabase-js';

export function onlyDigits(str = '') {
  return String(str).replace(/\D/g, '');
}


const SUPABASE_URL = 'https://jnzlwvwuykmgasodvndq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuemx3dnd1eWttZ2Fzb2R2bmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDA1NjcsImV4cCI6MjA3NTE3NjU2N30.b7XhFlfHvSDhfnIw53vUC0Q2MTr4cFlk2NOUJM_wppo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function createUser({ name, cpf, phone, password }) {
  const cpfNorm = onlyDigits(cpf);
  const phoneNorm = onlyDigits(phone);

  const { data: existing, error: errCheck } = await supabase
    .from('users')
    .select('id, cpf, phone')
    .or(`cpf.eq.${cpfNorm},phone.eq.${phoneNorm}`)
    .limit(1);

  if (errCheck) {
    return { data: null, error: errCheck };
  }
  if (existing && existing.length > 0) {
    return { data: null, error: { message: 'CPF ou telefone já cadastrado' } };
  }

  const { data, error } = await supabase.from('users').insert([
    {
      name,
      cpf: cpfNorm,
      phone: phoneNorm,
      password_hash: password, // pensando aqui em adicionar uma criptografia no futuro se nao der preguica
      user_type: 'client',
      photo_url: null,
    },
  ]);

  return { data, error };
}


export async function getUserByCpf(identifier) {
  const norm = onlyDigits(identifier);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`cpf.eq.${norm},phone.eq.${norm}`)
    .maybeSingle();

  if (error) throw error;
  return data;
}


export async function signIn({ cpf, password }) {
    try {
        const user = await getUserByCpf(cpf);
        if (!user) {
            return { user: null, error: { message: 'Usuário não encontrado' } };
        }

        if (user.password_hash !== password) {
            return { user: null, error: { message: 'Senha inválida' } };
        }

        return { user, error: null };
    } catch (err) {
        return { user: null, error: err };
    }
}