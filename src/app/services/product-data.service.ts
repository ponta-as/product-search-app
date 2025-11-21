import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
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

  /** カテゴリ一覧の BehaviorSubject (読み込み後に発行) */
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  /** 外部から購読できるカテゴリ Observable */
  public categories$ = this.categoriesSubject.asObservable();

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
          // 読み込んだ商品のカテゴリ一覧を抽出して発行
          const cats = Array.from(new Set(this.products.map(p => p.category))).sort((a, b) => a.localeCompare(b));
          this.categoriesSubject.next(cats);
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
    // 行単位に分割し、先頭ヘッダー行を除去、空行をスキップ
    const rawLines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) return [];

    // 先頭行はヘッダーと想定して除去
    const lines = rawLines.slice(1);

    const products: Product[] = [];

    lines.forEach((line, idx) => {
      // 単純なCSVパース: カンマで分割して前後の空白を削除
      const cols = line.split(',').map(c => c.trim());

      // 必要なカラムが揃っているか確認
      const idStr = cols[0];
      const name = cols[1] ?? '';
      const category = cols[2] ?? '';
      const priceStr = cols[3] ?? '';

      const id = Number(idStr);
      const price = Number(priceStr);

      // ID と価格は数値として妥当かチェック。妥当でない行はスキップして警告を出す。
      if (!idStr || Number.isNaN(id)) {
        console.warn(`Skipping CSV row ${idx + 2}: invalid id -> "${idStr}"`);
        return;
      }

      if (!priceStr || Number.isNaN(price)) {
        console.warn(`Skipping CSV row ${idx + 2}: invalid price -> "${priceStr}"`);
        return;
      }

      products.push({
        id: id,
        name: name.trim(),
        category: category.trim(),
        price: price,
      } as Product);
    });

    return products;
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
