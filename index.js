const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

const GRAVITY = 0.5;
const BACKGROUND_LEFT_LIMIT = 100;
const BACKGROUND_RIGHT_LIMIT = 400;

// al eje de la x vamos a manejarlo así para el movimiento:
const keys = {
	left: {
		pressed: false,
	},
	right: {
		pressed: false,
	},
};

window.addEventListener("keydown", ({ keyCode }) => {
	switch (keyCode) {
		case 38:
			player.velocity.y -= 20;
			break;
		case 40:
			break;
		case 37:
			keys.left.pressed = true;
			break;
		case 39:
			keys.right.pressed = true;
			break;
	}
});

window.addEventListener("keyup", ({ keyCode }) => {
	switch (keyCode) {
		case 38:
			player.velocity.y = 0;
			break;
		case 40:
			player.velocit.y = 0;
			break;
		case 37:
			keys.left.pressed = false;
			break;
		case 39:
			keys.right.pressed = false;
			break;
	}
});

class Player {
	constructor() {
		this.position = {
			x: 100,
			y: 100,
		};
		this.velocity = {
			x: 0,
			y: 1,
		};

		this.width = 30;
		this.height = 30;
	}

	draw() {
		c.fillStyle = "darkcyan";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		// movimiento:
		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		// gravedad: si está cayendo que acelere y si lleg al piso que sea cero
		if (this.position.y + this.height + this.velocity.y <= canvas.height) {
			this.velocity.y += GRAVITY;
		} else {
			this.velocity.y = 0;
		}
	}
}

class Platform {
	constructor() {
		this.position = {
			x: 400,
			y: 400,
		};
		this.width = 200;
		this.height = 20;
	}

	draw() {
		c.fillStyle = "green";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

const player = new Player();
const platform = new Platform();
//player.update();

//función animation loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	player.update();
	platform.draw();

	// controlar la movilidad del eje x:
	if (keys.right.pressed && player.position.x <= BACKGROUND_RIGHT_LIMIT) {
		player.velocity.x = 5;
	} else if (
		keys.left.pressed &&
		player.position.x >= BACKGROUND_LEFT_LIMIT
	) {
		player.velocity.x = -5;
	} else {
		player.velocity.x = 0;

		// si el player se mueve más allá de los límites, que se mueva el fondo
		if (keys.right.pressed) {
			platform.position.x -= 5;
		} else if (keys.left.pressed) {
			platform.position.x += 5;
		}
	}

	// controlar la coalisión de player y plataforma (object collision detection)
	const playerBottomSide = player.position.y + player.height;
	const playerTopSide = player.position.y;
	const playerRightSide = player.position.x + player.width;
	const playerLeftSide = player.position.x;

	const platformTopSide = platform.position.y;
	const platformBottomSide = platform.position.y + platform.height;
	const platformLeftSide = platform.position.x;
	const platformRightSide = platform.position.x + platform.width;

	if (
		playerBottomSide <= platformTopSide &&
		playerBottomSide + player.velocity.y >= platformTopSide &&
		playerRightSide >= platformLeftSide &&
		playerLeftSide <= platformRightSide
	) {
		player.velocity.y = 0;
	}
}

animate();
