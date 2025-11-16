import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ProductSearchFormValue {
  name?: string;
  category?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

@Component({
  selector: 'app-product-search-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-search-form.component.html',
  styleUrls: ['./product-search-form.component.scss'],
})
export class ProductSearchFormComponent {
  @Output() search = new EventEmitter<ProductSearchFormValue>();

  form: ProductSearchFormValue = {
    name: '',
    category: '',
    minPrice: null,
    maxPrice: null,
  };

  readonly categories: string[] = ['PC', 'Accessory', 'Display', 'Tablet'];

  onSearch(): void {
    this.search.emit(this.form);
  }
}
