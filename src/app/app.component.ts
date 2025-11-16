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
  products: Product[] = [];

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
    this.cartService.toggle(id);
  }

  isInCart = (id: number): boolean => this.cartService.isInCart(id);
}
