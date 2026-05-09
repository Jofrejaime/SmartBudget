import { Injectable } from '@angular/core';

export interface ValidationError {
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validateEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email é obrigatório';
    if (!emailRegex.test(email)) return 'Email inválido';
    return null;
  }

  validatePassword(password: string, minLength: number = 6): string | null {
    if (!password) return 'Palavra-passe é obrigatória';
    if (password.length < minLength) return `Mínimo ${minLength} caracteres`;
    return null;
  }

  validateName(name: string): string | null {
    if (!name || name.trim().length === 0) return 'Nome é obrigatório';
    if (name.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
    return null;
  }

  validateRequired(value: any, fieldName: string): string | null {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      return `${fieldName} é obrigatório`;
    }
    return null;
  }

  validatePasswordMatch(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
      return 'As palavras-passe não correspondem';
    }
    return null;
  }

  validateAmount(amount: any): string | null {
    const num = parseFloat(amount);
    if (!amount || isNaN(num)) return 'Valor é obrigatório';
    if (num <= 0) return 'Valor deve ser maior que zero';
    return null;
  }

  validateDate(date: string): string | null {
    if (!date) return 'Data é obrigatória';
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return 'Data deve estar em formato YYYY-MM-DD';
    return null;
  }
}
