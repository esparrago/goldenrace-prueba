import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  startAnimation:boolean;

  constructor() {
    this.startAnimation = false;
  }

  ngOnInit(): void {

  }

  start(started:boolean){
    this.startAnimation = started;
  }

}
