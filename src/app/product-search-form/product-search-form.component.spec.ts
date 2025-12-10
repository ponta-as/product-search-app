import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductSearchFormComponent } from './product-search-form.component';
import { ProductDataService } from '../services/product-data.service';

describe('ProductSearchFormComponent', () => {
  let component: ProductSearchFormComponent;
  let fixture: ComponentFixture<ProductSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientTestingModule, ProductSearchFormComponent],
      providers: [ProductDataService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchFormComponent);
    component = fixture.componentInstance;

    // ProductDataService の CSV 読み込みに応答
    const httpMock = TestBed.inject(HttpClientTestingModule);
    const req = (httpMock as any).expectOne?.('assets/products.csv');
    if (req) {
      req.flush('id,name,category,price,stock\n1,Test,Electronics,100,1');
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===== クリアボタン（clear()メソッド） =====
  it('clear() should reset form to initial state', () => {
    // フォームに入力
    component.form.name = 'Test Product';
    component.form.category = 'Electronics';
    component.form.minPrice = 100;
    component.form.maxPrice = 5000;

    // clear()を実行
    component.clear();

    // 全て初期化されていることを確認
    expect(component.form.name).toBe('');
    expect(component.form.category).toBe('');
    expect(component.form.minPrice).toBeNull();
    expect(component.form.maxPrice).toBeNull();
  });

  // ===== ボタン活性/非活性（isAllEmpty） =====
  it('isAllEmpty should be true when all fields are empty', () => {
    component.form.name = '';
    component.form.category = '';
    component.form.minPrice = null;
    component.form.maxPrice = null;

    expect(component.isAllEmpty).toBeTrue();
  });

  it('isAllEmpty should be false when name is filled', () => {
    component.form.name = 'Laptop';
    component.form.category = '';
    component.form.minPrice = null;
    component.form.maxPrice = null;

    expect(component.isAllEmpty).toBeFalse();
  });

  it('isAllEmpty should be false when category is selected', () => {
    component.form.name = '';
    component.form.category = 'Electronics';
    component.form.minPrice = null;
    component.form.maxPrice = null;

    expect(component.isAllEmpty).toBeFalse();
  });

  it('isAllEmpty should be false when minPrice is set', () => {
    component.form.name = '';
    component.form.category = '';
    component.form.minPrice = 1000;
    component.form.maxPrice = null;

    expect(component.isAllEmpty).toBeFalse();
  });

  it('isAllEmpty should be false when maxPrice is set', () => {
    component.form.name = '';
    component.form.category = '';
    component.form.minPrice = null;
    component.form.maxPrice = 5000;

    expect(component.isAllEmpty).toBeFalse();
  });

  it('isAllEmpty should ignore whitespace-only name', () => {
    component.form.name = '   ';
    component.form.category = '';
    component.form.minPrice = null;
    component.form.maxPrice = null;

    expect(component.isAllEmpty).toBeTrue();
  });

  // ===== 価格の上下関係チェック（priceInvalid） =====
  it('priceInvalid should be false when min and max are both null', () => {
    component.form.minPrice = null;
    component.form.maxPrice = null;

    expect(component.priceInvalid).toBeFalse();
  });

  it('priceInvalid should be false when only minPrice is set', () => {
    component.form.minPrice = 1000;
    component.form.maxPrice = null;

    expect(component.priceInvalid).toBeFalse();
  });

  it('priceInvalid should be false when only maxPrice is set', () => {
    component.form.minPrice = null;
    component.form.maxPrice = 5000;

    expect(component.priceInvalid).toBeFalse();
  });

  it('priceInvalid should be false when min <= max', () => {
    component.form.minPrice = 1000;
    component.form.maxPrice = 5000;

    expect(component.priceInvalid).toBeFalse();
  });

  it('priceInvalid should be true when min > max', () => {
    component.form.minPrice = 5000;
    component.form.maxPrice = 1000;

    expect(component.priceInvalid).toBeTrue();
  });

  it('priceInvalid should be true when min equals max (edge case)', () => {
    component.form.minPrice = 3000;
    component.form.maxPrice = 3000;

    // min == max は不正ではないはずなので False
    expect(component.priceInvalid).toBeFalse();
  });

  // ===== 検索イベント発行 =====
  it('onSearch() should emit search event with form data', () => {
    spyOn(component.search, 'emit');

    component.form.name = 'Test';
    component.form.category = 'Home';
    component.form.minPrice = 100;
    component.form.maxPrice = 1000;

    component.onSearch();

    expect(component.search.emit).toHaveBeenCalledWith({
      name: 'Test',
      category: 'Home',
      minPrice: 100,
      maxPrice: 1000,
    });
  });
});