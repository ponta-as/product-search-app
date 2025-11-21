import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Product } from './models';
import { ProductDataService } from './services/product-data.service';
import { CartService } from './services/cart.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockCartService: any;
  let mockDataService: any;

  beforeEach(async () => {
    mockCartService = {
      getCartIds: jasmine.createSpy('getCartIds').and.returnValue([1, 2]),
      toggle: jasmine.createSpy('toggle'),
      isInCart: jasmine.createSpy('isInCart').and.returnValue(false),
    };

    mockDataService = {
      search: jasmine.createSpy('search').and.returnValue([]),
      categories$: of([]),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ProductDataService, useValue: mockDataService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();
  });

  it('should create the app and initialize cartCount from CartService', () => {
    // Because AppComponent injects types, provide override via injector
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    fixture.detectChanges();

    expect(app).toBeTruthy();
    expect(app.cartCount).toBe(2);
  });

  it('onSearch should call dataService.search and update products', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    (app as any).dataService = mockDataService;

    const results: Product[] = [
      { id: 1, name: 'A', category: 'C', price: 100 },
    ];
    mockDataService.search.and.returnValue(results);

    app.onSearch({ name: 'A' });
    expect(mockDataService.search).toHaveBeenCalled();
    expect(app.products).toEqual(results);
  });
});
