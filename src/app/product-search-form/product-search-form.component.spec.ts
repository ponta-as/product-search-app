import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ProductSearchFormComponent } from './product-search-form.component';
import { ProductDataService } from '../services/product-data.service';

describe('ProductSearchFormComponent', () => {
  let component: ProductSearchFormComponent;
  let fixture: ComponentFixture<ProductSearchFormComponent>;
  let categoriesSubject: BehaviorSubject<string[]>;
  let mockDataService: Partial<ProductDataService>;

  beforeEach(async () => {
    categoriesSubject = new BehaviorSubject<string[]>([]);
    mockDataService = {
      categories$: categoriesSubject.asObservable(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductSearchFormComponent],
      providers: [{ provide: ProductDataService, useValue: mockDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate categories from service', () => {
    categoriesSubject.next(['B', 'A']);
    fixture.detectChanges();
    expect(component.categories).toEqual(['B', 'A']);
  });

  it('isFormEmpty should be true initially and false after change', () => {
    expect(component.isFormEmpty()).toBeTrue();
    component.form.name = 'x';
    expect(component.isFormEmpty()).toBeFalse();
  });

  it('onClear should reset the form', () => {
    component.form.name = 'abc';
    component.form.minPrice = 100;
    component.onClear();
    expect(component.form.name).toBe('');
    expect(component.form.minPrice).toBeNull();
  });

  it('isPriceInvalid should detect min > max', () => {
    component.form.minPrice = 500;
    component.form.maxPrice = 100;
    expect(component.isPriceInvalid()).toBeTrue();

    component.form.minPrice = null;
    component.form.maxPrice = 1000;
    expect(component.isPriceInvalid()).toBeFalse();
  });
});
