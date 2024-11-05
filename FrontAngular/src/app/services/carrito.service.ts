import { Injectable } from '@angular/core';

interface Item {
  code: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: Item[] = [];

  getItems() {
    return this.items;
  }

  addItem(item: Item) {
    const existingItem = this.items.find(i => i.code === item.code);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
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
