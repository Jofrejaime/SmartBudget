import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly storageKey = 'sb_language';
  private readonly defaultLanguage: Language = 'pt';

  private languageSubject = new BehaviorSubject<Language>(
    this.loadLanguage()
  );

  public language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {

    // Idiomas suportados
    this.translate.addLangs(['pt', 'en']);

    // Idioma padrão
    this.translate.setDefaultLang(this.defaultLanguage);

    // Inicializa idioma atual
    this.setLanguage(this.languageSubject.value);
  }

  private loadLanguage(): Language {
    const saved = localStorage.getItem(this.storageKey);

    if (saved === 'pt' || saved === 'en') {
      return saved;
    }

    return this.defaultLanguage;
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

    const newLang: Language =
      current === 'pt'
        ? 'en'
        : 'pt';

    this.setLanguage(newLang);
  }

  isPortuguese(): boolean {
    return this.getLanguage() === 'pt';
  }

  isEnglish(): boolean {
    return this.getLanguage() === 'en';
  }
}
