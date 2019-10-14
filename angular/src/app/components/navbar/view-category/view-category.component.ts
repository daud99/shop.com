import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/requestApi.service';
import { Product } from '../../../product.model';
@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class ViewCategoryComponent implements OnInit {
  private listener: Subscription;
  @Input() public product_array: Product[] = [];
  index: string;
  quantit: number;
  display = 'none';
  u = false;
  cart = {
    quantity:null,
    price: null,
    userId: ''
  }
  constructor(private MyService: ApiService, private router: Router) { }

  ngOnInit() {
    this.listener = this.MyService
    .getNewListener()
      .subscribe(isAuthenticated => {
        // console.log('going to call makeTrue');
        // // this.makeTrue(isAuthenticated);
        this.u = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.listener.unsubscribe();
  }


  open(o,prdct) {
    this.index = prdct._id.toString();
    this.cart.price = prdct.price;
    this.display = 'block';
  }
  close() {
    this.display = 'none';
  }

  sub() {
    this.cart.userId = this.MyService.getUserId();
    this.MyService.cartadd(this.cart, this.index).subscribe(data => {
      console.log(this.index);
      this.MyService.totalItem(this.cart);
    });
  }
}
