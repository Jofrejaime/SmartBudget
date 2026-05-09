import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<Language>(this.loadLanguage());
  public language$ = this.languageSubject.asObservable();
  private storageKey = 'sb_language';

  constructor(private translate: TranslateService) {
    this.setLanguage(this.languageSubject.value);
    this.translate.setDefaultLang('pt');
  }

  private loadLanguage(): Language {
    const saved = localStorage.getItem(this.storageKey) as Language;
    if (saved && ['pt', 'en'].includes(saved)) {
      return saved;
    }
    return 'pt';
  }

  setLanguage(lang: Language): void {
    localStorage.setItem(this.storageKey, lang);
    this.translate.use(lang);
    this.languageSubject.next(lang);
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }

  toggleLanguage(): void {
    const current = this.languageSubject.value;
    const newLang: Language = current === 'pt' ? 'en' : 'pt';
    this.setLanguage(newLang);
  }
}
