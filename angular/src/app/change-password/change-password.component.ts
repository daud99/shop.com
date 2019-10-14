import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/services/requestApi.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  password: string = "";
  rpassword: string = "";
  phonenumber: string = "";
  invalid_pass: boolean;
  invalid_rpass: boolean;
  currentusername;
  p;
  userid;
  u;
  msg;
  chk1: boolean;
  checkallalphabet = /^[A-Za-z]+$/;
  constructor(private apiservice: ApiService) { }

  ngOnInit() {
    this.getUsername();
    var only1 = false;
    var only2 = false;
    var only3 = false;
    var pascheck = "The password must comply with the following:";
    var l1 = "It contain atleast 1 character other than alphabet.";
    var l2 = "Password length must be greater than 9.";
    var l3 = "Both field of password must match.";

    $('#passwordid').click(function () {
      $('#pcli').css('display', 'block');
      $('#check2').css('display', 'block');
      var h = $('#passwordid').val();
      if (h == null || h === "") {
        $('#check2').html(pascheck);
        if (only1 === false) {
          $('#pcli').append('<li id="l11">' + l1 + '</li>');
          only1 = true;
        }
        if (only2 === false) {
          $('#pcli').append('<li id="l12">' + l2 + '</li>');
          only2 = true;
        }
        if (only3 === false) {
          $('#pcli').append('<li id="l13">' + l3 + '</li>');
          only3 = true;
        }
      }
    });


    $('#passwordid').keyup(function () {
      $('#pcli').css('display', 'block');
      $('#check2').css('display', 'block');
      $('#check2').html(pascheck);
      if (only1 === false) {
        $('#pcli').append('<li id="l11">' + l1 + '</li>');
        only1 = true;
      }
      if (only2 === false) {
        $('#pcli').append('<li id="l12">' + l2 + '</li>');
        only2 = true;
      }
      if (only3 === false) {
        $('#pcli').append('<li id="l13">' + l3 + '</li>');
        only3 = true;
      }



      var v = $('#passwordid').val();
      var checkallalphabe = /^[A-Za-z]+$/;
      if (v.match(checkallalphabe)) {
        $('#l11').addClass("text-danger");
      }
      else if (v !== "" && v != null) {
        $('#l11').removeClass("text-danger");
        $('#l11').remove();
        only1 = false;
      }
      v = v.length;
      if (v <= 8) {
        $('#l12').addClass("text-danger");
      }
      if (v > 8) {
        $('#l12').removeClass("text-danger");
        $('#l12').remove();
        only2 = false;
      }

      $('#rpasswordid,#passwordid').keyup(function () {

        var password = $('#passwordid').val();
        var rpassword = $('#rpasswordid').val();

        if (password !== rpassword) {
          if (only3 === false) {
            $('#pcli').append('<li id="l13">' + l3 + '</li>');
            only3 = true;
          }
          $('#l13').addClass("text-danger");
        }
        else {
          $('#l13').removeClass("text-danger");
          $('#l13').remove();
          $('#check2').html('');
          only3 = false;
          $('#pcli').css('display', 'none');
          $('#check2').css('display', 'none');
        }
      });
    });
  }
  onSubmit() {
    this.p = { username: this.currentusername , password: this.password };
    console.log('new password is below');
    console.log(this.p);
    this.apiservice.changePassword(this.p).subscribe(result => {
      console.log(result);
      this.msg = result.message;
      this.password = '';
      this.rpassword = '';
    });
  }
  getUsername() {
    console.log('hello');
    this.userid = this.apiservice.getUserId();
    this.apiservice.showUserInfo(this.userid).subscribe(response => {
      console.log(response.username);
      this.currentusername = response.username;
    });
  }
}

