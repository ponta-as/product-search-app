import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models';

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
    const arr = csv.trim().split('\r\n');
    const lines = this.remove_items_in_array(arr);
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

  // 指定した配列から空の項目を削除する関数
  remove_items_in_array(arr: string[]): string[] {
    for (var i = 0; i < arr.length; i++) {
      if(arr[i] === '') {
        arr.splice(i, 1);
        i--;
      }
    }
    return arr;
  };

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
