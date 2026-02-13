# 💰 Finanzy App  

Aplicação web desenvolvida em React com TypeScript para gerenciamento financeiro pessoal, permitindo controle de receitas, despesas e organização de transações de forma simples e intuitiva.

O sistema possibilita registrar entradas e saídas, visualizar saldo atualizado e acompanhar o histórico financeiro em uma interface moderna e responsiva.

O projeto foi desenvolvido para ser parte do meu portfólio pessoal, com o objetivo de demonstrar minhas habilidades em desenvolvimento frontend, organização de código, autenticação de usuários e experiência do usuário. Pretendo atualizá-lo continuamente, adicionando novas funcionalidades e melhorias ao longo do tempo.

🌐 Deploy realizado na Vercel.

---

## 🚀 Funcionalidades

🔐 Autenticação de usuários (login e registro) com Supabase  
👤 Sessão persistente de usuário autenticado  
💵 Cadastro de receitas e despesas  
📋 Listagem completa de transações  
🗑️ Remoção de transações  
📊 Cálculo automático do saldo total  
📈 Atualização dinâmica dos valores  
🔄 Gerenciamento de estado em tempo real  
⚠️ Validação de formulários  
⏳ Feedback visual para ações do usuário  
📱 Layout totalmente responsivo (desktop e mobile)

---

## 🛠️ Tecnologias Utilizadas

React (Vite)  
TypeScript  
CSS3  
Supabase (Autenticação e Backend)  
Vercel (Deploy e hospedagem)

---

## 📂 Estrutura do Projeto

```
Dashboard de Gestão Financeira/
├── .git/
├── node_modules/
├── public/
│   └── FinanzyLogo.png
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── mascote.png
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── components/
│   │   │   │   ├── Authentication.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RecoverPassword.tsx
│   │   │   └── index.ts
│   │   └── transactions/
│   │       ├── components/
│   │       │   ├── mobile/
│   │       │   │   ├── MobileActionBar.tsx
│   │       │   │   ├── MobileFilter.tsx
│   │       │   │   ├── MobileTransactionForm.tsx
│   │       │   │   ├── MobileTransactionList.tsx
│   │       │   │   └── MobileUniqueTransaction.tsx
│   │       │   ├── Filter.tsx
│   │       │   ├── Modal.tsx
│   │       │   ├── Pagination.tsx
│   │       │   ├── TransactionCards.tsx
│   │       │   ├── TransactionForm.tsx
│   │       │   ├── TransactionList.tsx
│   │       │   └── UniqueTransaction.tsx
│   │       ├── context/
│   │       │   └── TransactionContext.tsx
│   │       ├── model/
│   │       │   ├── CategoryIcons.tsx
│   │       │   ├── PaginationDropdownOptions.ts
│   │       │   ├── TransactionOptions.ts
│   │       │   └── TransactionTypes.ts
│   │       ├── services/
│   │       │   └── transactionService.ts
│   │       └── utils/
│   │           ├── formatPrivateCurrency.ts
│   │           └── index.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── Missing.tsx
│   │   │   └── NewUserModal.tsx
│   │   └── utils/
│   │       └── index.ts
│   ├── supabase/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

---

## 🔐 Autenticação

A aplicação utiliza o Supabase para:

- Registro de novos usuários  
- Login com e-mail e senha  
- Gerenciamento de sessão  
- Proteção de rotas privadas  

---

## 🌍 Deploy

O projeto está publicado na Vercel, garantindo:

- Deploy automático via GitHub  
- Build otimizado para produção  
- Ambiente seguro com variáveis de ambiente  

---

## ▶️ Como Executar o Projeto Localmente

1️⃣ Clonar o repositório:

```bash
git clone https://github.com/hubdanielcode/Finanzy-App.git
```

2️⃣ Acessar a pasta do projeto:

```bash
cd Dashboard\ de\ Gestão\ Financeira
```

3️⃣ Instalar as dependências:

```bash
npm install
```

4️⃣ Criar um arquivo `.env` e configurar as variáveis do Supabase:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

5️⃣ Rodar a aplicação:

```bash
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```

---

## ⚙️ Conceitos Aplicados

Componentização  
Gerenciamento de estado com Hooks  
Autenticação JWT com Supabase  
Proteção de rotas  
Integração com Backend (BaaS)  
Persistência de sessão  
Boas práticas de organização de projeto  

---

## 📌 Observações

Os dados financeiros são vinculados ao usuário autenticado.  
Cada usuário visualiza apenas suas próprias transações.

---

## 📄 Licença

Este projeto é livre para fins de estudo, aprendizado e uso pessoal.
