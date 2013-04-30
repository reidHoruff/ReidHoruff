var random_int = function(min, max){
	var range = max-min;

	return Math.floor(Math.random()*range) + min;
}

function ParticleAnimation(canvas, width, height){

	this.canvas = canvas;
	this.canvas.width = width;
	this.canvas.height = height;
	this.canvas_rect = this.canvas.getBoundingClientRect();
	this.canvas.onselectstart = function () { return false; }

	this.context = this.canvas.getContext("2d");

	this.color = "rgba(255,255,255,0.3)";
	this.context.fillStyle = this.color;

	this.mousex;
	this.mousey;
	this.downx;
	this.downy;
	this.upx;
	this.upy;

	this.balls = new Array();
	this.friction = .99999;
	this.gravity = .09;
	this.explosionPower = 6;

	this.explosions = new Array();

	this.grav_point_index = 0;
	this.grav_points = [[random_int(0, 400), 50], [random_int(400, 800), 100], [random_int(800, 1200), 0], [random_int(1200, 1600), 20]];
	console.log(this.grav_points);

	this.iterations = 0;
	this.loop_delay = 25;

	var self = this;

	this.start = function()
	{
		this.balls = new Array();
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.fillBalls(25, 70, 20);

		var self = this;

		setInterval(function(){ self.loop(); }, this.loop_delay);
	}

	document.onmousemove = function(ev){
		var mousex = ev.clientX - self.canvas_rect.left;
		var mousey = ev.clientY - self.canvas_rect.top;
		var inside = mousey >= 0 && mousex >= 0 && mousex < self.canvas.width && mousey < self.canvas.height;

		if(inside && Math.random() < 0.2){
			var xm = ((Math.random()*2)-1.0)*0.1;
			var ym = ((Math.random()*2)-1.0)*0.1;
			self.balls.push(new ball(mousex, mousey, xm, ym, self));
		}
	};

	document.onmousedown = function(ev){
		var mousex = ev.clientX - self.canvas_rect.left;
		var mousey = ev.clientY - self.canvas_rect.top;
		var inside = mousey >= 0 && mousex >= 0 && mousex < self.canvas.width && mousey < self.canvas.height;

		if(inside){
			self.explosions.push(new explosion(mousex, mousey, 0, self));
		}
	};

	this.loop = function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = this.color;
		
		for(var index in this.balls){
			var currBall = this.balls[index];
			currBall.move(Math.floor(this.iterations/100)%3 == 0);

			for(var index in this.explosions){
				var e = this.explosions[index];

				if(e.hits(currBall)){
					currBall.explode();
				}
			}

			currBall.draw();
		}

		this.context.closePath();

		for(var index in this.explosions){
			var e = this.explosions[index];

			if(e.active){
				e.expand();
				e.draw();
			}
		}

		this.grav_point_index++;
		this.grav_point_index %= this.grav_points.length;
		
		this.iterations++;
	}

	this.fillBalls = function(spacing, width, height)
	{
		var x_start = ((this.canvas.width) - (spacing*width))/2; 
		var y_start = ((this.canvas.height) - (spacing*height))/2; 

		var hspacing = ((this.canvas.width - (spacing*2))/(width-1));
		var vspacing = ((this.canvas.height - (spacing*2))/(height-1));
		
		for(var y=0; y < height; y++){
			for(var x=0; x < width; x++){
				this.balls.push( new ball(x_start + (spacing*x), y_start + (spacing*y), 0, 0, this) );
			}
		}
	}
}

function explosion(x, y, r, container){
	this.x = x;
	this.y = y;
	this.radius = r;
	this.active = true;
	this.container = container;

	this.max_radius = 500;

	this.expand = function(){
		if(this.radius > this.max_radius){
			this.active = false;
		}

		this.radius += 3.9;
	}

	this.draw = function(){
		this.container.context.beginPath();
		this.container.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		this.container.context.strokeStyle = '#aaaaaa';
		this.container.context.lineWidth = ((this.max_radius-(this.radius+100))/this.max_radius)*5+1;
		this.container.context.closePath();
		this.container.context.stroke();
	}

	this.hits = function(ball){
		if(!this.active){
			return false;
		}

		return Math.abs((ball.dist(this.x, this.y) - this.radius)) <= 1;
	}
}

function ball(x, y, xm, ym, container)
{
	this.x_origin = x;
	this.y_origin = y;
	this.been_inside = false;

	this.size = 0;

	this.xpos = x;
	this.ypos = y;
	this.xmove = xm;
	this.ymove = ym;

	this.container = container;
	
	/*functions*/
	this.explode = function(){
		this.xmove *= (Math.random() < 0.5) ? 2: -1.2
		this.ymove *= (Math.random() < 0.5) ? 1.2: -2
	}

	this.move = function(apply_gravity){

		if(apply_gravity){
			var xdis = this.container.grav_points[this.container.grav_point_index][0]-this.xpos;
			var ydis = this.container.grav_points[this.container.grav_point_index][1]-this.ypos;
			var dis_sq = Math.max(3, xdis*xdis + ydis*ydis);
			
			this.xmove += (xdis*this.container.gravity)/dis_sq;
			this.ymove += (ydis*this.container.gravity)/dis_sq;
		}
		
		this.xpos += this.xmove;
		this.ypos += this.ymove;
		this.xmove *= this.container.friction;
		this.ymove *= this.container.friction;

		var outside = (this.xpos+this.size < 0) || (this.ypos+this.size < 0) || (this.xpos >= this.container.canvas.width) || (this.ypos >= this.container.canvas.height);

		if(outside){
			if(this.been_inside){
				this.been_inside = false;
				this.xpos = this.x_origin;
				this.ypos = this.y_origin;
				this.xmove = 0;
				this.ymove = 0;			
			}
		}else{
			this.been_inside = true;
		}

		this.size = 0.2 + (Math.abs(this.xmove) + Math.abs(this.ymove))*10;
	}

	this.draw = function(){
		this.container.context.fillRect(this.xpos, this.ypos, this.size, this.size);
/*		this.container.context.beginPath();
		this.container.context.arc(this.xpos, this.ypos, this.size/2, 0, 2*Math.PI, true);
		this.container.context.strokeStyle = '#aaaaaa';
		this.container.context.fill();
		this.container.context.lineWidth = 0;
		this.container.context.closePath();
		this.container.context.stroke();
*/	}

	this.dist = function(x, y){
		return Math.sqrt((this.xpos-x)*(this.xpos-x) + (this.ypos-y)*(this.ypos-y));
	}
}
