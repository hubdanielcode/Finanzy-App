# 💰 Finanzy

Aplicação web de **gestão financeira pessoal** desenvolvida com React e TypeScript, permitindo controle de receitas e despesas com autenticação segura, atualização em tempo real e interface totalmente responsiva.

O projeto foi desenvolvido com foco em boas práticas de arquitetura frontend, organização escalável por features e integração com backend via BaaS.

🔗 Deploy: https://finanzy-app.vercel.app/ <br/>
🔗 Repositório: https://github.com/hubdanielcode/Finanzy-App

---

## 🚀 Demonstração

O sistema permite:

- Cadastro e autenticação de usuários  
- Registro de receitas e despesas  
- Cálculo automático do saldo total  
- Atualização dinâmica de transações  
- Persistência de sessão  
- Interface responsiva para desktop e mobile  

---

## 🏗️ Arquitetura e Decisões Técnicas

O projeto foi estruturado seguindo o padrão de organização por **features**, promovendo escalabilidade e separação de responsabilidades:

- `features/authentication`
- `features/transactions`
- `shared`
- `services`
- `context`
- `utils`

### Principais decisões técnicas:

- Separação clara entre lógica, UI e serviços  
- Context API para gerenciamento de estado  
- Camada de services para comunicação com o Supabase  
- Componentização reutilizável  
- Hooks customizados para abstração de lógica  
- Estrutura preparada para crescimento e manutenção futura  

---

## 🔐 Autenticação

Implementada com Supabase utilizando:

- Registro e login com e-mail e senha  
- Autenticação baseada em JWT  
- Persistência automática de sessão  
- Proteção de rotas privadas  
- Isolamento de dados por usuário autenticado  

Cada usuário visualiza exclusivamente suas próprias transações.

---

## ⚙️ Funcionalidades

✔ CRUD completo de transações  
✔ Cálculo automático de saldo  
✔ Paginação de dados  
✔ Filtros dinâmicos  
✔ Feedback visual de ações  
✔ Validação de formulários  
✔ Layout adaptado para mobile (incluindo orientação landscape)  

---

## 🧪 Testes

O projeto conta com uma suite de testes implementada com **Vitest** e **React Testing Library**, cobrindo as principais camadas da aplicação.

Execute os testes com:

```bash
npm run test
```

A cobertura inclui:

- Autenticação — renderização, formulários, proteção de rotas e recuperação de senha.
- Transactions Components — Filter, Modal, TransactionCards, TransactionForm, TransactionList, UniqueTransaction e todos os componentes mobile (padrão e landscape).  
- TransactionContext — estado global, cálculos derivados (totalIncome, totalExpense, availableMoney) e handlers (add, update, delete). 
- Hooks — useIsMobileDevice (detecção via user agent) e useOrientation (detecção e atualização via resize).  
- Model — CategoryIcons, PaginationDropdownOptions e TransactionOptions.  
- TransactionService — createTransaction, getTransactions, updateTransaction e deleteTransaction com mock do Supabase.
- Shared Utils — formatTodayString e calculatePeriod com fake timers.

---

## 🛠️ Tecnologias Utilizadas

- React (Vite)  
- TypeScript  
- CSS3  
- Supabase (Autenticação e Banco de Dados)  
- Vitest + React Testing Library (Testes)  
- Vercel (Deploy e hospedagem)  
- Git & GitHub  

---

## ▶️ Executando Localmente

Clone o repositório:

```bash
git clone https://github.com/hubdanielcode/Finanzy-App.git
cd Finanzy-App
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

Execute a aplicação:

```bash
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```

---

## 🧠 Conceitos Aplicados

- Componentização  
- Organização escalável por features  
- Gerenciamento de estado com Hooks e Context API  
- Autenticação JWT  
- Integração com Backend as a Service (BaaS)  
- Persistência de sessão  
- Testes unitários e de integração com mocks  
- Boas práticas de estruturação de projeto frontend  

---

## 📌 Próximas Melhorias

- Dashboard com gráficos financeiros  
- Filtros avançados por período  
- Melhorias de performance  
- Dark mode  

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
│   │       │   │   ├── mobile-deafault/
│   │       │   │   │    ├── MobileActionBar.tsx
│   │       │   │   │    ├── MobileFilter.tsx
│   │       │   │   │    ├── MobileTransactionForm.tsx
│   │       │   │   │    ├── MobileTransactionList.tsx
│   │       │   │   │    └── MobileUniqueTransaction.tsx
│   │       │   │   └──mobile-landscape/
│   │       │   │       ├──LandscapeTransactionForm.tsx
│   │       │   │       ├──LandscapeTransactionList.tsx
│   │       │   │       └──LandscapeUniqueTransactions.tsx
│   │       │   │
│   │       │   ├── Filter.tsx
│   │       │   ├── Modal.tsx
│   │       │   ├── Pagination.tsx
│   │       │   ├── TransactionCards.tsx
│   │       │   ├── TransactionForm.tsx
│   │       │   ├── TransactionList.tsx
│   │       │   └── UniqueTransaction.tsx
│   │       ├── context/
│   │       │   └── TransactionContext.tsx
│   │       │
│   │       ├──hooks/
│   │       │   ├──useIsMobileDevice.ts
│   │       │   └──useOrientation.ts
│   │       ├── model/
│   │       │   ├── CategoryIcons.tsx
│   │       │   ├── PaginationDropdownOptions.ts
│   │       │   ├── TransactionOptions.ts
│   │       │   └── TransactionTypes.ts
│   │       ├── services/
│   │       │   └── transactionService.ts
│   │       ├── utils/
│   │       │    ├── formatPrivateCurrency.ts
│   │       │    └── formatCurrency.ts
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── Missing.tsx
│   │   │   └── NewUserModal.tsx
│   │   ├── utils/
│   │   │    └── date.ts
│   │   └── index.ts
│   │
│   ├── supabase/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tests/
│   ├── features/
│   │   ├── authentication/
│   │   │   └── components/
│   │   │       ├── Authentication.test.tsx
│   │   │       ├── Login.test.tsx
│   │   │       ├── ProtectedRoute.test.tsx
│   │   │       └── RecoverPassword.test.tsx
│   │   └── transactions/
│   │       ├── components/
│   │       │   ├── mobile/
│   │       │   │   ├── mobile-deafault/
│   │       │   │   │    ├── MobileActionBar.test.tsx
│   │       │   │   │    ├── MobileFilter.test.tsx
│   │       │   │   │    ├── MobileTransactionForm.test.tsx
│   │       │   │   │    ├── MobileTransactionList.test.tsx
│   │       │   │   │    └── MobileUniqueTransaction.test.tsx
│   │       │   │   └──mobile-landscape/
│   │       │   │       ├──LandscapeTransactionForm.test.tsx
│   │       │   │       ├──LandscapeTransactionList.test.tsx
│   │       │   │       └──LandscapeUniqueTransactions.test.tsx
│   │       │   ├── Filter.test.tsx
│   │       │   ├── Modal.test.tsx
│   │       │   ├── TransactionCards.test.tsx
│   │       │   ├── TransactionForm.test.tsx
│   │       │   ├── TransactionList.test.tsx
│   │       │   └── UniqueTransaction.test.tsx
│   │       ├── context/
│   │       │   └── TransactionContext.test.tsx
│   │       ├── hooks/
│   │       │   ├── useIsMobileDevice.test.ts
│   │       │   └── useOrientation.test.ts
│   │       ├── model/
│   │       │   ├── CategoryIcons.test.ts
│   │       │   ├── PaginationDropdownOptions.test.ts
│   │       │   └── TransactionOptions.test.ts
│   │       └── service/
│   │           └── TransactionService.test.ts
│   └── shared/
│       └── utils/
│           └── date.test.ts
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

## 🌍 Deploy

O projeto está publicado na Vercel, garantindo:

- Deploy automático via GitHub
- Build otimizado para produção
- Ambiente seguro com variáveis de ambiente

---

## 📱 Responsividade

A aplicação possui adaptação para:

- Desktop  
- Mobile padrão  
- Mobile em modo landscape  

Com componentes específicos para cada contexto de tela.

## 📌 Observações

Os dados financeiros são vinculados ao usuário autenticado.  
Cada usuário visualiza apenas suas próprias transações.

---

## 📄 Licença

Este projeto é livre para fins de estudo, aprendizado e uso pessoal.

---
