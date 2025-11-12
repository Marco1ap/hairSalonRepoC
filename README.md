# 💇‍♀️ Beauty Studio

Aplicativo **mobile** desenvolvido em **React Native (com Expo)** para **gestão de salões de beleza**.  
Permite o controle de **clientes, serviços e agendamentos**, com dois tipos de usuários: **Cliente** e **Administrador (Admin)**.

---

## 🧭 Visão Geral

O **Beauty Studio** foi criado para facilitar a rotina de um salão de beleza, centralizando o gerenciamento de clientes, serviços e horários.

### 👤 Cliente
- Pode **criar conta**, visualizar serviços, **agendar horários** e **editar nome e telefone**.  
- **Não** possui permissão para alterar ou excluir serviços e agendamentos de terceiros.

### 🛠️ Administrador (Admin)
- Pode **gerenciar todos os dados**:
  - Criar, editar e excluir serviços;
  - Visualizar e editar agendamentos;
  - Pesquisar clientes;
  - Criar agendamentos para qualquer cliente.

---

## 🔐 Autenticação e Persistência de Dados

- Autenticação básica simulada via tabela **`users`** no **Supabase**.  
- Dados persistidos no **Supabase (PostgreSQL)**.  
- Sessão salva localmente via **AsyncStorage**.  
- Navegação controlada pelo **AppNavigator**, alternando entre rotas de autenticação e rotas principais conforme o status da sessão.

---

## 👥 Permissões por Tipo de Usuário

| **Tela** | **Cliente** | **Administrador (Admin)** |
|-----------|--------------|----------------------------|
| **Home** | Visualiza seus agendamentos do dia | Igual, mas com o badge **“MODO ADMIN”** |
| **Serviços** | Lista de serviços disponíveis | Pode **criar, editar e excluir** serviços |
| **Agendamentos** | Pode criar e editar **seus próprios** agendamentos | Pode **editar qualquer agendamento**, **definir status** e **alterar preço** |
| **Perfil** | Edita nome e telefone | Edita nome, telefone e pode **fazer logout** |

---

## ⚙️ Resumo do Fluxo do Aplicativo

1. **Usuário abre o app** → `AppNavigator` verifica a sessão.  
2. **Não autenticado** → mostra telas de **Login/Registro**.  
3. **Autenticado** → navega entre as abas principais.  
4. **Permissões** → controladas via `user.user_type` (Cliente ou Admin).  
5. **Dados** → sincronizados com o **Supabase** e cache local (`AsyncStorage`).

---


## 🧩 Tecnologias Utilizadas

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![React Native](https://img.shields.io/badge/React%20Native-61DBFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AsyncStorage](https://img.shields.io/badge/AsyncStorage-20232A?logo=react&logoColor=61DAFB)](https://react-native-async-storage.github.io/async-storage/)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-CA4245?logo=react&logoColor=white)](https://reactnavigation.org/)



---

## 🚀 Futuras Implementações

- Notificações de agendamento (push/local)
- Integração com calendário do dispositivo
- Filtros de busca por serviço ou cliente
- Painel web para administradores

---

## 📸 Preview

![Preview do aplicativo](https://i.imgur.com/V0u7i77.jpeg)

---

## 📄 Licença

Este projeto é de uso acadêmico e aberto para fins de estudo.  
Sinta-se à vontade para contribuir e melhorar o **Beauty Studio** 💅

---

