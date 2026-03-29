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
	center:			[x:number, y:number];
	node1:			Circle;
	node2:			Circle;
	linear:			boolean;
	strokeWidth:	number;
	color:			string;
	
	constructor(node1: Circle,
				node2: Circle,
				center: [x:number, y:number],
				color?:string,
				linear?: boolean,
				strokeWidth?: number)
	{
		this.node1 = node1;
		this.node2 = node2;
		this.center = center;
		linear ? this.linear = true : this.linear = false;
		color ? this.color = color : this.color = "rgb(0,0,0)";
		strokeWidth ? this.strokeWidth = strokeWidth : this.strokeWidth = 5;
	}

	private getCoords(p: [number, number] | Circle): { x: number, y: number } {
		if (Array.isArray(p)) {
			return { x: p[0], y: p[1] };
		}
		return { x: p.xCenter, y: p.yCenter };
	}

	getLinearDistance(p1:[x:number, y:number] | Circle,
					  p2:[x:number, y:number] | Circle): number
	{
		var coord1: {x:number, y:number}, coord2: {x:number, y:number};

		coord1 = this.getCoords(p1);
		coord2 = this.getCoords(p2);
		const pointX = (coord2.x - coord1.x)**2;
		const pointY = (coord2.y - coord1.y)**2;
		return (Math.sqrt(pointX + pointY));
	}

	getIntersection(c1: [number, number] | Circle,
					r1: number,
					c2: [number, number] | Circle,
					r2: number
				   ): {pointA: [number, number], pointB: [number, number]} {
		const p1 = this.getCoords(c1);
		const p2 = this.getCoords(c2);
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist === 0) return { pointA: [p1.x, p1.y], pointB: [p2.x, p2.y] };
		const ux = dx / dist;
		const uy = dy / dist;
		const pointA: [number, number] = [
			p1.x + ux * r1,
			p1.y + uy * r1
		];
		const pointB: [number, number] = [
			p2.x - ux * r2,
			p2.y - uy * r2
		];
		return { pointA, pointB };
	}

	draw(ctx: CanvasRenderingContext2D) {
	}
}

export { Circle, Join };
