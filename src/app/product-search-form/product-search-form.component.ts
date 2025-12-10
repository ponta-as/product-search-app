import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProductSearchFormValue {
  name?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

@Component({
  selector: 'app-product-search-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-search-form.component.html',
  styleUrls: ['./product-search-form.component.scss'],
})
export class ProductSearchFormComponent {
  /** 検索結果を親コンポーネントへ通知 */
  @Output() search = new EventEmitter<ProductSearchFormValue>();

  /** フォーム入力値 */
  form: ProductSearchFormValue = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  /** カテゴリ選択肢 */
  readonly categories: string[] = ['PC', 'Accessory', 'Display', 'Tablet'];

  /** フォーム送信時に親へ検索条件を渡す */
  onSearch(): void {
    this.search.emit(this.form);
  }
  
  /** フォームをクリアする */
  goClear(): void {
    this.form.name = '',
    this.form.category = '',
    this.form.minPrice = null,
    this.form.maxPrice = null
  }

  compare(): boolean {
    if(!!this.form.minPrice && !!this.form.maxPrice){
      if(this.form.minPrice >= this.form.maxPrice){
        return true
      }
    }
    return false
  }
}
