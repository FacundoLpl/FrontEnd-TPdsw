import { Component } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-lista-reservas',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './lista-reservas.component.html',
  styleUrls: ['./lista-reservas.component.css']
})


export class ListaReservasComponent {
  reservas: any[] = [];

    constructor(private ReservationService: ReservationService) {}

ngOnInit() {    this.ReservationService.findAll({state: 'Pending'})

}}
