import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hijo-prueba',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hijo-prueba.component.html',
  styleUrl: './hijo-prueba.component.css'
})
export class HijoPruebaComponent {
  empresaHijo:string
  @Input() empresaPasajeICH:string
  @Output() empresaDevueltaOCH = new EventEmitter<string>()
  enviarEmpresaCH(value:string){this.empresaDevueltaOCH.emit(value)}

}
