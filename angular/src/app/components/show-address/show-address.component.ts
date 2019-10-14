import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';

@Component({
  selector: 'app-show-address',
  templateUrl: './show-address.component.html',
  styleUrls: ['./show-address.component.css']
})
export class ShowAddressComponent implements OnInit {
  addresses;
  userid;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.userid = this.apiservice.getUserId();
    this.apiservice.getAddresses(this.userid).subscribe(result => {
      this.addresses = result.address;
    });
  }

}
