import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list.component';
import { Product } from '../models';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProductListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===== ヒット件数の表示（hitCount） =====
  it('hitCount should return 0 when products array is empty', () => {
    component.products = [];
    expect(component.hitCount).toBe(0);
  });

  it('hitCount should return correct count when products exist', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', category: 'Electronics', price: 100 },
      { id: 2, name: 'Product 2', category: 'Electronics', price: 200 },
      { id: 3, name: 'Product 3', category: 'Home', price: 300 },
    ];
    component.products = mockProducts;

    expect(component.hitCount).toBe(3);
  });

  it('hitCount should update when products array changes', () => {
    expect(component.hitCount).toBe(0);

    component.products = [
      { id: 1, name: 'Product 1', category: 'Electronics', price: 100 },
    ];
    expect(component.hitCount).toBe(1);

    component.products = [];
    expect(component.hitCount).toBe(0);
  });

  it('hitCount should return 0 when products is undefined', () => {
    component.products = undefined as any;
    expect(component.hitCount).toBe(0);
  });

  // ===== カート判定 =====
  it('onToggleCart should emit toggleCart event with product id', () => {
    spyOn(component.toggleCart, 'emit');

    component.onToggleCart(5);

    expect(component.toggleCart.emit).toHaveBeenCalledWith(5);
  });

  it('isInCart should return true/false based on callback', () => {
    component.isInCart = (id: number) => id === 3;

    expect(component.isInCart(3)).toBeTrue();
    expect(component.isInCart(5)).toBeFalse();
  });
});