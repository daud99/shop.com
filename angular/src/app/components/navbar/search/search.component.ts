import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/requestApi.service';
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent implements OnInit {
  private listener: Subscription;
  @Input() public products;
  nUrl: string = "http://localhost:3000/";
  index: string;
  quantit: number;
  display = "none";
  cart = {
    quantity: null,
    price: null,
    userId: ""
  };
  u;
  constructor(private apiservice: ApiService) {
  }

  ngOnInit() {
    this.listener = this.apiservice
    .getNewListener()
      .subscribe(isAuthenticated => {
        console.log('going to call makeTrue');
        // this.makeTrue(isAuthenticated);
        this.u = isAuthenticated;
      });
  }
  open(o, prdct) {
    this.index = prdct._id;

    this.cart.price = prdct.price;
    this.display = "block";
  }
  close() {
    this.display = "none";
  }

  sub() {
    console.log(this.cart);
    console.log(this.index);
    this.cart.userId = this.apiservice.getUserId();
    this.apiservice.cartadd(this.cart, this.index).subscribe(data => {
      console.log(this.index);
      this.apiservice.totalItem(this.cart);
    });
  }
}
