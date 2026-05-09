import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('smartbudget-ui');

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    // Initialize translation
    this.translate.setDefaultLang('pt');
    const savedLang = this.languageService.getLanguage();
    this.translate.use(savedLang);
  }
}

