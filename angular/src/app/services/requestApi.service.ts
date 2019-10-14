import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Msg } from '../msg.model';
import { User } from '../user.model';
import { Order } from '../order.model';
import { Product } from '../product.model';
import { Category } from '../category.model';
import { Address } from '../address.model';
import { CartInterface } from '../cart.model';
import { environment } from '../../environments/environment';


const BACKEND_URL = environment.apiUrl;

@Injectable()
export class ApiService {
  private total = new Subject<number>();
  private token: string = "";
  private userId: string;
  private userType: string;
  private authStatusListener = new Subject<boolean>();
  private newListener = new BehaviorSubject<boolean>(false);
  private mageListener = new Subject<string>();
  private isAuthenticated = false;
  private tokenTimer: any;
  message: string;
  mage: string = "";
  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    if (this.token === undefined) {
      this.token = '';
    }
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getNewListener() {
    return this.newListener.asObservable();
  }
  getTotalListener() {
    return this.total.asObservable();
  }
  getUserId() {
    return this.userId;
  }
  getUserType() {
    return this.userType;
  }
  addUser(user) {
    return this.http.post<{ message: string }>(BACKEND_URL + 'user/signup', user);
  }

  getAddresses(userid) {
    console.log('i send the request for all addresses with userid' + userid);
    return this.http.get<{ address: Address[] }>(BACKEND_URL + 'cart/address/' + userid);
  }
  getMageListener() {
    return this.mageListener.asObservable();
  }
  verifyUser(user) {
    this.http
      .post<{ token: string; userId: string; userType: string; expiresIn: number }>(
        BACKEND_URL + 'user/login', user)
      .subscribe(
        result => {
          this.token = result.token;
          if (this.token) {
            const expiresInDuration = result.expiresIn;
            this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.userId = result.userId;
              this.userType = result.userType;
              console.log('jimmy is true');
              this.authStatusListener.next(true);
              const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            console.log(expirationDate);
              this.saveAuthData(this.token, expirationDate, this.userId, this.userType);
              this.newListener.next(true);
              // this.fireObserver();
              this.router.navigate(['/']);
          }
        },
        error => {
          if (error) {
            console.log('error is received and it is' + error.error.error);
            this.mageListener.next(error.error.error);
          }
        }
      );
  }
  fireObserver() {
    console.log('i am on fire lol');
    this.authStatusListener.next(true);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userType = authInformation.userType;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.newListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getMsgs() {
    return this.http.get<{ message: string; msgs: Msg[] }>(
      BACKEND_URL + "admin/viewMsgs"
    );
  }

  delmsg(v): Observable<mmm[]>{
    return this.http.delete<mmm[]>(BACKEND_URL + 'admin/deleteMsg/' + v);
  }

  delorder(orderid) {
    return this.http.delete<{ message: string }>(BACKEND_URL + 'order/deleteOrder/' + orderid);
  }

  trackOrder(orderno) {
    console.log('i am in api with orderno' + orderno);
    return this.http.get<{ order: Order[] }>(BACKEND_URL + 'order/trackOrder/' + orderno);
  }

  cartrem(q)
  {
    console.log(q);
    return this.http.post<cart[]>(BACKEND_URL + 'cart/removeProduct/', q);
  }
  getcartitem(q):Observable<any> {
    return this.http.get<any>(BACKEND_URL + 'cart/'+q);
  }


  addMsg(msg) {
    return this.http.post<{ message: string }>(
      BACKEND_URL + "contact",
      msg
    );
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(BACKEND_URL + "product/forhome");
  }
  cartadd(data, route): Observable<cart[]> {
    console.log(data);
    return this.http.post<cart[]>(BACKEND_URL + 'cart/addProduct/'+route, data);
  }

  showUserInfo(userid) {
    return this.http.get<User>(BACKEND_URL + 'user/'+userid);
  }
  editUserInfo(user) {
    return this.http.put<{ message: string }>(BACKEND_URL + 'user/',user);
  }

  totalItem(data) {
    console.log(data + "this.");
    this.http
      .post<{ total_item: number }>(
        BACKEND_URL + "cart/totalProduct",
        data
      )
      .subscribe(respond => {
        console.log(respond.total_item + 'items are there');
        this.total.next(respond.total_item);
      });
  }
  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.userId = null;
    this.userType = null;
    this.authStatusListener.next(false);
    this.newListener.next(false);
    this.clearAuthData();
  }

  // requesting products from each component
  viewcategory(category_id) {
    console.log('this is category id' + category_id);
    return this.http.get<{ products: Product[] }>(BACKEND_URL + 'product/'+category_id);
  }

  getCategories() {
    return this.http.get<{ category: Category[] }>(BACKEND_URL + 'product/allcategories/');
  }

  getAllOrders() {
    return this.http.get<{ order: Order[] }>(BACKEND_URL + 'order/allOrders/');
  }

  getCurrentUserOrders(id) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    return this.http.get<{ order: Order[] }>(BACKEND_URL + 'order/currentOrders/'+id);
  }

  getTotalAmountToPay(userid) {
    return this.http.get<{ total: string }>(BACKEND_URL + 'cart/currentBill/'+userid);
  }

  addProduct(name: string, id: string, price: string, image: File) {
    const productData = new FormData();
    productData.append('name', name);
    productData.append('id', id);
    productData.append('price', price);
    productData.append('image', image);
    return this.http.post<{ message: string }>(BACKEND_URL + 'product/addproduct', productData);
  }


  pay(name: string, phonenumber: number, houseno: number, streetno: number, town: string, city: string, total: number, country: string, id: string) {
    console.log('name is' + name);
    console.log('id is ' + id);
    const p = {
      name: name, phoneno: phonenumber, h: houseno, s: streetno, t: town, c: city,
      total: total, country: country, _id: id
    };
    // console.log('p is below');
    // console.log(p);
    // console.log('we are done paying');
    return this.http.post<{ message: string }>(BACKEND_URL + 'cart/pay/', p);
  }

  changePassword(pp) {
    return this.http.post<{ message: string }>(BACKEND_URL + 'user/changePassword', pp);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userType: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userType: userType
    };
  }
}
interface cart {
  quantity: number,
  price: number
}

interface mmm{
  name: String,
  email: String,
  message: String,
  userid: String,
  date:String
}
interface item{
  owner: number,
  total: number,
  items: [
    {
      item: string,
      quantity: number,
      price:number
    }
  ]
}

