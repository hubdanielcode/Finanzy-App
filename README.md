# 💰 Finanzy

Aplicação web de **gestão financeira pessoal** desenvolvida com React e TypeScript, permitindo controle de receitas e despesas com autenticação segura, atualização em tempo real e interface totalmente responsiva.

O projeto foi desenvolvido com foco em boas práticas de arquitetura frontend, organização escalável por features e integração com backend via BaaS.

🔗 Deploy: https://finanzy-app.vercel.app/  
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
- Dashboard com gráficos financeiros interativos
- Filtros de período e ano nos gráficos

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
✔ Dashboard com gráficos de Entradas e Saídas por mês  
✔ Gráfico de Saldo mensal  
✔ Gráficos de categorias de Entrada e Saída  
✔ Filtro de ano nos gráficos mensais  
✔ Filtro de período nos gráficos de categorias  
✔ Página dedicada de gráficos (`/charts`)  
✔ Testes automatizados com Vitest e React Testing Library  
✔ Conexão direta com bancos reais

---

## 📊 Gráficos e Visualizações

O dashboard conta com uma seção de gráficos acessível tanto no desktop quanto em mobile:

- **Entradas e Saídas por Mês** — gráfico de barras com filtro por ano, gerado dinamicamente a partir das transações do usuário
- **Saldo por Mês** — gráfico de linha mostrando a evolução do saldo ao longo do tempo
- **Categorias de Saída** — gráfico de pizza com distribuição das despesas por categoria, com filtro por período
- **Categorias de Entrada** — gráfico de pizza com distribuição das receitas por categoria, com filtro por período

Os dados são calculados via hooks customizados (`useYearlyChartData`, `useBalanceChartData`, `useCategoryChartData`) e atualizados em tempo real conforme as transações do usuário.

---

## 🧪 Testes

O projeto conta com uma suíte de testes automatizados cobrindo os principais componentes, hooks e utilitários:

- **Componentes** — `ChartsSection`, `ChartFilter`, `CategoryPieChart`
- **Hooks** — `useYearlyChartData`, `useBalanceChartData`
- **Utilitários** — `formatTodayString`, `calculatePeriod`
- **Opções e constantes** — `TransactionOptions`

Os testes utilizam `renderHook` para hooks, mocks do `recharts` e `vi.useFakeTimers()` para testes de data.

---

## 🛠️ Tecnologias Utilizadas

- React (Vite)
- TypeScript
- Tailwind CSS
- Recharts
- Supabase (Autenticação e Banco de Dados)
- Vitest + React Testing Library
- Vercel (Deploy e hospedagem)
- Git & GitHub

---

## ▶️ Executando Localmente

Clone o repositório:

```
git clone https://github.com/hubdanielcode/Finanzy-App.git
cd Finanzy-App
```

Instale as dependências:

```
npm install
```

Crie um arquivo `.env` com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

Execute a aplicação:

```
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```

Execute os testes:

```
npm run test
```

---

## 🧠 Conceitos Aplicados

- Componentização
- Organização escalável por features
- Gerenciamento de estado com Hooks e Context API
- Autenticação JWT
- Integração com Backend as a Service (BaaS)
- Persistência de sessão
- Visualização de dados com gráficos interativos
- Testes automatizados de componentes, hooks e utilitários
- Boas práticas de estruturação de projeto frontend

---

## 📂 Estrutura do Projeto

```
Dashboard de Gestão Financeira/
├── .git/
├── node_modules/
├── public/
│   └── FinanzyLogo.png
│
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── mascote.png
│   │
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── components/
│   │   │   │   ├── Authentication.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── RecoverPassword.tsx
│   │   │   │
│   │   │   ├── context/
│   │   │   │   └── AuthenticationContext.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useAuthenticationContext.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── transactions/
│   │       ├── components/
│   │       │   ├── charts/
│   │       │   │   ├── BalanceLineChart.tsx
│   │       │   │   ├── CategoryPieChart.tsx
│   │       │   │   ├── ChartFilter.tsx
│   │       │   │   ├── ChartsSection.tsx
│   │       │   │   └── MonthlyBarChart.tsx
│   │       │   │
│   │       │   ├── mobile/
│   │       │   │   ├── mobile-deafault/
│   │       │   │   │    ├── MobileActionBar.tsx
│   │       │   │   │    ├── MobileFilter.tsx
│   │       │   │   │    └── MobileTransactionList.tsx
│   │       │   │   │
│   │       │   │   └──mobile-landscape/
│   │       │   │       └──LandscapeUniqueTransactions.tsx
│   │       │   │
│   │       │   ├── Filter.tsx
│   │       │   ├── Modal.tsx
│   │       │   ├── PluggyConnect.tsx
│   │       │   ├── TransactionCards.tsx
│   │       │   ├── TransactionForm.tsx
│   │       │   ├── TransactionList.tsx
│   │       │   └── UniqueTransaction.tsx
│   │       │
│   │       ├── context/
│   │       │   └── MobileContext.tsx
│   │       │   └── TransactionContext.tsx
│   │       │
│   │       ├── hooks/
│   │       │   ├── useBalanceChartData.ts
│   │       │   ├── useCategoryChartData.ts
│   │       │   ├── useClickOutside.ts
│   │       │   ├── useMobileContext.ts
│   │       │   ├── useTransactionContext.ts
│   │       │   └── useYearlyChartData.ts
│   │       │
│   │       ├── model/
│   │       │   ├── categoryIcons.ts
│   │       │   ├── transactionOptions.ts
│   │       │   ├── transactionTypes.ts
│   │       │   └── variants.ts
│   │       │
│   │       ├── services/
│   │       │   ├── pluggyService.ts
│   │       │   └── transactionService.ts
│   │       │
│   │       ├── utils/
│   │       │    ├── formatCurrency.ts
│   │       │    ├── formatPrivateCurrency.ts
│   │       │    ├── monthlyOptions.ts
│   │       │    └── paginationDropdownOptions.ts
│   │       │
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── NewUserModal.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── context/
│   │   │    └── ThemeContex.tsx
│   │   │
│   │   ├── hooks/
│   │   │    └── useThemeContex.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── Missing.tsx
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   └── TermsOfUse.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── masks.ts
│   │   │   ├── regex.ts
│   │   │   └── theme.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
│── supabase/
│   ├── .temp/
│   │    └── cli-latest
│   │
│   ├── functions/
│   │   ├── pluggy-auth/
│   │   │    └── index.ts
│   │   │
│   │   ├── shared/
│   │   │     └── cors.ts
│   │   │
│   │   └── deno.jsonc
│   │
│   └── supabase.ts
│
├── tests/
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── components/
│   │   │   │   ├── Authentication.test.tsx
│   │   │   │   ├── Login.test.tsx
│   │   │   │   ├── ProtectedRoute.test.tsx
│   │   │   │   └── RecoverPassword.test.tsx
│   │   │   │
│   │   │   ├── context/
│   │   │   │   └── AuthenticationContext.test.tsx
│   │   │   │
│   │   │   └── hooks/
│   │   │       └── useAuthenticationContext.test.ts
│   │   │
│   │   └── transactions/
│   │       ├── components/
│   │       │   ├── charts/
│   │       │   │   ├── BalanceLineChart.test.tsx
│   │       │   │   ├── CategoryPieChart.test.tsx
│   │       │   │   ├── ChartFilter.test.tsx
│   │       │   │   ├── ChartsSection.test.tsx
│   │       │   │   └── MonthlyBarChart.test.tsx
│   │       │   │
│   │       │   ├── mobile/
│   │       │   │   ├── mobile-deafault/
│   │       │   │   │    ├── MobileActionBar.test.tsx
│   │       │   │   │    ├── MobileFilter.test.tsx
│   │       │   │   │    └── MobileTransactionList.test.tsx
│   │       │   │   │
│   │       │   │   └──mobile-landscape/
│   │       │   │       └──LandscapeUniqueTransactions.test.tsx
│   │       │   │
│   │       │   ├── Filter.test.tsx
│   │       │   ├── Modal.test.tsx
│   │       │   ├── PluggyConnect.test.tsx
│   │       │   ├── TransactionCards.test.tsx
│   │       │   ├── TransactionForm.test.tsx
│   │       │   ├── TransactionList.test.tsx
│   │       │   └── UniqueTransaction.test.tsx
│   │       │
│   │       ├── context/
│   │       │   └── MobileContext.test.tsx
│   │       │   └── TransactionContext.test.tsx
│   │       │
│   │       ├── hooks/
│   │       │   ├── useBalanceChartData.test.ts
│   │       │   ├── useCategoryChartData.test.ts
│   │       │   ├── useClickOutside.test.ts
│   │       │   ├── useMobileContext.test.ts
│   │       │   ├── useTransactionContext.test.ts
│   │       │   └── useYearlyChartData.test.ts
│   │       │
│   │       ├── model/
│   │       │   ├── categoryIcons.test.ts
│   │       │   └── transactionOptions.test.ts
│   │       │
│   │       ├── services/
│   │       │   ├── pluggyService.test.ts
│   │       │   └── transactionService.test.ts
│   │       │
│   │       └── utils/
│   │          ├── formatCurrency.test.ts
│   │          ├── formatPrivateCurrency.test.ts
│   │          └── paginationDropdownOptions.test.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Footer.test.tsx
│   │   │   ├── Header.test.tsx
│   │   │   ├── MainContent.test.tsx
│   │   │   ├── NewUserModal.test.tsx
│   │   │   └── Pagination.test.tsx
│   │   │
│   │   ├── context/
│   │   │    └── ThemeContex.test.tsx
│   │   │
│   │   ├── hooks/
│   │   │    └── useThemeContex.test.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── Missing.test.tsx
│   │   │   ├── PrivacyPolicy.test.tsx
│   │   │   └── TermsOfUse.test.tsx
│   │   │
│   │   └── utils/
│   │       ├── date.test.ts
│   │       ├── masks.test.ts
│   │       ├── regex.test.ts
│   │       └── theme.test.ts
│   │
│   └── setup.ts
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
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
