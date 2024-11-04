import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { UserFormComponent } from '../components/user-form/user-form.component.js';
import { MenuItemComponent } from '../components/menu-item/menu-item.component.js';
import { MenuItemModalComponent } from '../components/menu-item-modal/menu-item-modal.component.js';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [NavbarComponent, FooterComponent,UserFormComponent, MenuItemComponent, MenuItemModalComponent, NgIf],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css'
})
export class CartaComponent {
  isModalOpen: boolean = false
  selectedItemTitle: string = '';
  selectedImageUrl: string = '';

  openModal(itemTitle: string, imageUrl: string) {
    this.selectedItemTitle = itemTitle;
    this.selectedImageUrl = imageUrl;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleOrderAdded(order: { quantity: number, comment: string }) {
    console.log('Order added:', order);
    // Aquí puedes agregar lógica para manejar el pedido, como enviarlo a un servicio
  }
}
