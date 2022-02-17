import { Component, OnInit } from '@angular/core';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-ball-animation-component',
  templateUrl: './ball-animation-component.component.html',
  styleUrls: ['./ball-animation-component.component.scss']
})
export class BallAnimationComponentComponent implements OnInit {

  //General Options
  BALLS_COUNT  : number = 10;
  BALL_RADIUS  : number = 20;
  CANVAS_WIDTH : number = 380;
  CANVAS_HEIGHT: number = 380;

  //Matterjs Classes
  Engine = Matter.Engine;
  Render = Matter.Render;
  World  = Matter.World;
  Bodies = Matter.Bodies;
  Body   = Matter.Body;
  Runner = Matter.Runner;
  Events = Matter.Events;

  //Component Variables
  engine = this.Engine.create();
  runner = this.Runner.run(this.engine);
  render: any;
  balls : any = [];
  animationEvent: any;
  canvasElement: any;

  constructor() {
    
  }

  ngOnInit(): void {
   this.initialize();
  }

  initialize() {
    this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    
    //Create render Matterjs (Constructor is to early to put it there)
    this.render = this.Render.create({
      canvas: this.canvasElement,
      engine: this.engine,
      options: {
        wireframes: false,
        width: this.CANVAS_WIDTH,
        height: this.CANVAS_HEIGHT,
        background: 'cover',
      }
    })

    //Add BALLS_COUNT of balls to the canvas
    for (let i = 0; i < this.BALLS_COUNT; i++) {
      this.World.add(this.engine.world, this.createBall());
    }

    //Initialize canvas Matterjs
    this.Runner.run(this.engine);
    this.Render.run(this.render);
    this.addBounds();

    //Wait 3 seconds to "air blow"
    setTimeout(() => {
      //Execute function every tick
      console.log("start");
      this.animationEvent = this.Events.on(this.runner, 'tick', (e) =>this.airBlow())
    }, 3000);

    setTimeout(() => {
      console.log("stop");
      this.Events.off(this.runner, 'tick', this.animationEvent);
    }, 8000);

    setTimeout(() => {
      this.World.remove(this.engine.world,this.balls[2]);
    }, 12000);



    
  }


  //Create Ball
  createBall() {
    const ball = this.Bodies.circle(
      //Positioning every ball 
      this.render.canvas.width / 2 - this.BALL_RADIUS,
      this.render.canvas.height / 2 - 2 * this.BALL_RADIUS,

      this.BALL_RADIUS, {
        restitution: 1.03,
        render: {
          sprite: {
            texture: "../../assets/img/1.png",
            xScale:0.5, 
            yScale:0.5
          }
        }
      })

    //Adds balls to array for later modifications;  
    this.balls.push(ball);
    return ball
  }

  //Simulate "air blow". Depending of the location of the ball, apply force to simulate air blowing using Matterjs; 
  airBlow() {
    console.log('airBlow');
    const force = 0.008;
    this.balls.forEach((ball:any) => {
      if (ball.position.y >= this.render.canvas.height - 100) {
        this.Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force*1.5, y: -force })
      }
      if (ball.position.y < 120) {
        this.Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }

      if (ball.position.x < 80) {
        this.Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: force, y: -force })
      }

      if (ball.position.x > this.render.canvas.width - 80) {
        this.Body.applyForce(ball, { x: ball.position.x, y: ball.position.y }, { x: -force, y: force })
      }
    })
  }

  stopAirBlow(){
    console.log("stop");
    this.Events.off(this.runner, 'tick', this.animationEvent);
  }

  //add rect body to canvas
  addBody(...bodies:any){
    this.World.add(this.engine.world, bodies);
  }

  //add a rect as body (for collisions)
  addRect({ x = 0, y = 0, w = 10, h = 10, options = {} }){
    const body:any = this.Bodies.rectangle(x, y, w, h, options);
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
    for (let i = 0; i < pegCount; i++) {
      
      //Get each rect of mesh to draw position 
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
