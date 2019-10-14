import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userid: string;
  username: string;
  phonenumber: string;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.callShowUser();
  }
  callShowUser() {
    this.userid = this.apiservice.getUserId();
    this.apiservice.showUserInfo(this.userid).subscribe(response => {
      console.log(response.username);
      this.username = response.username;
      this.phonenumber = response.phonenumber;
    });
  }
}
