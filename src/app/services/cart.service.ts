import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** カートに入っている商品のID一覧 */
  private cartIds: number[] = [];
  private readonly storageKey = 'product_search_app_cart_ids';

  constructor() {
    this.restoreFromStorage();
  }

  /** 指定IDがカートに存在するか判定 */
  isInCart(id: number): boolean {
    return this.cartIds.includes(id);
  }

  /** カートへの追加・削除を切り替える */
  toggle(id: number): void {
    if (this.isInCart(id)) {
      this.cartIds = this.cartIds.filter(x => x !== id);
    } else {
      this.cartIds.push(id);
    }
    this.saveToStorage();
  }

  /** カートID一覧をコピーで返す（外部から改変させないため） */
  getCartIds(): number[] {
    return [...this.cartIds];
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartIds));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // ensure numbers
        this.cartIds = parsed.map(x => Number(x)).filter(x => !Number.isNaN(x));
      }
    } catch (e) {
      console.warn('Failed to restore cart from localStorage', e);
    }
  }
}
