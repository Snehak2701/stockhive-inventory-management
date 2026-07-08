import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  products: Product[] = [];
showForm = false;
  newProduct: Product = {
    name: '',
    sku: '',
    quantity: 0,
    reorderLevel: 0
    
  };


// ADD THESE ↓
searchText = '';
showLowStockOnly = false;
  constructor(
  private productService: ProductService,
  private authService: AuthService,
  private router: Router
) {}

  ngOnInit(): void {
    this.productService.listenProducts((products) => {
      this.products = products;
    });
  }
  editProduct(product: Product) {

  this.newProduct = {
    ...product
  };
this.showForm = false;
}

async updateProduct() {
 if (
    !this.newProduct.name.trim() ||
    !this.newProduct.sku.trim() ||
    this.newProduct.quantity < 0 ||
    this.newProduct.reorderLevel < 0
  ) {
    alert('Please enter valid product details.');
    return;
  }
  if (!this.newProduct.id) return;

  await this.productService.updateProduct(
    this.newProduct.id,
    this.newProduct
  );

  this.newProduct = {
    name: '',
    sku: '',
    quantity: 0,
    reorderLevel: 0
  };
this.showForm = false;
}

async deleteProduct(id?: string) {

  if (!id) return;

  if (
  confirm(`Are you sure you want to delete "${name}"?`)
) {

    await this.productService.deleteProduct(id);

  }

}

  async addProduct() {

    if (
    !this.newProduct.name.trim() ||
    !this.newProduct.sku.trim() ||
    this.newProduct.quantity < 0 ||
    this.newProduct.reorderLevel < 0
  ) {
    alert('Please enter valid product details.');
    return;
  }
const exists = this.products.some(
  p => p.sku.toLowerCase() === this.newProduct.sku.toLowerCase()
);

if (exists) {
  alert('A product with this SKU already exists.');
  return;
}
    await this.productService.addProduct(this.newProduct);

    this.newProduct = {
      name: '',
      sku: '',
      quantity: 0,
      reorderLevel: 0
    };
  this.showForm = false;
  }
  get filteredProducts(): Product[] {

  return this.products.filter(product => {

    const matchesSearch =
      product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(this.searchText.toLowerCase());

    const matchesLowStock =
      !this.showLowStockOnly ||
      product.quantity <= product.reorderLevel;

    return matchesSearch && matchesLowStock;

  });

}
async increase(product: Product) {
  await this.productService.increaseStock(product);
}

async decrease(product: Product) {
  await this.productService.decreaseStock(product);
}
get totalProducts() {
  return this.products.length;
}

get lowStockProducts() {
  return this.products.filter(
    p => p.quantity <= p.reorderLevel
  ).length;
}

get totalQuantity() {
  return this.products.reduce(
    (sum, p) => sum + p.quantity,
    0
  );
}
async logout() {
  await this.authService.logout();
  this.router.navigate(['/']);
}
}