# SmartBudget - Guia de Estilo e Convenções

## 📐 Objetivo

Este documento estabelece padrões e convenções para manter a qualidade, consistência e escalabilidade do projeto SmartBudget. O objetivo é que todos na equipe sigam o mesmo padrão de código, organização e design.

---

## 🏗️ Arquitetura da Aplicação

### Estrutura de Pastas

```
src/app/
├── core/              # Serviços, guards, interceptors (singleton)
├── shared/            # Componentes e pipes reutilizáveis
├── features/          # Módulos de features (lazy loaded)
└── app.config.ts      # Configuração global
```

**Regra:** Cada pasta é responsável por uma coisa. Não misture concerns.

---

## 🎨 Componentes

### Nomenclatura

```typescript
// ✅ BOM
export class LoginComponent { }
export class FormInputComponent { }
export class AuthContainerComponent { }

// ❌ ERRADO
export class Login { }
export class FormInput { }
export class Auth { }
```

**Regra:** Sempre use `Component` suffix para componentes standalone.

### Estrutura de Componente

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],  // ← sempre CommonModule para directives
  template: `...`,
  styles: [`...`]
})
export class MyComponent {
  // 1. @Input properties
  @Input() title: string = '';
  @Input() disabled: boolean = false;

  // 2. @Output events
  @Output() onClick = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<string>();

  // 3. Propriedades internas
  private internalValue = '';

  // 4. Constructor com injeção de dependências
  constructor(private service: MyService) {}

  // 5. Métodos públicos
  public doSomething(): void {}

  // 6. Métodos privados
  private helper(): void {}
}
```

**Regra:** Organize membros na ordem: @Input → @Output → properties → constructor → methods.

### Props Padrão para Componentes UI

```typescript
// Todos os componentes UI têm estas props:

// Tamanho
@Input() size: 'sm' | 'md' | 'lg' = 'md';

// Estilo/Variante
@Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';

// Estados
@Input() disabled: boolean = false;
@Input() loading: boolean = false;

// Acessibilidade
@Input() ariaLabel: string = '';

// Exemplo: ButtonComponent
<app-button
  size="lg"
  variant="primary"
  [disabled]="isSubmitting"
  ariaLabel="Submit form"
>
  Submit
</app-button>
```

### Formulários

**Regra:** Use `@Input() [(value)]` com `@Output() (valueChange)` para two-way binding.

```typescript
// ✅ BOM - Reusável e controlável
<app-form-input
  label="Email"
  [(value)]="email"
  [error]="emailError"
  (valueChange)="onEmailChange($event)"
></app-form-input>

// ❌ ERRADO - Acoplado e difícil de testar
<input [ngModel]="email" (ngModelChange)="email = $event" />
```

---

## 🔧 Serviços

### Nomenclatura

```typescript
// ✅ BOM
export class AuthService { }
export class TransactionService { }
export class CategoryService { }

// ❌ ERRADO
export class Auth { }
export class Transactions { }
export class GetCategories { }
```

**Regra:** Sempre use `Service` suffix.

### Estrutura de Serviço

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface MyData {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'  // ← sempre use root, não precisa registrar em app.config
})
export class MyService {
  // 1. Private properties
  private apiUrl = 'http://localhost/api/endpoint';
  private dataSubject = new BehaviorSubject<MyData[]>([]);
  
  // 2. Public observables (read-only)
  public data$ = this.dataSubject.asObservable();

  // 3. Constructor
  constructor(private http: HttpClient) {}

  // 4. Public methods
  public getAll(): Observable<MyData[]> {
    return this.http.get<MyData[]>(this.apiUrl);
  }

  // 5. Private helper methods
  private parseResponse(response: any): MyData[] {
    return response.data || [];
  }
}
```

**Regra:** Serviços com estado usam `BehaviorSubject` para cache/estado local.

### API Calls Pattern

```typescript
// ✅ BOM - com error handling
this.service.list().subscribe({
  next: (data) => {
    this.items = data;
  },
  error: (err) => {
    this.error = 'Falha ao carregar dados';
    console.error(err);
  }
});

// ❌ ERRADO - sem error handling
this.service.list().subscribe((data) => {
  this.items = data;
});
```

---

## 🎯 Design System

### CSS Variables (styles.scss)

Sempre use variáveis CSS. **Nunca** hardcode cores, espaçamentos, ou tamanhos.

```scss
// ✅ BOM
.button {
  background-color: var(--sb-primary);
  padding: var(--sb-spacing-md);
  border-radius: var(--sb-radius-md);
  font-family: var(--sb-font-display);
}

// ❌ ERRADO
.button {
  background-color: #059669;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Sora';
}
```

### Cores

```scss
// Primárias (verde)
--sb-primary: #059669;        // Main brand color
--sb-primary-mid: #10B981;    // Lighter version
--sb-primary-light: #D1FAE5;  // Very light (backgrounds)
--sb-primary-dark: #065F46;   // Darker version

// Secundárias
--sb-accent: #F59E0B;         // Orange accent
--sb-danger: #EF4444;         // Red for errors
--sb-success: #10B981;        // Green for success
--sb-warning: #F59E0B;        // Orange for warnings

// Neutros
--sb-text1: #111827;          // Primary text
--sb-text2: #6B7280;          // Secondary text
--sb-text3: #9CA3AF;          // Tertiary text
--sb-border: #E5E7EB;         // Borders
--sb-bg: #F9FAFB;             // Background
--sb-surface: #FFFFFF;        // Surface (cards, inputs)
```

### Espaçamento (4px base)

```scss
--sb-spacing-xs: 4px;    // Muito pequeno
--sb-spacing-sm: 8px;    // Pequeno
--sb-spacing-md: 12px;   // Médio (padrão)
--sb-spacing-lg: 16px;   // Grande
--sb-spacing-xl: 24px;   // Muito grande
--sb-spacing-2xl: 32px;  // Extra grande
--sb-spacing-3xl: 48px;  // Enorme

// Uso em componentes
.card {
  padding: var(--sb-spacing-lg);
  gap: var(--sb-spacing-md);
}
```

### Border Radius

```scss
--sb-radius-sm: 6px;     // Para inputs pequenos
--sb-radius-md: 10px;    // Default
--sb-radius-lg: 16px;    // Para cards
--sb-radius-xl: 24px;    // Para modals
--sb-radius-pill: 999px; // Badges, pills
```

### Tipografia

```scss
// Display (headings) - Sora
--sb-font-display: 'Sora', sans-serif;

// Body (texto) - Inter
--sb-font-body: 'Inter', sans-serif;

// Tamanhos
// h1: 32px / 40px (Sora Bold)
// h2: 24px / 32px (Sora SemiBold)
// h3: 18px / 24px (Sora SemiBold)
// body: 14px / 20px (Inter Regular)
// small: 12px / 16px (Inter Regular)
// label: 12px / 16px (Inter SemiBold)
```

---

## 📝 Nomenclatura

### Arquivos

```
✅ BOM
- login.component.ts
- auth.service.ts
- form-input.component.ts
- validation.service.ts

❌ ERRADO
- Login.component.ts
- authService.ts
- formInput.ts
- validate.ts
```

**Regra:** 
- Lowercase com hífens
- `noun.type.ts` (ex: `login.component.ts`, `auth.service.ts`)

### Classes

```typescript
// ✅ BOM
export class LoginComponent { }
export class AuthService { }
export class ValidationService { }
export class DashboardSummary { }

// ❌ ERRADO
export class login_component { }
export class AuthenticationService { }
export class validateForm { }
export class dashboard_summary_dto { }
```

**Regra:** PascalCase sempre.

### Variáveis e Métodos

```typescript
// ✅ BOM
const userEmail: string = '';
const isLoading: boolean = false;
function validateEmail(email: string): boolean { }
public loadUsers(): Observable<User[]> { }

// ❌ ERRADO
const user_email: string = '';
const isload: boolean = false;
function ValidateEmail(email): boolean { }
public LOAD_USERS(): Observable<User[]> { }
```

**Regra:** camelCase sempre.

### CSS Classes

```scss
// ✅ BOM
.auth-form { }
.form-input__label { }
.button--primary { }
.card--active { }

// ❌ ERRADO
.AuthForm { }
.formInputLabel { }
.buttonPrimary { }
.cardActive { }
```

**Regra:** lowercase com hífens. BEM naming: `.block__element--modifier`

---

## 🎭 Padrões de Código

### Imports

```typescript
// ✅ BOM - Agrupados e ordenados
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyService } from '../../core/services/my.service';
import { ButtonComponent } from '../../shared/components/button.component';

// ❌ ERRADO
import { ButtonComponent } from '../../shared/components/button.component';
import { Component } from '@angular/core';
import { MyService } from '../../core/services/my.service';
import { CommonModule } from '@angular/common';
```

**Ordem:**
1. Angular core imports
2. RxJS imports
3. Terceiros
4. Serviços (core)
5. Componentes (shared, features)

### Type Definitions

```typescript
// ✅ BOM - Exporta interfaces públicas
export interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ ERRADO - Interface anônima inline
users: Array<{ id: number; name: string; email: string }>;
```

**Regra:** Sempre crie interfaces exportáveis para tipos complexos.

### Error Handling

```typescript
// ✅ BOM
this.service.getUser(id).subscribe({
  next: (user) => {
    this.user = user;
  },
  error: (err) => {
    this.error = 'Falha ao carregar usuário';
    console.error('User load error:', err);
  },
  complete: () => {
    console.log('User load complete');
  }
});

// ❌ ERRADO
this.service.getUser(id).subscribe(
  (user) => this.user = user,
  (err) => alert('Error!'),
  () => console.log('Done')
);
```

---

## 🧪 Testes (Futuro)

Quando implementar testes, siga este padrão:

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email', () => {
    component.email = 'invalid-email';
    expect(component.validateEmail()).toBeFalsy();
  });
});
```

---

## 📋 Checklist para Novo Componente

- [ ] Nome em PascalCase com `Component` suffix
- [ ] Arquivo em lowercase com hífens (ex: `my-component.component.ts`)
- [ ] `standalone: true` com imports necessários
- [ ] Exports em `shared/components/index.ts`
- [ ] Template com classes CSS em BEM
- [ ] Estilos com variáveis CSS (sem hardcodes)
- [ ] `@Input` e `@Output` bem definidos
- [ ] Responsividade implementada (mobile-first)
- [ ] Acessibilidade considerada (labels, aria)
- [ ] Documentação em JSDoc

---

## 📋 Checklist para Novo Serviço

- [ ] Nome em PascalCase com `Service` suffix
- [ ] `@Injectable({ providedIn: 'root' })`
- [ ] Interfaces exportadas no topo
- [ ] API calls com error handling
- [ ] BehaviorSubject para estado (se necessário)
- [ ] Métodos públicos bem documentados
- [ ] Exports em `core/services/index.ts`
- [ ] Tipo de retorno explícito (Observable, Promise, etc)

---

## 🚀 Exemplo Completo: Criar Novo Componente

### 1. Criar Arquivo

```typescript
// src/app/shared/components/badge.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge--' + variant">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: var(--sb-spacing-xs) var(--sb-spacing-sm);
      border-radius: var(--sb-radius-pill);
      font-family: var(--sb-font-body);
      font-size: 12px;
      font-weight: 600;
    }

    .badge--primary {
      background-color: var(--sb-primary-light);
      color: var(--sb-primary-dark);
    }

    .badge--danger {
      background-color: var(--sb-danger);
      color: white;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: 'primary' | 'danger' = 'primary';
}
```

### 2. Exportar no Index

```typescript
// src/app/shared/components/index.ts
export { BadgeComponent } from './badge.component';
```

### 3. Usar em Outro Componente

```typescript
import { BadgeComponent } from '../../shared/components';

@Component({
  imports: [BadgeComponent]
})
export class MyComponent { }
```

---

## ✅ Revisão Final

Antes de fazer commit, verifique:

- [ ] ✅ Código compila sem warnings
- [ ] ✅ Segue as convenções deste guia
- [ ] ✅ Usa variáveis CSS (não hardcodes)
- [ ] ✅ Componentes reutilizáveis
- [ ] ✅ Sem console.log ou debugger
- [ ] ✅ Tipos explícitos (sem `any`)
- [ ] ✅ Error handling implementado
- [ ] ✅ Responsivo e acessível

---

**Última atualização:** 9 Maio 2026  
**Versão:** 1.0
