import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

const STORAGE_KEY = 'product_search_app_cart_ids_v1';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    // テスト開始前に localStorage をクリア
    localStorage.removeItem(STORAGE_KEY);

    TestBed.configureTestingModule({
      providers: [CartService],
    });

    service = TestBed.inject(CartService);
    // 確実に初期状態にする
    service.clear();
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('starts empty', () => {
    expect(service.getCartIds().length).toBe(0);
  });

  it('toggles id and persists to localStorage', () => {
    service.toggle(7);
    expect(service.isInCart(7)).toBeTrue();

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toEqual([7]);

    // toggle で削除されること
    service.toggle(7);
    expect(service.isInCart(7)).toBeFalse();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([]);
  });

  it('restores ids from localStorage on construction', () => {
    // 先に localStorage にデータを入れておく（文字列として保存される想定）
    localStorage.setItem(STORAGE_KEY, JSON.stringify([2, 3, '4']));

    // new でインスタンスを作成して復元を確認（TestBed 既存インスタンスとは別扱いで）
    const restored = new CartService();
    expect(restored.isInCart(2)).toBeTrue();
    expect(restored.isInCart(3)).toBeTrue();
    // '4' が文字列でも数値 4 として復元される
    expect(restored.isInCart(4)).toBeTrue();
  });
});