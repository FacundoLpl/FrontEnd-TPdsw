import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: any[] = [];

  getItems() {
    return this.items;
  }

  addItem(item: any) {
    const existingItem = this.items.find(i => i.code === item.code);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
      console.log('Item añadido al carrito:', item);
    }
  }

  removeItem(code: string) {
    this.items = this.items.filter(item => item.code !== code);
  }

  clearCart() {
    this.items = [];
  }

  get total() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}