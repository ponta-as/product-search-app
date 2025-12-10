import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductDataService } from '../services/product-data.service';

export interface ProductSearchFormValue {
  name?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

@Component({
  selector: 'app-product-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // productData を public にしてテンプレートから直接参照（async パイプ）できるようにする
  constructor(public productData: ProductDataService) {}

  /** フォーム送信時に親へ検索条件を渡す */
  onSearch(): void {
    this.search.emit(this.form);
  }

  /** クリア（入力値を初期化） */
  clear(): void {
    this.form = {
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
    };
  }

  /** 全て未入力かどうか */
  get isAllEmpty(): boolean {
    const nameEmpty = !(this.form.name && this.form.name.toString().trim().length > 0);
    const categoryEmpty = !this.form.category;
    const minEmpty = this.form.minPrice == null;
    const maxEmpty = this.form.maxPrice == null;
    return nameEmpty && categoryEmpty && minEmpty && maxEmpty;
  }

  /** 価格の上下が逆かどうか（Min > Max） */
  get priceInvalid(): boolean {
    return (this.form.minPrice != null && this.form.maxPrice != null) && (this.form.minPrice > this.form.maxPrice);
  }
}