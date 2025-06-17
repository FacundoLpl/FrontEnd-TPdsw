import {
  Injectable,
  ComponentRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
} from "@angular/core"

import { NotificationComponent } from "../components/notification/notification/notification.component"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications: ComponentRef<NotificationComponent>[] = []

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector,
  ) {}

  show(message: string, type: "success" | "error" | "info" = "info", duration = 3000) {
    // Crear el componente
    const componentRef = createComponent(NotificationComponent, {
      environmentInjector: this.injector,
    })

    // Configurar las propiedades
    componentRef.instance.message = message
    componentRef.instance.type = type
    componentRef.instance.duration = duration

    // Añadir al DOM
    document.body.appendChild(componentRef.location.nativeElement)

    // Registrar en la aplicación
    this.appRef.attachView(componentRef.hostView)

    // Guardar referencia
    this.notifications.push(componentRef)

    // Limpiar cuando se destruya
    componentRef.onDestroy(() => {
      this.removeNotification(componentRef)
    })

    // Auto-destruir después de la duración + tiempo de animación
    setTimeout(() => {
      this.removeNotification(componentRef)
    }, duration + 500)

    return componentRef
  }

  private removeNotification(componentRef: ComponentRef<NotificationComponent>) {
    const index = this.notifications.indexOf(componentRef)
    if (index > -1) {
      this.notifications.splice(index, 1)
      this.appRef.detachView(componentRef.hostView)
      componentRef.destroy()
    }
  }

  // Métodos de conveniencia
  success(message: string, duration?: number) {
    return this.show(message, "success", duration)
  }

  error(message: string, duration?: number) {
    return this.show(message, "error", duration)
  }

  info(message: string, duration?: number) {
    return this.show(message, "info", duration)
  }
}
