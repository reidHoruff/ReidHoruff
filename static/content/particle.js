var canvas, ctx,
balls = new Array(), 
mousex, 
mousey,
downx,
downy,
upx,
upy,
gravity = .15,
explosionPower = 4,
friction = .995,
color = "rgba(50,00,100,0.8)";

function init()
{
	canvas = document.getElementById("particle-canvas");
	canvas.width = window.innerWidth * 0.6;
	canvas.height = 400;
	
	ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	
	document.onmousemove = function(ev){
		if( ev.offsetX){
			mousex = ev.offsetX; 
			mousey = ev.offsetY;
		}
		else{
			mousex = ev.layerX; 
			mousey = ev.layerY;
		}
	};
	
	document.onmousedown = function(ev){		
		for(var x=0; x < balls.length; x++){
			balls[x].explode();
		}
	};
}

function fillBalls(width, height)
{
	var padding = 10;
	var hspacing = ((canvas.width - (padding*2))/(width-1));
	var vspacing = ((canvas.height - (padding*2))/(height-1));
	
	for(var y=0; y < width; y++){
		for(var x=0; x < height; x++){
			balls.push( new ball(padding + (hspacing*x), padding + (vspacing*y), 0, 0) );
		}
	}
}

function start()
{
	balls = new Array();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	fillBalls(60, 60);
	setInterval(loop, 10);
}

function ball(x, y, xm, ym)
{
	this.xpos = x;
	this.ypos = y;
	this.xmove = xm;
	this.ymove = ym;
	
	/*functions*/
	this.explode = ballExplode;
	this.move = ballMove;
}

function ballExplode()
{
	var xdis = mousex-this.xpos;
	var ydis = mousey-this.ypos;
	var dis = Math.sqrt( xdis*xdis + ydis*ydis );
	
	this.xmove -= (xdis*explosionPower)/dis;
	this.ymove -= (ydis*explosionPower)/dis;
}

function ballMove()
{
	var xdis = mousex-this.xpos;
	var ydis = mousey-this.ypos;
	var dis = Math.sqrt( xdis*xdis + ydis*ydis );
	
	this.xmove += (xdis*gravity)/dis;
	this.ymove += (ydis*gravity)/dis;
	
	this.xpos += this.xmove;
	this.ypos += this.ymove;
	
	this.xmove *= friction;
	this.ymove *= friction;
}

function loop()
{	
	for( var x=0; x < balls.length; x++){
		var b = balls[x];
		ctx.clearRect(b.xpos-1, b.ypos-1, 3, 3);
	}
	
	for(var x=0; x < balls.length; x++){
		var currBall = balls[x];
		currBall.move();
		ctx.fillRect(currBall.xpos, currBall.ypos, 1, 1);
	}
	
	ctx.closePath();
	ctx.fill();
}
