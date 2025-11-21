import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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
export class ProductSearchFormComponent implements OnInit, OnDestroy {
  /** 検索結果を親コンポーネントへ通知 */
  @Output() search = new EventEmitter<ProductSearchFormValue>();

  /** フォーム入力値 */
  form: ProductSearchFormValue = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  /** カテゴリ選択肢 (サービスから取得) */
  categories: string[] = [];

  private sub?: Subscription;
  constructor(private dataService: ProductDataService) {}

  /** フォーム送信時に親へ検索条件を渡す */
  onSearch(): void {
    if (this.isFormEmpty() || this.isPriceInvalid()) return;
    this.search.emit(this.form);
  }

  ngOnInit(): void {
    this.sub = this.dataService.categories$.subscribe((cats: string[]) => {
      this.categories = cats;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** すべて未入力なら true */
  isFormEmpty(): boolean {
    const nameEmpty = !this.form.name || this.form.name.toString().trim() === '';
    const categoryEmpty = !this.form.category;
    const minEmpty = this.form.minPrice == null;
    const maxEmpty = this.form.maxPrice == null;

    return nameEmpty && categoryEmpty && minEmpty && maxEmpty;
  }

  /** Min > Max のとき true */
  isPriceInvalid(): boolean {
    if (this.form.minPrice == null || this.form.maxPrice == null) return false;
    return Number(this.form.minPrice) > Number(this.form.maxPrice);
  }

  /** フォームを初期化 */
  onClear(): void {
    this.form = {
      name: '',
      category: '',
      minPrice: null,
      maxPrice: null,
    };
  }
}
