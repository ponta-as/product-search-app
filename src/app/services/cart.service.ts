import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  /** カートに入っている商品のID一覧 */
  private cartIds: number[] = [];

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
  }

  /** カートID一覧をコピーで返す（外部から改変させないため） */
  getCartIds(): number[] {
    return [...this.cartIds];
  }
}
