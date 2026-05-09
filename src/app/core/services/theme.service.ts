import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  public theme$ = this.themeSubject.asObservable();
  private storageKey = 'sb_theme';

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  private loadTheme(): Theme {
    const saved = localStorage.getItem(this.storageKey) as Theme;
    if (saved) {
      return saved;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.storageKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  toggle(): void {
    const current = this.themeSubject.value;
    const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getTheme(): Theme {
    return this.themeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
