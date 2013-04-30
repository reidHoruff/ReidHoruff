var canvas, 
context, 
width, 
height, 
tiles, 
tileSize, 
lastx, 
lasty, 
wallColor = "#909090", 
dotColor = "#ff0000";

function init(w, h, s)
{
	canvas = document.getElementById("canvas");
	width = w;
	height = h;
	tileSize = s;
	
	canvas.width = width * tileSize + 1;
	canvas.height = height * tileSize + 1;
	context = canvas.getContext("2d");
	
	gen();
}

function find(x, y)
{
	draw();
	
	for( var a=0; a < width * height; a++){
		tiles[ Math.floor(a/width) ][ a%width ].visited = false;
	}
	
	tiles[0][0].solve(x, y);
}

function gen()
{
	if(tiles){
		delete tiles;
	}
	
	tiles = new Array();
	
	for(var y=0; y < height; y++){
		tiles.push( new Array() );
		
		for(var x=0; x < width; x++){
			tiles[y].push( new tile(x, y) );
		}
	}
	
	tiles[0][0].generate();
	
	find( width-1, height-1 );
}

function tile(x, y)
{
	this.visited = false;
	this.connect = new Array(
		false, //top
		false, //left
		false, //bottom
		false //right
	);
	
	this.x = x
	this.y = y;
	
	this.neighbors = new Array();
	this.connected = new Array();
	this.generate = generate;
	this.solve = solve;
}

function generate()
{
	this.visited = true;
	
	this.neighbors.push( tiles[ this.y-1 ] ? tiles[ this.y-1 ][ this.x ] : undefined );
	this.neighbors.push( tiles[ this.y ][ this.x-1 ] );
	this.neighbors.push( tiles[ this.y+1 ] ? tiles[ this.y+1 ][ this.x ] : undefined );
	this.neighbors.push( tiles[ this.y ][ this.x+1 ] );
	
	var s = new Array(false, false, false, false);
	var count = 0;
	
	while( count < 4 ){
		var index = Math.round( Math.random() * 4 );
		
		if( s[index] == false ){
			s[index] = true;
			count++;
			
			var neighbor = this.neighbors[index];
		
			if( neighbor && !neighbor.visited){
				this.connect[index] = true;
				this.connected.push( neighbor );
				neighbor.connected.push( this );
				neighbor.connect[ (index*1+2) % 4 ] = true;				
				neighbor.generate();
			}
		}
	}		
}

function solve(x, y)
{
	if( this.visited ){
		return false;
	}
	
	this.visited = true;
	
	if( this.x == x && this.y == y ){
		dot( this.x*tileSize + (tileSize/2), this.y*tileSize + (tileSize/2));
		return true;
	}
	
	for(index in this.connected ){
		if( this.connected[index].solve(x, y) ){
			dot( this.x*tileSize + (tileSize/2), this.y*tileSize + (tileSize/2));
			return true;
		}
	}
	
	return false;
}

function draw()
{
	context.clearRect(0, 0, canvas.width, canvas.height );
	
	for(var y=0; y < height; y++){
		for(var x=0; x < width; x++){
			var tile = tiles[y][x];
			var xpos = x * tileSize;
			var ypos = y * tileSize;
			
			if( !tile.connect[0] ){ //top
				drawLine( xpos, ypos, xpos + tileSize, ypos );
			}
			
			if( !tile.connect[3] ){ //right
				drawLine( xpos + tileSize, ypos, xpos + tileSize, ypos + tileSize );
			}
			
			if( !tile.connect[2] ){ //bottom
				drawLine( xpos + tileSize, ypos + tileSize, xpos, ypos + tileSize );
			}
			
			if( !tile.connect[1] ){ //left
				drawLine( xpos, ypos + tileSize, xpos, ypos );
			}  
		}
	}
}

function drawLine(x, y, _x, _y){
	context.fillStyle = wallColor;
	context.fillRect(x, y, (_x==x)?1:(_x-x), (_y==y)?1:(_y-y) );
	context.closePath();
	context.fill();
}

function dot(x, y){
	context.beginPath();
    context.arc(x, y, 1, 0, 3 * Math.PI, false);
    context.fillStyle = dotColor;
    context.fill();
}
