import { Component, OnInit } from '@angular/core';
import {randomInt} from 'mathjs'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const randomNum = randomInt(1,11);
    console.log(randomNum);
  }

}
