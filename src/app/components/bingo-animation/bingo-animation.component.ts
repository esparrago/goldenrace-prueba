import { Component, OnInit, Input, SimpleChanges} from '@angular/core';
import { Engine, Render, World, Bodies, Body, Runner, Events} from 'matter-js';

@Component({
  selector: 'app-bingo-animation',
  templateUrl: './bingo-animation.component.html',
  styleUrls: ['./bingo-animation.component.scss']
})
export class BingoAnimationComponent implements OnInit {

  //General Options
  BALLS_COUNT  : number = 10;
  BALL_RADIUS  : number = 20;
  CANVAS_WIDTH : number = 380;
  CANVAS_HEIGHT: number = 380;

  //Component Variables
  engine = Engine.create();
  runner = Runner.run(this.engine);
  render: any;
  balls : any = [];
  animationEvent: any;
  canvasElement: any;
  baseOn: boolean = false;

  @Input() startAnimation:boolean = false;

  constructor() {
    
  }

  ngOnInit(): void {
   this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['startAnimation'].currentValue == true) {
      this.startBlow();
    }
  }

  initialize() {
    this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    
    //Create render Matterjs (Constructor is to early to put it there)
    this.render = Render.create({
      canvas: this.canvasElement,
      engine: this.engine,
      options: {
        wireframes: false,
        width: this.CANVAS_WIDTH,
        height: this.CANVAS_HEIGHT,
        background: 'cover',
      }
    })

    //Wait 0.5 seconds (UX, users ussually don't see inmediatly after load)
    setTimeout(() => {
      //Add BALLS_COUNT of balls to the canvas
      for (let i = 0; i < this.BALLS_COUNT; i++) {
        World.add(this.engine.world, this.createBall(i+1));
      }
    }, 1500);
    

    //Initialize canvas Matterjs
    Runner.run(this.engine);
    Render.run(this.render);
    this.addBounds();
  }


  //Create Ball
  createBall(n:number) {
    const ball = Bodies.circle(
      //Positioning every ball 
      this.render.canvas.width / 2 - this.BALL_RADIUS,
      this.render.canvas.height / 2 - 2 * this.BALL_RADIUS,

      this.BALL_RADIUS, {
        restitution: 1.03,
        render: {
          sprite: {
            texture: `../../assets/img/balls/${ n }.png `,
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
    //Execute function every tick
    console.log("start");
    this.baseOn = true;
    this.animationEvent = Events.on(this.runner, 'tick', (e) =>this.airBlow())

    setTimeout(() => {
      console.log("stop");
      Events.off(this.runner, 'tick', this.animationEvent);
    }, 10000);

    setTimeout(() => {
      World.remove(this.engine.world,this.balls[2]);
    }, 10000);
  }

  //Simulate "air blow". Depending of the location of the ball, apply force to simulate air blowing using Matterjs; 
  airBlow() {
    console.log('airBlow');
    const force = 0.008;
    this.balls.forEach((ball:any) => {
      if (ball.position.y >= this.render.canvas.height - 100) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force*1.5, y: -force })
      }
      if (ball.position.y < 120) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }

      if (ball.position.x < 80) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force, y: -force })
      }

      if (ball.position.x > this.render.canvas.width - 80) {
        Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }
    })
  }

  stopAirBlow(){
    console.log("stop");
    Events.off(this.runner, 'tick', this.animationEvent);
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
    const sW = this.CANVAS_WIDTH
    const sH = this.CANVAS_WIDTH
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
