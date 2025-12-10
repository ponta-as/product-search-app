import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductDataService } from './product-data.service';

describe('ProductDataService', () => {
  let service: ProductDataService;
  let httpMock: HttpTestingController;

  // CSV はヘッダー、空行、余分な空白、不正価格、空カテゴリ を含める
  const sampleCsv = `id,name,category,price,stock
  1,  Laptop Pro  , Electronics , 1000 ,10

  2, Widget , , 200 ,5
  3, InvalidPrice, Tools, abc ,2
  4,  ValidTrim , Home , 300 ,1
  `;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductDataService],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductDataService);

    // サービス生成時に assets/products.csv を読みに行くので応答を返す
    const req = httpMock.expectOne('assets/products.csv');
    expect(req.request.responseType).toBe('text');
    req.flush(sampleCsv);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('parses CSV, trims fields, skips empty lines and invalid price rows', () => {
    const all = service.search({});
    // id=3 has invalid price 'abc' and should be skipped
    const ids = all.map(p => p.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 4]);

    // 名前がトリムされていることを確認
    const p1 = all.find(p => p.id === 1)!;
    expect(p1.name).toBe('Laptop Pro');

    // price が数値で保持されていること
    expect(typeof p1.price).toBe('number');
    expect(p1.price).toBe(1000);
  });

  it('exposes categories$ as alphabetically sorted unique non-empty categories', (done) => {
    service.categories$.subscribe(cats => {
      // From sampleCsv: Electronics, (empty), Tools(invalid price row skipped), Home
      // Only Electronics and Home should remain, sorted alphabetically
      expect(cats).toEqual(['Electronics', 'Home']);
      done();
    });
  });

  it('search filters by name, category and price range', () => {
    // name
    const byName = service.search({ name: 'Laptop' });
    expect(byName.some(p => p.name.includes('Laptop'))).toBeTrue();

    // category
    const byCategory = service.search({ category: 'Home' });
    expect(byCategory.every(p => p.category === 'Home')).toBeTrue();

    // price range
    const byPrice = service.search({ minPrice: 250, maxPrice: 1000 });
    expect(byPrice.every(p => p.price >= 250 && p.price <= 1000)).toBeTrue();
  });
});