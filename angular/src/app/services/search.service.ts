import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../product.model';
import { Order } from '../order.model';
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: "root"
})
export class SearchService {
  search;
  products;
  orders;
  constructor(private http: HttpClient) {}
  searchProduct(data) {
      this.search = {
        name: data
      };
      return this.http
        .post<{ product: Product[] }>(
          BACKEND_URL + "product/search",
          this.search
        );
  }
  placeOrder(order) {
    return this.http.post<{ orders: Order[] }>(BACKEND_URL + "order/insertOrder", order);
  }
}
