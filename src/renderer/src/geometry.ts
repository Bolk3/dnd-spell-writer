class Circle {
	xCenter:		number;
	yCenter:		number;
	radius:			number;
	strokeWidth:	number;
	color:			string;

	constructor(x: number,
				y: number,
				r?: number,
				color?: string,
				strokeWidth?: number)
	{
		this.xCenter = x;
		this.yCenter = y;
		r ? this.radius = r : this.radius = 5;
		color ? this.color = color : this.color = "rgb(0,0,0)";
		strokeWidth ? this.strokeWidth = strokeWidth : this.strokeWidth = 5;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.lineWidth = this.strokeWidth;
		ctx.beginPath();
		ctx.arc(this.xCenter, this.yCenter, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
}

class Join {
	node1:			Circle;
	node2:			Circle;
	linear:			boolean;
	strokeWidth:	number;
	color:			string;
	
	constructor(node1: Circle,
				node2: Circle,
				color?:string,
				linear?: boolean,
				strokeWidth?: number)
	{
		this.node1 = node1;
		this.node2 = node2;
		linear ? this.linear = true : this.linear = false;
		color ? this.color = color : this.color = "rgb(0,0,0)";
		strokeWidth ? this.strokeWidth = strokeWidth : this.strokeWidth = 5;
	}	

	getCoords(p1:Circle | [number, number]): [number, number]{
		if (p1 instanceof Circle)
			return [p1.xCenter, p1.yCenter];
		return (p1);
	}

	getDistance(p1: [number, number] | Circle,
				p2: [number, number] | Circle
			   ): number {
		let [x1, y1] = this.getCoords(p1);
		let [x2, y2] = this.getCoords(p2);

		let uX = x2 - x1;
		let uY = y2 - y1;

		let norm = Math.sqrt((uX**2) + (uY**2));
		return (norm);
	}
	
	getIntersect(c1: Circle ,
				 c2: Circle ,
				): [[number, number],[number, number]] {
		// get radius
		const radius1 = c1.radius;
		const radius2 = c2.radius;
		// get center of circle
		const center1 = this.getCoords(c1);
		const center2 = this.getCoords(c2);
		// get director vector u
		const uX = center2[0] - center1[0];
		const uY = center2[1] - center1[1];
		// get normal
		const norm = Math.sqrt((uX**2) + (uY**2));
		if (norm === 0) return [center1, center2];
		// get unit vector
		const vX = uX / norm;
		const vY = uY / norm;
		// return unit vector * radius for each
		let r1: [number, number] = [
			center1[0] + vX * radius1,
			center1[1] + vY * radius1
		];

		let r2: [number, number] = [
			center2[0] - vX * radius2,
			center2[1] - vY * radius2
		];
		return [r1, r2];
	}

	calcArcCenter(p1: [number, number] | Circle,
				  p2: [number, number] | Circle,
				  r: number
				 ) : [number, number] {
		const [x1, y1] = this.getCoords(p1);
		const [x2, y2] = this.getCoords(p2);

		const mX = (x1 + x2)/2;
		const mY = (y1 + y2)/2;

		const dx = x2 - x1;
		const dy = y2 - y1;
		const d = Math.sqrt(dx*dx + dy*dy);
		if (d > 2 * r) throw new Error("too small radius");
		const h = Math.sqrt(r*r - (d/2)**2);

		const ux = -dy / d;
		const uy = dx / d;

		return [
			mX + h * ux,
			mY + h * uy
		]
	}

	getAngle(A: [number, number],
			 B: [number, number],
			 C: [number, number]
			){
		const [cx, cy] = C;
		const [bx, by] = B;
		const [ax, ay] = A;

		const startAngle = Math.atan2(ay - cy, ax - cx);
		const endAngle = Math.atan2(by - cy, bx - cx);

		let diff = endAngle - startAngle;

		if (diff > Math.PI) diff -= 2 * Math.PI;
		if (diff < -Math.PI) diff += 2 * Math.PI;

		return {
			startAngle,
			endAngle,
			diff
		};
	}

	toRad(x: number) {
		return (x * (Math.PI/180));
	}

	draw(ctx: CanvasRenderingContext2D) {
		const intersect = this.getIntersect(this.node1, this.node2);
		const arcCenter = this.calcArcCenter(intersect[0], 
											 intersect[1],
											 this.getDistance(intersect[0], intersect[1]));
		const arcAngle = this.getAngle(intersect[0], intersect[1], arcCenter);
		ctx.lineWidth = this.strokeWidth;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		if (this.linear) {
			ctx.moveTo(intersect[0][0], intersect[0][1]);
			ctx.lineTo(intersect[1][0], intersect[1][1]);
		} else {
			ctx.arc(arcCenter[0],
					arcCenter[1], 
					this.getDistance(intersect[0], arcCenter),
				   arcAngle.startAngle,
				   arcAngle.endAngle
				   );
		}
		ctx.stroke();
	}
}

export { Circle, Join };
