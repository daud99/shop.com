import { Component, OnInit } from '@angular/core';
import { faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../app/services/requestApi.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  faUser = faUser;
  faArrowLeft = faArrowLeft;
  userid: string;
  username: string = "";
  phonenumber: string = "";
  count: number = 0;
  invalid_name: boolean;
  invalid_no: boolean;
  checkallalphabet = /^[A-Za-z]+$/;
  user;
  message: string;
  error: string;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.callShowUser();
    var usercheck = 'Username length must be greater than 6';
    $('#usernameid').click(function () {
      var i = $('#usernameid').val();
      if (i == null || i === "") {
        $('#check1').html(usercheck);
      }
    });
    $('#usernameid').keyup(function () {
      $('#check1').html(usercheck);
      var v = $('#usernameid').val();
      v = v.length;
      if (v <= 6) {
        $('#check1').addClass("text-danger");
      }
      if (v > 6) {
        $('#check1').html('');
        $('#check1').removeClass("text-danger");
      }
    });
  }
  callShowUser() {
    this.userid = this.apiservice.getUserId();
    this.apiservice.showUserInfo(this.userid).subscribe(response => {
      console.log(response.username);
      this.username = response.username;
      this.phonenumber = response.phonenumber;
    });
  }
  onSubmit() {
    console.log('yes');
    this.userid = this.apiservice.getUserId();
    this.user = { userid: this.userid, username: this.username, phonenumber: this.phonenumber };
    // i am cemmenting above two lines in order to make csrf work
    // this.user = { username: this.username, phonenumber: this.phonenumber };
    console.log(this.user);
    if (this.username.length <= 5) {
      this.invalid_name = true;
      return false;
      this.count = this.count + 1;
    }
    if (this.phonenumber.length < 10) {
      this.invalid_name = false;
      this.invalid_no = true;
      return false;
    }
    this.apiservice.editUserInfo(this.user).subscribe(response => {
      console.log(response);
      if (response.message.length < 23)
      {
        this.message = response.message;
        this.error = null;
      }
      else
      {
        this.error = response.message;
        this.message = null;
        }

    });
  }
}
