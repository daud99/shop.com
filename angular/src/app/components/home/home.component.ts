import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/requestApi.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit , OnDestroy {
  private listener: Subscription;
  nUrl: string = "http://localhost:3000/";
  products = [];
  index: string;
  display = 'none';
  u = false;
  cart = {
    quantity: null,
    price: null,
    userId: ''
  };
  feedback: string;
  constructor(public MyService: ApiService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.feedback = params.error;
      });
    this.listener = this.MyService
    .getNewListener()
      .subscribe(isAuthenticated => {
        console.log('going to call makeTrue');
        // this.makeTrue(isAuthenticated);
        this.u = isAuthenticated;
    });
    // this.listener = this.MyService.getAuthStatusListener().subscribe(isAuthenticated => {
    //   console.log('hey this is executed as well mazay');
    //   this.u = isAuthenticated;
    // });
    this.MyService.getProducts().subscribe(product => {
      this.products = product;
    });
  }
  ngOnDestroy() {
    this.listener.unsubscribe();
  }
  // makeTrue(a) {
  //   console.log('heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
  //   this.u = a;
  // }
  open(o, prdct) {
    this.index = prdct._id;
    this.cart.price = prdct.price;
    this.display = 'block';
  }
  close() {
    this.display = 'none';
  }

  sub() {
    console.log(this.cart);
    console.log(this.index);
    this.cart.userId = this.MyService.getUserId();
    this.MyService.cartadd(this.cart, this.index).subscribe(data => {
      console.log(this.index);
      this.MyService.totalItem(this.cart);
    });
  }
}
