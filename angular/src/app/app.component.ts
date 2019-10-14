import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/requestApi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular';
  constructor(private apiservice: ApiService) {}

  ngOnInit() {
    this.apiservice.autoAuthUser();
  }
}
