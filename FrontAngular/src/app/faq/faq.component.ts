import { Component, OnInit } from '@angular/core';
import { MiServPruebaService } from '../mi-serv-prueba.service.js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  users = [
  ]
  constructor(private service: MiServPruebaService) { }

  ngOnInit(): void {}
  loadUsers() {
    this.service.getUsers().subscribe((response:any) => this.users = response
    );
  }
}
