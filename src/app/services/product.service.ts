import { serverTimestamp } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection = collection(db, 'products');

  async addProduct(product: Product) {
    return await addDoc(this.productCollection, product);
  }

  async getProducts() {
    return await getDocs(this.productCollection);
  }

 async updateProduct(id: string, product: Product) {
  const productRef = doc(db, 'products', id);
  return await updateDoc(productRef, {
    name: product.name,
    sku: product.sku,
    quantity: product.quantity,
    reorderLevel: product.reorderLevel
  });
}
async saveMovement(productId: string, delta: number) {

  const auth = getAuth();

  await addDoc(collection(db, 'movements'), {

    productId,

    delta,

    at: new Date(),

    byUid: auth.currentUser?.uid || ''

  });

}
async deleteProduct(id: string) {
  const productRef = doc(db, 'products', id);
  return await deleteDoc(productRef);
}

  listenProducts(callback: (products: Product[]) => void) {
  onSnapshot(this.productCollection, (snapshot) => {

    console.log("Documents Found:", snapshot.size);

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Product)
    }));

    console.log(products);

    callback(products);
  });
}
async increaseStock(product: Product) {

  const productRef = doc(db, 'products', product.id!);

  await updateDoc(productRef, {
    quantity: product.quantity + 1
  });

  await addDoc(collection(db, 'movements'), {
    productId: product.id,
    delta: 1,
    at: serverTimestamp(),
    byUid: 'currentUser'
  });

}

async decreaseStock(product: Product) {

  if (product.quantity <= 0) return;

  const productRef = doc(db, 'products', product.id!);

  await updateDoc(productRef, {
    quantity: product.quantity - 1
  });

  await addDoc(collection(db, 'movements'), {
    productId: product.id,
    delta: -1,
    at: serverTimestamp(),
    byUid: 'currentUser'
  });

}


}
