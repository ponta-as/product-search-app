import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartIds: number[] = [];

  isInCart(id: number): boolean {
    return this.cartIds.includes(id);
  }

  toggle(id: number): void {
    if (this.isInCart(id)) {
      this.cartIds = this.cartIds.filter(x => x !== id);
    } else {
      this.cartIds.push(id);
    }
  }

  getCartIds(): number[] {
    return [...this.cartIds];
  }
}
