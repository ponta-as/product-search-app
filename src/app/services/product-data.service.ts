import { Injectable } from '@angular/core';
import { Product } from '../models';

export interface ProductSearchCondition {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  private readonly products: Product[] = [
    { id: 1, name: 'Laptop Pro 14"', category: 'PC', price: 148000 },
    { id: 2, name: 'Laptop Air 13"', category: 'PC', price: 118000 },
    { id: 3, name: 'USB-C Hub 7-in-1', category: 'Accessory', price: 7800 },
    { id: 4, name: 'Wireless Mouse', category: 'Accessory', price: 3200 },
    { id: 5, name: '4K Monitor 27"', category: 'Display', price: 39800 },
    { id: 6, name: 'Noise Cancelling Headset', category: 'Accessory', price: 24800 },
    { id: 7, name: 'Tablet 10"', category: 'Tablet', price: 49800 },
  ];

  search(cond: ProductSearchCondition): Product[] {
    return this.products.filter(p => {
      if (cond.name && !p.name.toLowerCase().includes(cond.name.toLowerCase())) {
        return false;
      }
      if (cond.category && p.category !== cond.category) {
        return false;
      }
      if (cond.minPrice != null && p.price < cond.minPrice) {
        return false;
      }
      if (cond.maxPrice != null && p.price > cond.maxPrice) {
        return false;
      }
      return true;
    });
  }
}
