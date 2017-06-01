/* set up of game canvas' along with the expected game style (2D) and resisze canvas to fit screen
				   game: game state holder
				   player: player character to be moved by user
				   food: objects to be collected by player character */
var canvas = document.getElementById("the-game");
var context = canvas.getContext("2d");
context.canvas.height = Math.floor(window.innerHeight / 15) * 15;
context.canvas.width = Math.floor(context.canvas.height * (4 / 3));
var game, player, ai;
var nextSnakeID = 0;
/* game properties */
game = {
	/* set up of starting game state
	   variables are initialized to represent a new game */
	score: 0,
	fps: 8,
	over: false,
	message: null,
	/* variables are adjusted to represent the beginnning of a new game */
	start: function () { /* starting a new game */
		game.over = false; /* game state has been changed to in progress */
		game.message = null; /* no message displayed to user */
		game.score = 0;
		game.fps = 8;
		snakeInit(player);
		snakeInit(ai);
	},
	/* variables are adjusted to represent the end of a game */
	stop: function () { /* stopping a game */
		game.over = true; /* game state has been changed to over */
		game.message = 'GAME OVER - PRESS SPACEBAR'; /* message displayed to user notifying game has ended */
	},
	/* x: initial game board center represented by an x-coordinate
	   y: initial game board center represented by a y-coordinate
	   size: maximum size of the board in the x or y direction, used for both coordinates to create a square
	   color: fill color of the game board */
	drawBox: function (x, y, size, color) {
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(x - (size / 2), y - (size / 2)); /* begins fill path at bottom left from centre point */
		context.lineTo(x + (size / 2), y - (size / 2)); /* line from bottom left to bottom right */
		context.lineTo(x + (size / 2), y + (size / 2)); /* line from bottom right to top right */
		context.lineTo(x - (size / 2), y + (size / 2)); /* line from top right to top left */
		context.closePath(); /* paths created are closed off */
		context.fill(); /* area created by these lines are now filled with a solid color */
	},
	/* creates textfield for the scoreboard
	   fill color of scoreboard and font of scoreboard are chosen
	   scoreboard text is aligned
	   scoreboard textfield filled with score and textfield dimensions are set */
	drawScore: function () {
		context.fillStyle = '#999';
		context.font = (canvas.height) + 'px Impact, sans-serif';
		context.textAlign = 'center';
		context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
	},
	/* creates textfield for the display messages
	   fill color of display message and font of display message are chosen
	   display message text is aligned
	   display message textfield filled with messages and textfield dimensions are set */
	drawMessage: function () {
		if (game.message !== null) {
			context.fillStyle = '#00F';
			context.strokeStyle = '#FFF';
			context.font = (canvas.height / 10) + 'px Impact';
			context.textAlign = 'center';
			context.fillText(game.message, canvas.width / 2, canvas.height / 2);
			context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
		}
	},
	/* resets the gameboard */
	resetCanvas: function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
};
/* player properties */
player = {
	/* variables are initialized to represent a new snake */
	size: canvas.width / 40,
	color: '#0F0',
	initDirection: 'left',
	sections: [],
	/* section: an individual section of the player */
	drawSection: function (section) {
		game.drawBox(parseInt(section[0]), parseInt(section[1]), player.size, player.color); /* player sections are drawn individially inside the box */
	},
	/* collision detection */
	checkCollision: function () {
		if (snakeIsCollision(player, player.x, player.y) === true || snakeIsCollision(ai, player.x, player.y) === true) { /* if the head of the player collides with something */
			game.stop(); /* game state is changed to over */
		}
	},
};
/* ai properties */
ai = {
	/* variables are initialized to represent a new player */
	size: canvas.width / 40,
	color: '#F0F',
	initDirection: 'down',
	sections: [],
	/* section: an individual section of the player */
	drawSection: function (section) {
		game.drawBox(parseInt(section[0]), parseInt(section[1]), ai.size, ai.color); /* player sections are drawn individially inside the box */
	},
	/* collision detection */
	checkCollision: function () {
		if (snakeIsCollision(ai, ai.x, ai.y) === true || snakeIsCollision(player, ai.x, ai.y) === true) { /* if the head of the player collides with something */
			snakeInit(ai); /* ai restarts */
		}
	},
};

function diff(num1, num2) {
		return (num1 > num2) ? num1 - num2 : num2 - num1;
	}
	/* direction choosing for ai */
function chooseDirAi(snake) {
		var foodList = Array(food.length);
		var i = food.length;
		while (i--) {
			foodList[i] = food[i];
		}
		foodList.shift();
		var foodXCoords = getCol(foodList, x);
		var foodYCoords = getCol(foodList, y);
		i = foodList.length;
		var foodXDist = [];
		var foodYDist = [];
		var foodDist = [];
		while (i--) {
			foodXDist[i] = diff(snake.x, foodXCoords[i]);
		}
		i = foodList.length;
		while (i--) {
			foodYDist[i] = diff(snake.y, foodYCoords[i]);
		}
		i = foodList.length;
		while (i--) {
			foodDist[i] = foodXDist[i] + foodYDist[i];
		}
		var dirX, dirY;
		var foodChoice = foodDist.indexOf(Math.min.apply(Math, foodDist)) + 1;
		if (food[foodChoice][x] > snake.x) {
			dirX = "right";
		}
		else if (food[foodChoice][x] < snake.x) {
			dirX = "left";
		}
		else {
			dirX = dirY;
		}
		if (food[foodChoice][y] > snake.y) {
			dirY = "down";
		}
		else if (food[foodChoice][y] < snake.y) {
			dirY = "up";
		}
		else {
			dirY = dirX;
		}
		if (foodXDist[foodChoice] < foodYDist[foodChoice]) {
			snake.direction = dirX;
		}
		else if (foodYDist[foodChoice] < foodXDist[foodChoice]) {
			snake.direction = dirY;
		}
		else {
			snake.direction = Math.random() < 0.5 ? dirX : dirY;
		}
	}
	/* snake movement */
function snakeMove(snake) {
		switch (snake.direction) {
		case 'up':
			/* when the up arrow key is pressed */
			snake.y -= foodSize; /* moves snake in upward direction based on current size */
			break;
		case 'down':
			/* when the down arrow key is pressed */
			snake.y += foodSize; /* moves snake in downward direction based on current size */
			break;
		case 'left':
			/* when the left arrow key is pressed */
			snake.x -= foodSize; /* moves snake in leftward direction based on current size */
			break;
		case 'right':
			/* when the right arrow key is pressed */
			snake.x += foodSize; /* moves snake in rightward direction based on current size */
			break;
		}
		snake.checkCollision(); /* collision detection */
		checkGrowth(snake); /* growth detection */
		snake.sections.push(snake.x + ',' + snake.y); /* array tracks segements of player via turn points */
	}
	/* draws all segments of the snake */
function snakeDraw(snake) {
		for (var i = 0; i < snake.sections.length; i++) {
			snake.drawSection(snake.sections[i].split(',')); /* concatenation of player sections are drawn around current turn points */
		}
	}
	/* snake intitial values */
function snakeInit(snake) {
		snake.sections = []; /* array holds segements of the player */
		if (!snake.id) {
			snake.id = nextSnakeID;
			nextSnakeID++;
		}
		snake.size = canvas.width / 40;
		snake.direction = snake.initDirection;
		var coordOffset = snake.id * snake.size;
		snake.x = (canvas.width / 2) + coordOffset; /* starting xcoordinate for the player */
		snake.y = (canvas.height / 2) + coordOffset; /* starting ycoordinate for the player */
		for (var i = snake.x + (5 * snake.size); i >= snake.x; i -= snake.size) { /* array tracks segements of player via turn points */
			snake.sections.push(i + ',' + snake.y);
		}
		var runTimes = 0;
		while (runTimes < (snake.sections.length - 2)) {
			snakeMove(snake);
			runTimes++;
		}
	}
	/* collision checks */
function snakeIsCollision(snake, x, y) {
	if (x < snake.size / 2 || /* if player collides with itself horizontally */
		x > canvas.width || /* if player collides with canvas horizontally */
		y < snake.size / 2 || /* if player collides with itself vertically */
		y > canvas.height || /* if player collides with canvas vertically */
		snake.sections.indexOf(x + ',' + y) >= 0) {
		return true; /* a collision has happened */
	}
}

function getCol(matrix, col) {
	var column = [];
	for (var i = 0; i < matrix.length; i++) {
		column.push(matrix[i][col]);
	}
	return column;
}

function checkX(snake) {
	return getCol(food, x).indexOf(snake.x);
}

function checkY(snake) {
	return getCol(food, y).indexOf(snake.y);
}

function checkFood(snake) {
	if (checkX(snake) > 0 && checkY(snake) > 0 && checkY(snake) == checkX(snake)) {
		return checkX(snake);
	}
	else {
		return 0;
	}
}

function roundNum(num) {
		return Math.round(num / food.size) * food.size;
	}
	/* food collection, sees if the player has collided with food */
function checkGrowth(snake) {
		if (checkFood(snake) > 0) { /* if the player head collides with a food */
			foodSet(checkX(snake)); /* set another food on the game board */
			game.score++; /* add to score */
			if (game.score % 5 === 0 && game.fps < 60) {
				game.fps++; /* increase the fps when game score increases by 5 points */
			}
		}
		else {
			snake.sections.shift();
		}
	}
	/* food */
var foodSize = ai.size;
var x = 1;
var y = 2;
var coord = 3;
var color = 4;
var food = [
	["number", "x", "y", "color"]
];

function foodSet(num) {
	food[num][x] = (Math.ceil(Math.random() * 10) * player.size * 4); /* random x-coordinate chosen for the food piece within game board dimensions */
	food[num][y] = (Math.ceil(Math.random() * 10) * player.size * 3); /* random y-coordinate chosen for the food piece within game board dimensions */
	food[num][coord] = food[num][x] + food[num][y];
	food[num][color] = newColor();
}

function foodDraw(num) {
		if (typeof food[num] === "undefined") {
			var newFood = new Array(num, '', '', '');
			food.push(newFood);
		}
		if (!food[num][x] || !food[num][y]) {
			foodSet(num);
		}
		while (player.sections.indexOf(food[num][x] + ',' + food[num][y]) >= 0) {
			foodSet(num);
		}
		game.drawBox(food[num][x], food[num][y], foodSize, food[num][color]);
	}
	/* random color */
function newColor() {
		var color = Math.floor(0x1000000 * Math.random()).toString(16);
		return '#' + ('000000' + color).slice(-6);
	}
	/* sets values to change directional key commands */
var inverseDirection = {
	'up': 'down',
	/* up key press maps to downwards movement */
	'left': 'right',
	/* left key press maps to rightwards movement */
	'right': 'left',
	/* right key press maps to leftwards movement */
	'down': 'up' /* down key press maps to upwards movement */
};
/* sets values for directional key commands */
var keys = {
	up: [38, 75, 87],
	down: [40, 74, 83],
	left: [37, 65, 72],
	right: [39, 68, 76],
	start_game: [13, 32]
};
/* value: integer associated with direction key
   gets the value of directional key being pressed */
function getKey(value) {
		for (var key in keys) {
			if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
				return key;
			}
		}
		return null;
	}
	/* function(e) checks for an event (a key press) to happen */
addEventListener("keydown", function (e) {
	var lastKey = getKey(e.keyCode); /* gets value of directional key */
	if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0 && lastKey != inverseDirection[player.direction]) { /* if a key is pressed and key direction is not inversed */
		player.direction = lastKey; /* changes player direction to inverse of last key pressed */
	}
	else if (['start_game'].indexOf(lastKey) >= 0 && game.over) { /* waits for a key to be pressed after a game has ended */
		game.start(); /* game state changed to begin */
	}
}, false);
/* updates frames (visual display of the game) */
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function () {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
}
/* loops through the game if game state isnt equal to over */
function loop() {
	if (game.over === false) {
		context.canvas.height = Math.floor(window.innerHeight / 15) * 15;
		context.canvas.width = Math.floor(context.canvas.height * (4 / 3));
		game.resetCanvas();
		game.drawScore();
		roundNum(player.x);
		roundNum(player.y);
		roundNum(ai.x);
		roundNum(ai.y);
		foodDraw(1);
		foodDraw(2);
		foodDraw(3);
		foodDraw(4);
		snakeMove(player);
		snakeMove(ai);
		snakeDraw(player);
		snakeDraw(ai);
		chooseDirAi(ai);
		game.drawMessage();
	}
	setTimeout(function () {
		window.requestAnimationFrame(loop);
	}, 1000 / game.fps);
}
window.requestAnimationFrame(loop);
