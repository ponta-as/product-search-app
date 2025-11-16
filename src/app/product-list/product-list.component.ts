import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  /** 表示する商品一覧 */
  @Input() products: Product[] = [];

  /** カートに入っているかどうかを判定する関数（親から受け取る） */
  @Input() isInCart: (id: number) => boolean = () => false;

  /** カートのトグルを親へ通知するイベント */
  @Output() toggleCart = new EventEmitter<number>();

  /** ボタンクリック時にカートトグルイベントを発火 */
  onToggleCart(id: number): void {
    this.toggleCart.emit(id);
  }
}
