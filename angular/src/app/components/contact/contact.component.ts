import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';
@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.css"]
})
export class ContactComponent implements OnInit {
   message: string;
  msg = {
    name: '',
    email: '',
    message: ''
  };
  constructor(private apiservice: ApiService) {}

  ngOnInit() {}
  onSubmit() {
    this.apiservice.addMsg(this.msg).subscribe(msgData => {
      this.message = msgData.message;
      this.msg.name = '';
      this.msg.email = '';
      this.msg.message = '';
    });
  }
}
