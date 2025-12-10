import { Injectable } from '@angular/core';

const STORAGE_KEY = 'product_search_app_cart_ids_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** カートに入っている商品のID一覧 */
  private cartIds: number[] = [];

  constructor() {
    this.loadFromStorage();
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

  /** カートを空にする（必要なら） */
  clear(): void {
    this.cartIds = [];
    this.saveToStorage();
  }

  /** localStorage に保存 */
  private saveToStorage(): void {
    try {
      const data = JSON.stringify(this.cartIds);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }

  /** localStorage から復元 */
  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // 数値配列のみを復元（文字列や不正な要素はフィルタ）
        this.cartIds = parsed
          .map(x => Number(x))
          .filter(x => Number.isInteger(x));
      }
    } catch (e) {
      console.warn('Failed to restore cart from localStorage', e);
      this.cartIds = [];
    }
  }
}