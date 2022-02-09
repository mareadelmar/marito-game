import platform from "./images/platform.png";

const canvas = document.querySelector("canvas");
canvas.width = 1080;
canvas.height = 608;
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

// trackear en qué parte del escenario está el player
let scrollPosition = 0;

window.addEventListener("keydown", ({ keyCode }) => {
	switch (keyCode) {
		case 38: // 87
			player.velocity.y -= 20;
			break;
		case 40: // 83
			break;
		case 37: // 65
			keys.left.pressed = true;
			break;
		case 39: // 68
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
			player.velocity.y = 0;
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
		c.fillStyle = "salmon";
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
	constructor({ x, y, image }) {
		this.position = {
			x,
			y,
		};
		this.image = image;
		this.width = image.width;
		this.height = image.height;
	}

	draw() {
		// c.fillStyle = "green";
		// c.fillRect(this.position.x, this.position.y, this.width, this.height);
		c.drawImage(this.image, this.position.x, this.position.y);
	}
}

//const image = new Image();
const image = document.createElement("img");
image.src = platform;

const player = new Player();
const platforms = [
	new Platform({ x: 300, y: 400, image }),
	new Platform({ x: 800, y: 300, image }),
	new Platform({ x: 1300, y: 200, image }),
];

//función animation loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = "#f2f2f2";
	c.fillRect(0, 0, canvas.width, canvas.height);

	platforms.forEach(platform => {
		platform.draw();
	});
	// siempre llamar últimoal player: estará arriba de todo
	player.update();

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

		// si el player se mueve más allá de los límites, que se mueva el fondo (scroll background)
		if (keys.right.pressed) {
			scrollPosition -= 5;
			platforms.forEach(platform => {
				platform.position.x -= 5;
			});
		} else if (keys.left.pressed) {
			scrollPosition += 5;
			platforms.forEach(platform => {
				platform.position.x += 5;
			});
		}
	}

	platforms.forEach(platform => {
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

		if (scrollPosition < -2000) {
			console.log("YOU WIN");
		}
	});
}

animate();
