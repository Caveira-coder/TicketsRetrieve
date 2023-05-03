import { Component, ViewChild } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  @ViewChild("location") location:any;


  constructor(){}

  dis():void {
    console.log("111");
    
    console.log(this.location.nativeElement);
    this.location.nativeElement.value="";
    // this.location.nativeElement.disabled=true;
    $(this.location.nativeElement).prop("disabled",true);
  }

}
