import { Circle, Join } from './geometry';
const	canvas = document.querySelector("canvas") as HTMLCanvasElement;
const	ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circle1 = new Circle(50, 60, 30, "rgb(255,0,0)");
const circle2 = new Circle(150, 90, 30, "rgb(255,255,255)");
const joint = new Join(circle1, circle2, [100, 200], "rgb(0,0,0)");
circle1.draw(ctx);
circle2.draw(ctx);
joint.draw(ctx);
