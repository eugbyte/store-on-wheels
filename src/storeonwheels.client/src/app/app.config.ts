import { ApplicationConfig, isDevMode } from "@angular/core";
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from "@angular/router";
import { routes } from "./app.routes";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideServiceWorker } from "@angular/service-worker";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
};
