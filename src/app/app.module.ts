import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { BingoAnimationComponent } from './components/bingo-animation/bingo-animation.component';
import { BallSelectorComponent } from './components/ball-selector/ball-selector.component';

//Services
import { AudioService } from './services/audio/audio.service';
import { BetSlipComponent } from './components/bet-slip/bet-slip.component';
import { ResultsComponent } from './components/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BingoAnimationComponent,
    BallSelectorComponent,
    BetSlipComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
