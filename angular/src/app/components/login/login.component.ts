import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/requestApi.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  mage: string;
  user = {
    username: '',
    password: ''
  };
  feedback: string;
  private mageListenerSubs: Subscription;
  constructor(private apiservice: ApiService , private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.feedback = params.error;
      });
      this.mageListenerSubs = this.apiservice
      .getMageListener()
      .subscribe(msg => {
        console.log('can you see the message below');
        console.log(msg);
        this.mage = msg;
      });
    var count = 0;
    $("#loginForm").submit(function() {
      var username = $("#usernameid").val();
      var password = $("#passwordid").val();
      if (username === "" || username == null) {
        $("#userpopup").css("visibility", "visible");
        $("#usernameid").addClass("is-invalid");
        return false;
        count = count + 1;
      }

      if (password === "" || (password == null && count !== 1)) {
        $("#userpopup").css("visibility", "hidden");
        $("#usernameid").removeClass("is-invalid");
        $("#passwordpopup").css("visibility", "visible");
        $("#passwordid").addClass("is-invalid");
        return false;
      }
    });
    $("body").click(function() {
      $("#userpopup").toggle();
      $("#passwordpopup").toggle();
    });
  }
  onSubmit() {
    if (this.user.username.length <= 5 || this.user.password.length === 0) {
      return;
    }
    this.apiservice.verifyUser(this.user);
  //  if (this.apiservice.mage !== '') {
  //     this.mage = this.apiservice.mage;
  //   }
    }
  }
