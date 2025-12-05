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
  imports: [CommonModule,FormsModule],
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
  allCategories:string[] = [];
  constructor(private productService: ProductDataService){}
  ngOnInit(): void {
    this.productService.getCategories$().subscribe(categories => {
      this.allCategories = categories;
    });
  }

  /** フォーム送信時に親へ検索条件を渡す */
  onSearch(): void {
    this.search.emit(this.form);
  }
  /** フォームをクリアする */
  onClear(): void {
    //　フォームの値を初期化する
    this.form = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  /** 検索ボタン非活性フラグ */
  isSearchButtonDisabled = true;

  /** 値段検証エラー */
  priceValidationError = false;

  /** 入力項目のチェック */
  checkInput(): void{
    const IsNameEmpty = !this.form.name || this.form.name.trim() === '';
    const IsCategoryEmpty = !this.form.category || this.form.category.trim() ==='';
    const IsMinPriceEmpty = this.form.minPrice === null;
    const IsMaxPriceEmpty = this.form.maxPrice === null;
    this.isSearchButtonDisabled = IsNameEmpty && IsCategoryEmpty && IsMinPriceEmpty && IsMaxPriceEmpty ;

    if( this.form.minPrice && this.form.maxPrice && this.form.minPrice !==null && this.form.maxPrice !==null && this.form.minPrice > this.form.maxPrice){
      this.priceValidationError = true;
    } else {
      this.priceValidationError = false;
    }
  }
}
