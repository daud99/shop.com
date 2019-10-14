import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  orders;
  usertype;
  userid;
  msg;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.displayOrders();
  }
  orderDel(orderid) {
    this.apiservice.delorder(orderid).subscribe(data => {
      console.log(data);
      this.displayOrders();
      this.msg = data.message;
    });
  }
  displayOrders() {
    this.usertype = this.apiservice.getUserType();
    this.userid = this.apiservice.getUserId();
    if (this.usertype === 'admin') {
      console.log('i am going to get orders for admin');
      this.apiservice.getAllOrders().subscribe(result => {
        this.orders = result;
        console.log('yes we do get all the orders by the api which are below');
        console.log(this.orders);
      });
    } else {
      console.log('i am going to get orders for current user');
      this.apiservice.getCurrentUserOrders(this.userid).subscribe(result => {
        this.orders = result;
        console.log('yes we do get all the orders by the api which are below');
        console.log(this.orders);
      });
    }
  }
}
