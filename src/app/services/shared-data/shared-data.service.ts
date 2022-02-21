import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject} from 'rxjs';
import {randomInt} from 'mathjs';
import { FormData } from 'src/app/models/form-data/form-data';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  //Shared Obsevables
  betFormData: Subject<FormData>   = new Subject<FormData>();   //Form data
  animationEnded: Subject<boolean> = new Subject<boolean>();    //Trigged when animation ended
  ballResult: BehaviorSubject<any> = new BehaviorSubject(null); //Result of Random Number PRNG, null until game starts 
  resetGame: Subject<boolean> = new Subject<boolean>();         //Reset the game
  
  //Properties of class
  bettedData: {ball: string; bet: string};


  constructor() {
    this.bettedData = {
      ball: "",
      bet: "" 
    };
  }

  getRandomInt(){
    const randomNum = randomInt(1,11);
    this.ballResult.next(randomNum);
  }

}
