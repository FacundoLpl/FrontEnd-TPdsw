import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { 
  HTTP_INTERCEPTORS, 
  provideHttpClient, 
  withFetch, 
  withJsonpSupport,
  withInterceptorsFromDi,
  withInterceptors 
} from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withJsonpSupport(),
      withInterceptors([authInterceptor])
    ),

  ]
};