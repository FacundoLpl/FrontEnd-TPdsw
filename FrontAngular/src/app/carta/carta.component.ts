import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component.js';
import { FooterComponent } from '../components/footer/footer/footer.component.js';
import { MenuItemComponent } from '../components/menu-item/menu-item.component.js';
import { MenuItemModalComponent } from '../components/menu-item-modal/menu-item-modal.component.js';
import { NgFor, NgIf } from '@angular/common';
import { ProductServiceService } from '../services/product-service.service.js';


@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, MenuItemComponent, MenuItemModalComponent, NgIf, NgFor],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css'
})


export class CartaComponent {

  constructor(private productService: ProductServiceService) {}
  isModalOpen: boolean = false
  selectedItemTitle: string = '';
  selectedImageUrl: string = '';
  selectedProductId: string = '';
  selectedPrice: number;
  orderData: { itemTitle: string, price: number, quantity: number, comment: string };  // Aquí se almacenarán los datos del pedido
  products: any[] = [];

  openModal(itemTitle: string, imageUrl: string, productId: string, price:number) {
    this.selectedItemTitle = itemTitle;
    this.selectedImageUrl = imageUrl;
    this.selectedProductId = productId;
    this.selectedPrice = price;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleOrderAdded(order: { itemTitle: string, price: number, quantity: number, comment: string }) {
    this.orderData = order;  // Guarda los datos del pedido
  }

  ngOnInit() {
    this.productService.findAll().subscribe({
      next: (res: any) => {
        this.products = res.data; // Asigna todos los products
        }
      })
    }

// Método para agrupar los productos en conjuntos de 3
 groupProductsByThree(categoryName: string) {
  const categoryProducts = this.products.filter(product => product.category.name === categoryName);
  const groupedProducts = [];
  for (let i = 0; i < categoryProducts.length; i += 3) {
    groupedProducts.push(categoryProducts.slice(i, i + 3));}
  return groupedProducts;
}

getProductsByCategory(categoryName: string) {
  return this.products.filter(product => product.category.name === categoryName);
}
}