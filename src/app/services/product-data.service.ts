import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models';
import { BehaviorSubject } from 'rxjs';

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

  /** カテゴリ一覧を通知する Subject */
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  public readonly categories$ = this.categoriesSubject.asObservable();

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

          // カテゴリ一覧を抽出してソートして通知（空カテゴリは除外）
          const cats = Array.from(new Set(this.products.map(p => p.category).filter(Boolean)))
            .sort((a, b) => a.localeCompare(b));
          this.categoriesSubject.next(cats);
        },
        error: () => {
          // エラー時も loaded を true にして無限待ちを防止
          this.loaded = true;
          console.error('Failed to load products.csv');
        }
      });
  }

  /**
   * CSV → Product[] に変換
   *
   * - 空行を無視する
   * - 各セルは trim() して余分な空白を除去する
   * - id と price の妥当性をチェックし、不正な行はスキップ（console.warn）
   */
  private parseCSV(csv: string): Product[] {
    if (!csv) return [];

    // 行を分割し、先頭/末尾の空白をトリム、空行を除外
    const rawLines = csv.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) return [];

    // 先頭行はヘッダーとして削除
    const header = rawLines.shift();

    const products: Product[] = [];

    rawLines.forEach((line, index) => {
      // 単純 CSV: カンマで分割して各要素を trim
      const cols = line.split(',').map(c => c.trim());

      // 必要なカラムが存在するか確認（id, name, category, price の最低4列を期待）
      if (cols.length < 4) {
        console.warn(`Skipping line ${index + 2} (insufficient columns): "${line}"`);
        return;
      }

      const idRaw = cols[0];
      const name = cols[1] ?? '';
      const category = cols[2] ?? '';
      const priceRaw = cols[3] ?? '';

      const id = Number(idRaw);
      if (!Number.isInteger(id)) {
        console.warn(`Skipping line ${index + 2} (invalid id): "${line}"`);
        return;
      }

      // 価格の妥当性チェック：空か数値化できない場合は行をスキップ
      if (priceRaw === '') {
        console.warn(`Skipping line ${index + 2} (empty price): "${line}"`);
        return;
      }
      const price = Number(priceRaw);
      if (!isFinite(price)) {
        console.warn(`Skipping line ${index + 2} (invalid price): "${line}"`);
        return;
      }

      products.push({
        id,
        name: name.trim(),
        category: category.trim(),
        price,
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

  /** 同期的に現在のカテゴリ一覧を取得（必要なら） */
  getCategoriesSync(): string[] {
    return this.categoriesSubject.getValue();
  }
}