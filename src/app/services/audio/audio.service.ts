import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playFX(name:string){
    let audio = new Audio();
    audio.src = "../../../assets/audio/alarm.wav";
    audio.load();
    audio.play();
  }
}
