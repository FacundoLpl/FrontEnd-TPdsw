import { bootstrapApplication } from "@angular/platform-browser"
import { appConfig } from "./app/app.config"
import { AppComponent } from "./app/app.component"
import { provideAnimations } from "@angular/platform-browser/animations"

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(), // Add this to fix animation errors
  ],
}).catch((err) => console.error(err))
