# SmartBudget - Estrutura de Componentes e Serviços

## 📊 Resumo da Organização

Implementei uma arquitetura limpa, modular e reutilizável seguindo **Design System** estabelecido.

---

## 🏗️ Estrutura de Pastas

```
smartbudget-ui/src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.ts              ✅ Autenticação JWT
│   │   ├── theme.service.ts             ✅ Tema claro/escuro
│   │   ├── language.service.ts          ✅ i18n Português/English
│   │   ├── validation.service.ts        ✅ Validação de formulários
│   │   ├── transaction.service.ts       ✅ CRUD Transações (novo)
│   │   ├── category.service.ts          ✅ Categorias com cache (novo)
│   │   ├── dashboard.service.ts         ✅ Resumo financeiro (novo)
│   │   └── index.ts                     ✅ Exports
│   ├── interceptors/
│   │   └── jwt.interceptor.ts           ✅ Injeta Bearer token
│   └── guards/
│       └── auth.guard.ts                ✅ Protege rotas
│
├── shared/
│   └── components/
│       ├── button.component.ts          ✅ Botões (primary, outline, ghost, danger)
│       ├── input.component.ts           ✅ Input (deprecated, use form-input)
│       ├── form-input.component.ts      ✅ Input com icon, validação, password toggle
│       ├── checkbox.component.ts        ✅ Checkbox customizado
│       ├── auth-container.component.ts  ✅ Layout Auth (reusável)
│       └── index.ts                     ✅ Exports
│
└── features/
    ├── auth/
    │   ├── login.component.ts           ✅ REFEITO com FormInputComponent
    │   └── register.component.ts        ✅ REFEITO com FormInputComponent
    ├── dashboard/
    │   └── dashboard.component.ts       ⏳ Aguarda integração DashboardService
    ├── transactions/
    │   ├── list.component.ts            ⏳ Aguarda integração TransactionService
    │   └── form.component.ts            ⏳ Aguarda integração TransactionService
    └── settings/
        └── settings.component.ts        ✅ Theme + Language toggles
```

---

## 🎯 Componentes Compartilhados Criados

### 1. **FormInputComponent** 
📍 `shared/components/form-input.component.ts`

**Recursos:**
- ✅ Label com espaçamento
- ✅ Icon à esquerda (Material Symbols)
- ✅ Password toggle (show/hide)
- ✅ Validação com error message
- ✅ Hint text abaixo do input
- ✅ State focus com box-shadow primária
- ✅ Estado disabled
- ✅ Styling Design System completo

**Uso:**
```html
<app-form-input
  label="Palavra-passe"
  type="password"
  icon="lock"
  [showPasswordToggle]="true"
  placeholder="Digite sua senha"
  [(value)]="password"
  [error]="passwordError"
  (valueChange)="onPasswordChange($event)"
></app-form-input>
```

---

### 2. **CheckboxComponent**
📍 `shared/components/checkbox.component.ts`

**Recursos:**
- ✅ Checkbox customizado com estilo Design System
- ✅ Label integrado com ngContent
- ✅ Suporta links dentro da label
- ✅ Accent color do brand
- ✅ Estados hover e focus

**Uso:**
```html
<app-checkbox id="terms">
  Aceito os
  <a href="#">Termos de Serviço</a> e
  <a href="#">Política de Privacidade</a>
</app-checkbox>
```

---

### 3. **AuthContainerComponent**
📍 `shared/components/auth-container.component.ts`

**Recursos:**
- ✅ Layout grid responsivo (2 cols / 1 col mobile)
- ✅ Left side com branding e gradiente primário
- ✅ Testimonial card com glassmorphism
- ✅ Right side com form responsive
- ✅ Mobile header com logo
- ✅ ng-content para injetar formulário

**Uso:**
```html
<app-auth-container
  formTitle="Criar conta"
  formSubtitle="Comece sua jornada"
  brandTitle="SmartBudget"
  brandDescription="Controle financeiro..."
  testimonialText="Indispensável..."
  testimonialAuthor="Ricardo Silva"
  testimonialRole="CFO @ AngoTech"
  testimonialImage="https://..."
>
  <!-- Formulário aqui -->
</app-auth-container>
```

---

## 🔧 Serviços Criados

### 1. **TransactionService**
📍 `core/services/transaction.service.ts`

**Métodos:**
```typescript
list(params?: {          // GET /transactions?limit=20&offset=0&type=expense
  limit?: number;
  offset?: number;
  type?: 'income' | 'expense';
  category_id?: number;
  start?: string;        // YYYY-MM-DD
  end?: string;          // YYYY-MM-DD
}): Observable<TransactionListResponse>

get(id: number)          // GET /transactions/{id}
create(data)             // POST /transactions
update(id, data)         // PUT /transactions/{id}
delete(id)               // DELETE /transactions/{id}
export(startDate?, endDate?)  // GET /transactions/export (CSV)
```

**Interface:**
```typescript
interface Transaction {
  id?: number;
  user_id?: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;          // YYYY-MM-DD
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

### 2. **CategoryService**
📍 `core/services/category.service.ts`

**Métodos:**
```typescript
getAll()                 // GET /categories com cache
getCached()              // Retorna categorias em cache
getByType(type)          // Filtra por tipo (income/expense)
```

**Recursos:**
- ✅ Auto-carrega categorias no constructor
- ✅ BehaviorSubject para reatividade
- ✅ Fallback para categorias padrão se API falhar
- ✅ Cache local

**Categorias Padrão:**
```
Despesas: Alimentação, Transporte, Internet, Saúde, Lazer, Habitação, Educação, Outros
Receitas: Salário
```

---

### 3. **DashboardService**
📍 `core/services/dashboard.service.ts`

**Métodos:**
```typescript
getSummary()             // GET /dashboard
getCached()              // Retorna último resumo em cache
refresh()                // Recarrega dados
```

**Interface:**
```typescript
interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  expenses_by_category?: { [key: string]: number };
  monthly_income?: number;
  monthly_expenses?: number;
}
```

---

### 4. **ValidationService**
📍 `core/services/validation.service.ts`

**Métodos:**
```typescript
validateEmail(email)              // Validação completa de email
validatePassword(password, len?)   // Min length
validateName(name)                // Min 3 caracteres
validateRequired(value, field)    // Obrigatório
validatePasswordMatch(p1, p2)     // Confirmação
validateAmount(amount)            // Positivo e número
validateDate(date)                // YYYY-MM-DD
```

**Retorna:**
```typescript
string | null  // null se válido, string com mensagem de erro
```

---

## 🎨 Componentes de Features Refatorados

### LoginComponent
- ✅ Usa `AuthContainerComponent` para layout
- ✅ Usa `FormInputComponent` para inputs
- ✅ Validação com `ValidationService`
- ✅ Integrado com `AuthService`
- ✅ Responsive design
- ✅ Error handling visual

### RegisterComponent
- ✅ Usa `AuthContainerComponent` para layout
- ✅ Usa `FormInputComponent` para inputs
- ✅ Usa `CheckboxComponent` para Terms
- ✅ Validação de confirmação de palavra-passe
- ✅ Integrado com `AuthService`
- ✅ Form validation completa

---

## 📱 Padrões de Design Implementados

### 1. **Design System Compliance**
- ✅ Cores: Primary (#059669), Accent (#F59E0B), Danger (#EF4444)
- ✅ Tipografia: Sora (display) + Inter (body)
- ✅ Espaçamento: 4px base scale (xs=4px até 3xl=48px)
- ✅ Border radius: 6px, 10px, 16px, 24px, 999px
- ✅ Dark mode suportado: `[data-theme="dark"]`

### 2. **Reusabilidade**
- ✅ Componentes genéricos (`FormInputComponent`, `CheckboxComponent`)
- ✅ Layout compartilhado (`AuthContainerComponent`)
- ✅ Serviços compartilhados com cache
- ✅ Index files para exports limpos

### 3. **Responsividade**
- ✅ Mobile-first approach
- ✅ Media queries implementadas
- ✅ Grid layout adaptativo
- ✅ Componentes scale-up/scale-down

### 4. **Acessibilidade**
- ✅ Labels com `for` attribute
- ✅ ARIA labels
- ✅ Focus states visíveis
- ✅ Keyboard navigation

---

## 🔗 Integrações Esperadas

### Próximos Passos:
1. **DashboardComponent** → integrar `DashboardService`
2. **TransactionListComponent** → integrar `TransactionService.list()`
3. **TransactionFormComponent** → integrar `TransactionService.create/update`
4. **CategorySelect** → integrar `CategoryService.getByType()`

---

## 🚀 Compilação

```bash
# Build production
npm run build

# Serve desenvolvimento
ng serve

# Output esperado
✔ Application bundle generation complete
✔ Lazy chunk files otimizados
✔ Tamanho reduzido com tree-shaking
```

**Status:** ✅ **Pronto para uso**

---

## 📝 Próximas Features

- [ ] Criar `CurrencyPipe` para formatação de valores
- [ ] Criar `TransactionListComponent` com paginação
- [ ] Criar `CategorySelectComponent` com autocomplete
- [ ] Criar `DateRangePickerComponent` para filtros
- [ ] Integração com todos os endpoints da API
- [ ] Estados de loading/skeleton com animations
- [ ] Modal de confirmação para deletar
- [ ] Toast notifications para feedback

---

**Estrutura criada:** 9 Maio 2026  
**Versão:** SmartBudget UI v1.0 MVP
