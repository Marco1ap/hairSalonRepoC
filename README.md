# Beauty Studio
Visão rápida

Beauty Studio é um app mobile (React Native / Expo) para gerenciar um salão de beleza.
Dois tipos de usuário: Cliente (agenda serviços) e Admin (gerencia serviços e agendamentos). Backend: Supabase (Postgres). Sessão local: AsyncStorage.

Tecnologias

React / React Native (Expo managed)

Expo

@supabase/supabase-js

React Navigation (native, native-stack, bottom-tabs)

react-native-gesture-handler, react-native-reanimated, react-native-screens

react-native-safe-area-context

@react-native-async-storage/async-storage

expo-linear-gradient

react-native-keyboard-aware-scroll-view

@react-native-community/datetimepicker

expo-image-picker

@expo/vector-icons

Quick start — rodando localmente
1. Pré-requisitos

Node.js (v16+)

Yarn (recomendado) ou npm

Expo CLI (opcional): npm i -g expo-cli

Conta no Supabase

2. Clonar + instalar
git clone <seu-repo>
cd <seu-repo>
yarn install
# ou
npm install

3. Instalar dependências nativas (Expo)
expo install expo-linear-gradient expo-image-picker @react-native-community/datetimepicker @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated @expo/vector-icons
yarn add @supabase/supabase-js @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-keyboard-aware-scroll-view

4. Configurar variáveis de ambiente

Crie arquivo env.js (ou use variáveis de ambiente) em src/services/ ou ajuste src/services/supabase.js com suas credenciais:

// src/services/supabase.js (edit)
const SUPABASE_URL = '<YOUR_SUPABASE_URL>';
const SUPABASE_ANON_KEY = '<YOUR_SUPABASE_ANON_KEY>';


Não comite chaves para repositórios públicos.

5. Configurar o Supabase (tabelas essenciais)

No SQL editor do Supabase cole e execute:

-- users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  cpf text,
  phone text,
  password_hash text,
  user_type text default 'client', -- 'client' | 'admin'
  photo_url text,
  created_at timestamptz default now()
);

-- services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric,
  category text,
  image_url text,
  created_at timestamptz default now()
);

-- appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.users(id),
  service_id uuid references public.services(id),
  appointment_datetime timestamptz,
  status text,
  final_price numeric,
  notes text,
  created_at timestamptz default now()
);

-- check constraint de status (permite os 3 valores em português)
ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('Pendente','Confirmado','Cancelado'));

Seed rápido (exemplo)
INSERT INTO public.users (name, cpf, phone, password_hash, user_type) VALUES
('Admin Test', '00000000000', '11999999999', 'adminpass', 'admin'),
('Cliente Test', '11111111111', '11988888888', 'clientpass', 'client');

INSERT INTO public.services (name, description, price) VALUES
('Corte', 'Corte masculino', 50.00),
('Pintura', 'Coloração completa', 120.00);

6. Rodar o app
expo start -c
# ou, RN CLI:
# npx react-native start --reset-cache


Abra no emulador ou no app Expo Go.

Credenciais de teste (sugestão)

Admin

CPF: 00000000000

Senha: adminpass

Cliente

CPF: 11111111111

Senha: clientpass

(Se você inseriu outros valores no seed, use-os.)

Como o app funciona — fluxo essencial

AppNavigator carrega user do AsyncStorage; mostra AuthStack (Login/Register) ou MainTabs.

Login usa signIn em src/services/supabase.js para validar CPF + senha (campo password_hash), então chama AuthContext.signIn(user) — o root troca a árvore de navegação.

AuthContext mantém user e provê signIn/signOut para telas.

Acessos de admin/cliente são controlados pelo campo user.user_type === 'admin' no frontend.

Appointments usa services para popular preço e aplica enforcedPrice no save quando o usuário não é admin. Admin pode alterar status e final_price.

Regras de segurança (o que falta / recomendações)

Não salvar senhas em texto: use Supabase Auth + hash (bcrypt/argon2).

Ativar Row Level Security (RLS) no Supabase e criar policies:

Apenas admin pode INSERT/UPDATE/DELETE em services.

Usuário só pode criar/editar seus próprios agendamentos (ou admin).

Validar preços/status no servidor (policies/functions) além do front-end.

Guardar chaves em .env e não commitar.

Dicas de debug — problemas comuns que já enfrentamos

Unable to resolve asset "./assets/icon.png" → ajustar app.json para apontar ./assets/logo.png ou copiar logo.png para icon.png.

RESET not handled → causava dispatch de reset em navigator incorreto; solução: centralizar autenticação em AppNavigator + AuthContext.

violates check constraint "appointments_status_check" → atualizar constraint no Supabase (adicionar 'Confirmado') ou mapear status no app.

VirtualizedLists nested in ScrollView warning → evitar FlatList/SectionList dentro de ScrollView; uso de map() para listas pequenas.

Modal não rolava → usar ScrollView + KeyboardAvoidingView no modal.

Lista de funcionalidades (para demonstrar)

Login / Registro / Recuperar senha (simulado).

Profile: editar nome/telefone, trocar avatar (local URI salvo).

Home: mostra “Agendamentos de Hoje”.

Services:

Cliente: ver lista de serviços.

Admin: criar, editar, excluir serviços (modal).

Appointments:

Cliente: criar/agendar para si — preço preenchido e não editável; não vê campo status.

Admin: pesquisar cliente por nome/CPF, criar/editar agendamentos para clientes, alterar status, editar preço.

Logout (funciona em Home e Profile).

Arquivos importantes (mapa rápido)

src/navigation/AppNavigator.js — root navigator + AuthContext provider

src/contexts/AuthContext.js — contexto de autenticação

src/services/supabase.js — cliente Supabase + helpers (onlyDigits, signIn, createUser)

src/screens/Auth/* — Login / Register / Recover

src/screens/Home/HomeScreen.js

src/screens/Services/ServicesScreen.js

src/screens/Appointments/AppointmentsScreen.js

src/screens/Profile/ProfileScreen.js

src/styles/* — arquivos de estilo

Roteiro curto para apresentação (2–4 minutos)

Slide 1 — objetivo do app (20s)

Slide 2 — tecnologias (10s)

Slide 3 — arquitetura (AuthContext → AppNavigator) + diagrama simples (20s)

Demo rápida (90s):

Login admin → criar serviço → criar agendamento para cliente → alterar status.

Login cliente → criar agendamento (mostrar que não edita preço/status).

Slide final — próximos passos e segurança (20s)

Perguntas

Snippets úteis para colar (backup)
Enforce price in frontend (exemplo)
const svc = services.find(s => s.id === formData.service_id);
const enforcedPrice = svc ? Number(svc.price) : null;

const payload = {
  final_price: isUserAdmin(user) ? parseFloat(formData.final_price) : enforcedPrice,
  status: isUserAdmin(user) ? formData.status : (editingAppointment ? editingAppointment.status : 'Pendente'),
  // ...
};

SQL para permissões de status
ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('Pendente','Confirmado','Cancelado'));

package.json sugerido (base)

Cole no package.json se precisar de referência rápida:

{
  "name": "beautystudio",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^48.0.0",
    "react": "18.2.0",
    "react-native": "0.71.0",
    "@supabase/supabase-js": "^2.0.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/native-stack": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "@react-native-async-storage/async-storage": "^1.17.11"
  }
}


Ajuste versões conforme seu ambiente.
