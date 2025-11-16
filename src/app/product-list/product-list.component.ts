import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Input() isInCart: (id: number) => boolean = () => false;
  @Output() toggleCart = new EventEmitter<number>();

  onClickToggle(id: number): void {
    this.toggleCart.emit(id);
  }
}
