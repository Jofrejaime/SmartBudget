import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  HttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';

import {
  TranslateLoader,
  provideTranslateService
} from '@ngx-translate/core';

import { Observable } from 'rxjs';

import { routes } from './app.routes';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import { jwtInterceptorFn } from './core/interceptors/jwt.interceptor';

class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(
      `./assets/i18n/${lang}.json`
    );
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptorFn])
    ),

    provideClientHydration(
      withEventReplay()
    ),

    provideTranslateService({
      lang: 'pt',

      fallbackLang: 'pt',

      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new CustomTranslateLoader(http),
        deps: [HttpClient]
      }
    })
  ]
};
