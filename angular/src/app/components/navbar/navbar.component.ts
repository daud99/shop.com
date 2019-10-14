import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart, faSearch, faLessThanEqual, faUser, faUserCircle, faCog, faLock } from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../services/search.service';
import { ApiService } from '../../services/requestApi.service';
import { Subscription } from 'rxjs';
import { Product } from '../../product.model';
import { CartInterface } from '../../cart.model';
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string;
  no = false;
  show = false;
  public products;
  public product_array: Product[] = [];
  categoryId = '';
  searchWord: string = "";
  itemInCart = 0;
  user = {
    userId: '',
    userType: ''
  };
  faShoppingCart = faShoppingCart;
  faLock = faLock;
  faSearch = faSearch;
  faUser = faUser;
  faUserCircle = faUserCircle;
  faCog = faCog;
  userIsAuthenticated = false;
  display = 'none';
  items = {
    _id: '',
    owner: '',
    total: '',
    items: [{
      item: {
        _id: '',
        category_id: '',
        name: '',
        price: '',
        image: '',
      },
      price: '',
      quantity: '',
      _id: ''
    }]
  };
  userid = '';
  b = {
    item: '',
    userId: '',
    indexs: '',
    quantity:''
  }
  private authListenerSubs: Subscription;
  constructor(
    private apiservice: ApiService,
    private searchService: SearchService,
    private router: Router
  ) {}
  ngOnInit() {
    this.apiservice.getTotalListener().subscribe(item => {
      this.itemInCart = item;
    });
    this.userIsAuthenticated = this.apiservice.getIsAuth();
    this.findTotal();
    this.getUsername();
    this.getUserType();
    this.authListenerSubs = this.apiservice
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        console.log('hellooooooooooooooooooooo');
        this.findTotal();
        this.getUsername();
        this.getUserType();
      });
  }
  findTotal() {
    console.log("find total executed");
    this.user.userId = this.apiservice.getUserId();
    console.log(this.user.userId);
    this.apiservice.totalItem(this.user);
  }
  searchProduct() {
    if (this.searchWord === '') {
      this.no = false;
    } else {
      this.searchService.searchProduct(this.searchWord).subscribe(respond => {
        this.products = respond;
        //console.log(this.products);
        this.no = true;
      });
    }
  }
  getUsername() {
    console.log('hello');
    this.userid = this.apiservice.getUserId();
    this.apiservice.showUserInfo(this.userid).subscribe(response => {
      console.log(response.username);
      this.username = response.username;
    });
  }
  getUserType() {
    console.log('getUserType function got executed');
    this.user.userType = this.apiservice.getUserType();

  }
  showcart() {
    this.userid = this.apiservice.getUserId();
    this.apiservice.getcartitem(this.userid).subscribe(product => {
      this.items = product;
      console.log(this.items);
    });
    console.log('hello daud');
    console.log(this.items);

  }
  remove(a,q,i) {
    this.b.userId = this.apiservice.getUserId();
    this.b.item = a;
    this.b.indexs = i;
    this.b.quantity = q;
    this.apiservice.cartrem(this.b).subscribe(data => {
      console.log(data);
      this.showcart();
      this.apiservice.totalItem(this.user);
    });
}

  showDialog() {
    this.display = 'block';
    this.showcart();
  }
  close() {
    // this.router.navigateByUrl('/pay');
    this.display = 'none';
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
  onLogout() {
    this.apiservice.logout();
  }
  yes() {
    this.no = false;
    this.show = false;
  }
  changeCategoryId(id) {
    if (this.show === false) {
      this.show = true;
      }
    this.categoryId = id;
    console.log(this.categoryId);
    this.getProducts();
  }
  getProducts() {
    this.apiservice.viewcategory(this.categoryId).subscribe(response => {
      this.product_array = response.products;
    });
  }
}
