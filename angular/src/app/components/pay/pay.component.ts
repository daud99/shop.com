import { Component, OnInit ,NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ApiService } from '../../services/requestApi.service';
import { SearchService } from '../../services/search.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.css"]
})
export class PayComponent implements OnInit {
  // name: string;
  // message: string;
  // order = {
  //   ownerid: '',
  //   cust_name: '',
  //   total: 0,
  //   status: 'Pending'
  // };
  userid;
  totall;
  myForm: FormGroup;
  message;
  userId;
  data = {
    userId: ''
  };
  constructor(
    private apiservice: ApiService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    
    this.userid = this.apiservice.getUserId();
    this.apiservice.getTotalAmountToPay(this.userid).subscribe(result => {
      console.log('we got the total price to pay');
      console.log(result);
      this.totall = result.total;
    });
    this.myForm = new FormGroup({
      'customer_name': new FormControl(null, { validators: [Validators.required] }),
      'phonenumber': new FormControl(null, { validators: [Validators.required] }),
      'houseno': new FormControl(null, { validators: [Validators.required] }),
      'streetno': new FormControl(null, { validators: [Validators.required] }),
      'town': new FormControl(null, { validators: [Validators.required] }),
      'city': new FormControl(null, { validators: [Validators.required] }),
      'country': new FormControl(null, { validators: [Validators.required] }),
      '_id': new FormControl(this.userid, { validators: [Validators.required] }),
    });
  }
  /*onPayment() {
    console.log(value);
    /*console.log("yes");
    if (form.invalid) {
      console.log("no");
      this.message = "All fields must be filled";
      return;
    }
    if (this.message) {
      this.message = "";
    }
    this.name = form.value.username;
    this.order.ownerid = this.apiservice.getUserId();
    this.order.cust_name = this.name;
    console.log(this.order);
    this.searchService.placeOrder(this.order)
      .subscribe(result => {
        console.log(result);
      });
  }*/

  onPayment() {
    if (this.myForm.invalid) {
      console.log('form is invalid');
      console.log(this.myForm.value);
      return;
    }
    console.log('its a valid form');
    console.log(this.myForm.value);
    this.apiservice.pay(this.myForm.value.customer_name, this.myForm.value.phonenumber, this.myForm.value.houseno, this.myForm.value.streetno, this.myForm.value.town,this.myForm.value.city, this.totall, this.myForm.value.country, this.myForm.value._id).subscribe(result => {
      console.log('we tried to pay the bill');
      console.log(result);
      this.myForm.reset();
      this.message = result.message;
      this.totall = 0;
      this.data.userId = this.userid;
      this.apiservice.totalItem(this.data);
    });
  }

  }
