import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProductSearchCondition {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  /** CSV 読み込み済みフラグ */
  private loaded = false;

  /** 商品データ一覧 */
  private products: Product[] = [];

  /** 商品データ一覧 */
  private productsSubject = new BehaviorSubject<Product[]>([]);
  
  constructor(private http: HttpClient) {
    /** サービス生成時に CSV を読み込み */
    this.loadProductsFromCSV();
  }

  /** CSV を取得して読み込む */
  private loadProductsFromCSV(): void {
    if (this.loaded) return;

    this.http
      .get('assets/products.csv', { responseType: 'text' })
      .subscribe({
        next: csv => {
          this.products = this.parseCSV(csv);
          this.loaded = true;
          this.productsSubject.next(this.products);
        },
        error: () => {
          // エラー時も loaded を true にして無限待ちを防止
          this.loaded = true;
          console.error('Failed to load products.csv');
        }
      });
  }

  /** CSV → Product[] に変換 */
  private parseCSV(csv: string): Product[] {
    const lines = csv.trim().split('\n');
    lines.shift(); // 先頭行はヘッダー

    return lines.map(line => {
      const [id, name, category, price] = line.split(',');

      return {
        id: Number(id),
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
      } as Product;
    });
  }

  /** カテゴリ一覧を返却*/
  getCategories$(): Observable<string[]> {
    return this.productsSubject.asObservable().pipe(
      map(products => {
        // 商品リストからカテゴリだけ抜き出して重複削除
        const allCategories = products.map(p => p.category || '');
        return [...new Set(allCategories)]; // 重複排除
      })
    );
  }

  /** 検索条件で商品を絞り込み */
  search(cond: ProductSearchCondition): Product[] {
    if (!this.loaded) return [];
    return this.products.filter(p => {
      if (cond.name && !p.name.toLowerCase().includes(cond.name.toLowerCase())) return false;
      if (cond.category && p.category !== cond.category) return false;
      if (cond.minPrice != null && p.price < cond.minPrice) return false;
      if (cond.maxPrice != null && p.price > cond.maxPrice) return false;
      return true;
    });
  }
}
