// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models';
import { ProductDataService } from './services/product-data.service';
import { CartService } from './services/cart.service';
import { ProductSearchFormComponent } from './product-search-form/product-search-form.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductSearchFormComponent, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '課題B：商品検索＆カート管理';

  /** 検索結果として表示する商品一覧 */
  products: Product[] = [];

  /** カート内の商品件数（ヘッダー表示用） */
  cartCount = 0;

  constructor(
    private readonly dataService: ProductDataService,
    private readonly cartService: CartService,
  ) { }

  onSearch(cond: {
    name?: string;
    category?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
  }): void {
    this.products = this.dataService.search({
      ...cond,
      minPrice: cond.minPrice ?? undefined,
      maxPrice: cond.maxPrice ?? undefined,
    });
  }

  onToggleCart(id: number): void {
    // サービス側の状態をトグル
    this.cartService.toggle(id);

    // トグル後の状態を見て件数を増減
    this.cartCount += this.cartService.isInCart(id) ? 1 : -1;

    // 念のためマイナスにならないようガード
    if (this.cartCount < 0) {
      this.cartCount = 0;
    }
  }

  /** 商品IDがカートに入っているかどうか */
  isInCart = (id: number): boolean => this.cartService.isInCart(id);
}
