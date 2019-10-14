import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/requestApi.service';
import { Msg } from '../../msg.model';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: "app-view-msg",
  templateUrl: "./view-msg.component.html",
  styleUrls: ["./view-msg.component.css"]
})
export class ViewMsgComponent implements OnInit {
  msgs: Msg[] = [];
  text;
  // htmlSnippet = '<script>alert(1)</script>';
  constructor(private apiservice: ApiService, protected sanitizer: DomSanitizer) { }
  s = '<script>alert(1)</script>';
  ngOnInit() {
    this.display();
   }
  display() {
    this.apiservice.getMsgs()
      .subscribe((msgData) => {
        this.msgs = msgData.msgs;
        console.log(this.msgs);
      });
  }
  msgDel(a) {
    this.apiservice.delmsg(a).subscribe(data => {
      console.log(data);
      this.display();
    });
  }
  sss() {
    this.text = this.sanitizer.bypassSecurityTrustHtml('<script>alert(1)</script>');
   }
}
