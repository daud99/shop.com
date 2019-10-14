import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ApiService } from '../../services/requestApi.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.css']
})
export class OrderTrackerComponent implements OnInit {
  myForm: FormGroup;
  order;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    $(document).ready(function () {
      $('#b').click(function () {
        $('#a').css('display', 'none');
        $('#c').css('display', 'block');
      });
    });
    
    this.myForm = new FormGroup({
      'orderno': new FormControl(null, { validators: [Validators.required] })
    });
  }
  onSubmit() {
    if (this.myForm.invalid) {
      console.log('form is invalid');
      console.log(this.myForm.value);
      return;
    }
    console.log('its a valid form');
    console.log(this.myForm.value);
    this.apiservice.trackOrder(this.myForm.value.orderno).subscribe(result => {
      console.log('we do get the order in response');
      console.log(result);
      this.order = result;
    });
}
}
