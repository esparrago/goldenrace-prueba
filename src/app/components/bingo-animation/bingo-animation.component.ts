import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data/shared-data.service';
import { Engine, Render, World, Bodies, Body, Runner, Events} from 'matter-js';
import { boolean } from 'mathjs';

@Component({
  selector: 'app-bingo-animation',
  templateUrl: './bingo-animation.component.html',
  styleUrls: ['./bingo-animation.component.scss']
})
export class BingoAnimationComponent implements OnInit {
  
  //General Options
  ballotNumber : number;
  ballotRadius : number;
  canvasWidth  : number;
  canvasHeight : number;

  //Component Variables
  engine: any;
  runner: any;
  render: any;
  balls : any;
  animationEvent: any;
  canvasElement: any;
  baseOn: boolean;

  @Input() startAnimation:boolean;

  constructor(private sdService:SharedDataService) {
    this.ballotNumber = 10;
    this.ballotRadius = 20;
    this.canvasWidth  = 380;
    this.canvasHeight = 380;
    this.engine = Engine.create();
    this.runner = Runner.run(this.engine);
    this.balls  = [];
    this.baseOn = false;
    this.startAnimation = false;
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['startAnimation'].currentValue == true) {
      this.startBlow();
    }
  }

  initialize() {
    this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    
    //Initialize render Matterjs (Constructor is to early for DOM to put it there)
    this.render = Render.create({
      canvas: this.canvasElement,
      engine: this.engine,
      options: {
        wireframes: false,
        width: this.canvasWidth,
        height: this.canvasHeight,
        background: 'cover',
      }
    })

    //Add ballotNumber of balls to the canvas
    for (let i = 0; i < this.ballotNumber; i++) {
      World.add(this.engine.world, this.createBall(i+1));
    }
    
    //Initialize canvas Matterjs
    Runner.run(this.engine);
    Render.run(this.render);
    this.addBounds();
  }


  //Create Ball
  createBall(n:number) {
    const ball = Bodies.circle(
      this.render.canvas.width / 2 - this.ballotRadius,
      this.render.canvas.height / 2 - 2 * this.ballotRadius,
      this.ballotRadius, {
        restitution: 1.03,
        render: {
          sprite: {
            texture: `~src/assets/img/balls/${ n }.png `,
            xScale:0.5, 
            yScale:0.5
          }
        }
      })

    //Adds balls to array for later modifications;  
    this.balls.push(ball);
    return ball
  }

  startBlow(){
    const ballResult = this.sdService.ballResult.value;

    //Change img to lights on
    this.baseOn = true;

    //Execute airblow every render's tick
    this.animationEvent = Events.on(this.runner, 'tick', (e) =>this.airBlow());

    let count = this.ballotNumber - 1;
    
    //Wait 1sec to start removing balls every 0.5sec  
    setTimeout(() => {
      const interval = setInterval(()=> {
        if(count+1 !== ballResult) {
          World.remove(this.engine.world,this.balls[count]);
          this.balls[count] = null;
        }
        if (count == 0) clearInterval(interval);
        --count;
      }, 1000)
    }, 500);


    //Stop animation after 10Sec
    setTimeout(() => {
      Events.off(this.runner, 'tick', this.animationEvent);
      this.sdService.animationEnded.next(true);

      //Create subscription to reset 
      const suscription = this.sdService.resetGame.subscribe( (reset:boolean) => {
        if (!reset) return;
        this.reset(ballResult);
        suscription.unsubscribe();
      });
    }, 10000);

    
  }

  //Simulate "air blow", apply force to simulate air blowing using Matterjs; 
  airBlow() {
    const force = 0.010;
    this.balls.forEach((ball:any) => {
      if (ball?.position.y >= this.render.canvas.height - 100) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force*1.5, y: -force })
      }
      if (ball?.position.y < 120) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }

      if (ball?.position.x < 80) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force, y: -force })
      }

      if (ball?.position.x > this.render.canvas.width - 80) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }
    })
  }

  stopAirBlow(){
    Events.off(this.runner, 'tick', this.animationEvent);
  }

  reset(ball:number) {
    World.remove(this.engine.world,this.balls[ball-1]);
    
    //clear balls array
    this.balls = [];
    
    //Change img to lights off
    this.baseOn = false;

    for (let i = 0; i < this.ballotNumber; i++) {
      World.add(this.engine.world, this.createBall(i+1));
    }
  }

  //add rect body to canvas
  addBody(...bodies:any){
    World.add(this.engine.world, bodies);
  }

  //add a rect as body (for collisions)
  addRect({ x = 0, y = 0, w = 10, h = 10, options = {} }){
    const body:any = Bodies.rectangle(x, y, w, h, options);
    this.addBody(body);
    return body
  }

  //Add bounds to balls to collision, for this we have to make a mesh of rects forming a circle
  addBounds() {
    const sW = this.canvasWidth
    const sH = this.canvasHeight
    const m = Math.min(sW, sH)
    const rat = 1 / 4.5 * 2
    const r = m * rat
    const pegCount = 64
    const TAU = Math.PI * 2

    //Get each rect of mesh to draw position 
    for (let i = 0; i < pegCount; i++) {

      const segment = TAU / pegCount
      const angle2 = i / pegCount * TAU + segment / 2
      const x2 = Math.cos(angle2)
      const y2 = Math.sin(angle2)
      const cx2 = x2 * r + sW / 2
      const cy2 = y2 * r + sH / 2
      
      //Assing paramters to create each rect of mesh to draw
      this.addRect({
        x: cx2,
        y: cy2,
        w: 100 / 1000 * m,
        h: 3000 / 1000 * m,
        options: {
          angle: angle2,
          isStatic: true,
          density: 1,
          render: {
            fillStyle: 'transparent',
            strokeStyle: 'black',
            lineWidth: 0
          }
        }
      })
    }
  }
}
