import { Component, Input, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { trigger, state, style, animate, transition } from "@angular/animations"

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.css",
  animations: [
    trigger("notificationAnimation", [
      state(
        "void",
        style({
          transform: "translateY(-20px)",
          opacity: 0,
        }),
      ),
      state(
        "visible",
        style({
          transform: "translateY(0)",
          opacity: 1,
        }),
      ),
      transition("void => visible", animate("300ms ease-out")),
      transition("visible => void", animate("200ms ease-in")),
    ]),
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() message = ""
  @Input() type: "success" | "error" | "info" = "info"
  @Input() duration = 3000 // Duración en milisegundos

  visible = false
  private timeout: any

  ngOnInit() {
    this.show()
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  show() {
    this.visible = true
    this.timeout = setTimeout(() => {
      this.visible = false
    }, this.duration)
  }

  close() {
    this.visible = false
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  getIcon() {
    switch (this.type) {
      case "success":
        return "fas fa-check-circle"
      case "error":
        return "fas fa-exclamation-circle"
      default:
        return "fas fa-info-circle"
    }
  }
}
