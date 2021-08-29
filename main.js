const RAINBOW = [
    "rgba(255,0,0,1)",
    "orange",
    "rgba(255,255,0,1)",
    "green",
    "blue",
    "indigo"
]
const SQUARE_ROOT_2 = 1.41421356237;
const DEGREES = Math.PI / 180;
const SHGRAVITY = 6;
const CRUISE_SPEED = 3;
const TURNING_DELAY = 350;
const VERTICAL_DELAY = 200;
const SIZES = {
    RABBIT: 32,
    ASTEROID: 30
}

class Asteroids {
    constructor(position, color = "green", angle = 0) {
        this.position = position;
        this.direction = [0, 0];
        this.angle = angle;
        this.fifouTail = [];

        this.still_alive = true;
        this.funeralStep = 0;

        this.color = color;
        let randomGrowth = (Math.random() - .5) * SIZES.RABBIT * 3;
        this.diameter = Math.max(SIZES.RABBIT + randomGrowth, SIZES.RABBIT / 2);
    };

    draw(ctx, currentStep = 0) {
        let diameter = this.diameter;

        let x = this.position[0];
        let y = this.position[1];

        // Tail
        if (this.still_alive) {
            let delta = 4;
            for (let i = 0; i < this.fifouTail.length; i++) {
                let size = diameter - this.fifouTail.length * delta + i * delta;
                size -= (RAINBOW.length - this.fifouTail.length); // fix: start with smaller tail
                if (size <= 0) {
                    size = 1;
                }
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "white"; // this.color;
                ctx.arc(
                    this.fifouTail[i][0],
                    this.fifouTail[i][1],
                    (size / 2) * SQUARE_ROOT_2,
                    0, Math.PI * 2, false);
                ctx.stroke();
                ctx.closePath();

            }

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = "black"; // this.color;
            ctx.strokeStyle = "white"; // this.color;
            ctx.arc(
                x,
                y,
                (diameter / 2) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else {
            let delta = 4;
            diameter = 10 + (currentStep - this.funeralStep) * delta;
            if (diameter > 150) {
                return;
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            // ctx.fillStyle = "pink"; // this.color;
            ctx.strokeStyle = this.color;
            ctx.arc(
                x,
                y,
                (diameter / 2) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            // ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    };
}

class Character {
    constructor(position, angle = 0) {
        this.position = position;
        this.direction = [-CRUISE_SPEED, 0];
        this.angle = angle;
        this.boost = 0;

        this.fifouTail = []; // drawing only
        this.boosting = false;
        this.turning = false;
        this.falling = 0;

        this.powerMalus = 0;

        this.width = SIZES.RABBIT;
        this.height = SIZES.RABBIT;

        this.waitShift = 0;
    };

    draw(ctx, currentStep = 0) {
        // Reference square
        let backward = (this.direction[0] < 0);
        let width = this.width;
        let height = this.height;
        let x = this.position[0];
        let y = this.position[1] + this.waitShift;

        // Tail
        ctx.lineWidth = 1;
        // @TODO width == boost
        for (let i = 0; i < this.fifouTail.length; i++) {
            ctx.beginPath();
            let color = RAINBOW[this.fifouTail[i][2]];
            let size = 10 - i - (RAINBOW.length - this.fifouTail.length); // fix: start with smaller tail
            // ctx.fillStyle = "black";
            ctx.strokeStyle = color;
            ctx.arc(
                this.fifouTail[i][0] - width / 2 + width * backward,
                this.fifouTail[i][1] + height / 6,
                size * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            // ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        ctx.lineWidth = 2;
        // Ear back
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.arc(
            x + (width / 4) * !backward - (width / 4) * backward, // @TODO factorize the shift
            y - height / 2,
            (width / 8) * SQUARE_ROOT_2,
            0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Body
        let shift = 0;
        if (this.falling) {
            shift = Math.sin(currentStep) * 2;
        }
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.rect(
            x - width / 2 + shift,
            y - width / 2,
            width,
            width
        );
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Ear front
        ctx.beginPath();
        ctx.fillStyle = "white";
        // ctx.strokeStyle = "black";
        ctx.arc(
            x - (width / 4) * !backward + (width / 4) * backward,
            y - height / 2,
            (width / 8) * SQUARE_ROOT_2,
            0, Math.PI * 2, false);
        ctx.fill();
        // ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        // ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.arc(
            x - (width / 4) * !backward + (width / 4) * backward,
            y - height / 2,
            (width / 8) * SQUARE_ROOT_2,
            Math.PI * 1, Math.PI * 2, false);
        // ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Eye left
        if (this.falling) {

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.arc(
                x, // + (width / 6) * backward - (width / 6) * !backward, // @TODO factorize the shift
                y,
                (width / 12) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            // ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(
                x,
                y,
                (width / 32) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }


        // Eye right
        if (this.falling) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.arc(
                x + (width / 3) * !backward - (width / 3) * backward, // @TODO factorize the shift
                y,
                (width / 12) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            // ctx.fill();
            ctx.stroke();
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(
                x + (width / 3) * !backward - (width / 3) * backward,
                y,
                (width / 32) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }

        // Cheeks left
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 125, 125, .5)";
        ctx.arc(
            x + (width / 3),
            y + height / 3,
            (width / 12) * SQUARE_ROOT_2,
            0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        // Cheeks right
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 125, 125, .5)";
        ctx.arc(
            x - (width / 3),
            y + height / 3,
            (width / 12) * SQUARE_ROOT_2,
            0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }
};

const GAME_STATE = {
    WAIT: 0,
    PLAY: 1
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.score = null;

        this.asteroids = [];
        this.asteroidCorpses = [];
        this.currentAsteroidsNum = 0;

        this.waveNum = 0;

        this.reinit();
    };

    reinit() {
        this.switchGameState(GAME_STATE.WAIT);
        this.step = null;
        this.CTRL_spaceWasPressed = false;

        this.mainCharacter = new Character(
            [this.canvas.width / 2, this.canvas.height / 2]
        );

        this.asteroids = [];
        this.asteroidCorpses = [];
        this.currentAsteroidsNum = 0;

        this.waveNum = 0;

        console.debug(this); // @TODO debug print state method
    }

    run() {
        // @TODO handle control : spaceWasReleased?
        this.step += 1;

        // Handle charming float on waiting screen
        if (this.state == GAME_STATE.WAIT) {
            this.mainCharacter.waitShift = Math.sin(this.step / 8) * 3;
        }

        if (this.state == GAME_STATE.WAIT && this.step > 60) {
            if (CTRL_spacePressed) {
                this.CTRL_spaceWasPressed = true;
            }
            else if (this.CTRL_spaceWasPressed && !CTRL_spacePressed) {
                this.switchGameState(GAME_STATE.PLAY);
            }
        }
        else if (this.state == GAME_STATE.PLAY) {
            this.engine();
        }
        this.draw();
        requestAnimationFrame(() => this.run());
    };

    switchGameState(state) {
        console.debug("Switch game state to:");
        this.state = state;
        console.debug(this.state); //DEBUG

        if (this.state == GAME_STATE.WAIT) {
            console.debug("Press SPACE to play"); //DEBUG
        }
        else if (this.state == GAME_STATE.PLAY) {
            console.debug("We are playing"); //DEBUG
            this.step = 0;
            this.score = 0;
            this.mainCharacter.waitShift = 0;
        }

        // Reset @TODO
        this.CTRL_spaceWasPressed = false;
    }

    // Engine
    collisions() {
        let rabbitRadius = this.mainCharacter.width / 2;

        for (let asteroid of this.asteroids) {
            if (!asteroid.still_alive) {
                continue;
            }
            let asteroidRadius = asteroid.diameter / 2;
            let limitDistance = rabbitRadius + asteroidRadius; // + 2;

            let horizontalDistance = Math.abs(this.mainCharacter.position[0] - asteroid.position[0]);
            let verticalDistance = Math.abs(this.mainCharacter.position[1] - asteroid.position[1]);

            // too far (safe zone)
            if ((horizontalDistance > limitDistance) || (verticalDistance > limitDistance)) {
                continue;
            }

            // close enough (danger zone)
            let limitSquareDistance = (rabbitRadius + asteroidRadius) * (rabbitRadius + asteroidRadius);
            let squareHorizontal = horizontalDistance * horizontalDistance;
            let squareVertical = verticalDistance * verticalDistance;
            let squareDistance = squareHorizontal + squareVertical;

            if (squareDistance < limitSquareDistance) {
                this.badaboum(asteroid)
                return true;
            }
        }

        return false;
    }

    badaboum(asteroid) {
        if (asteroid.position[1] > 0) {
            this.score += 1; // only on-screen crashes are scored, earlier crashes are discarded
        }
        asteroid.still_alive = false;
        asteroid.funeralStep = this.step;
        this.currentAsteroidsNum -= 1;
    }

    engine() {
        // Auto
        const tailStepSize = 4;

        // Asteroids waves
        // -- Clean-up
        if (this.asteroidCorpses.length) {
            if (
                (this.asteroidCorpses.length > RAINBOW.length) ||
                (this.step - this.asteroidCorpses[0].funeralStep > 60)
            ) {
                this.asteroidCorpses.shift;
            }
        }

        // -- Creation
        if (this.currentAsteroidsNum == 0) {
            // console.debug("Burrying.");
            this.asteroidCorpses = this.asteroidCorpses.concat(this.asteroids);

            // console.debug("Init wave.");
            this.asteroids = [];
            const minNumAsteroids = 5;
            let waveLength = minNumAsteroids + Math.floor(Math.random() * (RAINBOW.length - minNumAsteroids)); // @TODO Random number + difficulty per wave

            for (let i = 0; i < waveLength; i++) {
                let color = RAINBOW[this.waveNum % RAINBOW.length];
                let x = Math.floor(Math.random() * (this.canvas.width / 2) + (this.canvas.width / 4));
                let y = 0 - i * VERTICAL_DELAY; // @TODO add randomness to delay + difficulty per wave
                let asteroid = new Asteroids([x, y], color);
                let horizontalDirection = Math.floor(Math.random() * SHGRAVITY);
                if (x > this.canvas.width / 2) {
                    horizontalDirection = - horizontalDirection;
                }
                asteroid.direction[0] = horizontalDirection; // @TODO random + random position also
                this.asteroids.push(asteroid);
            }
            this.currentAsteroidsNum = this.asteroids.length;
            this.waveNum += 1;
        }

        // -- Movements
        for (let asteroid of this.asteroids) {
            if (!asteroid.still_alive) {
                continue;
            }
            // -- Tail
            if (this.step % (tailStepSize) == 0) {
                let position = Object.assign({}, asteroid.position);
                asteroid.fifouTail.push(
                    [position[0], position[1], null]
                );
                if (asteroid.fifouTail.length > RAINBOW.length) {
                    asteroid.fifouTail.shift();
                }
            }
            if (asteroid.direction[1] < SHGRAVITY * 1.1) {
                asteroid.direction[1] += 1;
            }

            // -- Horizontal
            let newPosition = asteroid.position[0] + asteroid.direction[0];
            if (false) { } // placeholder for fix if needed
            else {
                asteroid.position[0] = newPosition
            }

            // -- Vertical
            newPosition = asteroid.position[1] + asteroid.direction[1];
            if (false) { } // placeholder for fix if needed
            else {
                asteroid.position[1] = newPosition
            }

            // -- Badaboum
            if (
                (asteroid.position[1] > this.canvas.height) ||
                (asteroid.position[0] > this.canvas.width) ||
                (asteroid.position[0] < 0)
            ) {
                console.debug("Badaboum."); // DEBUG
                this.badaboum(asteroid);
            }
        }


        // Control
        if (!this.mainCharacter.falling) {
            // -- U-turn
            if (CTRL_spacePressed && !this.turning) {
                if (Date.now() - CTRL_spacePressedTime > TURNING_DELAY) {
                    this.turning = true;
                    this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];
                    // this.mainCharacter.boost = 0;
                }
            }

            // -- Boost
            if (CTRL_spacePressed && !this.boosting) {
                this.mainCharacter.boost = 16 - this.mainCharacter.powerMalus;
                this.boosting = true;
            }
            if (this.mainCharacter.position[1] < 0) {
                this.mainCharacter.boost = 0;
            }
            if (!CTRL_spacePressed) {
                this.boosting = false;
                this.turning = false;
            }
        }

        // Movements
        if (this.mainCharacter.direction[1] < SHGRAVITY) {
            this.mainCharacter.direction[1] += 1;
        }
        if (this.mainCharacter.boost > 0) {
            this.mainCharacter.boost -= 1;
        }
        if (this.mainCharacter.falling > 0) {
            this.mainCharacter.falling -= 1;
        }

        // -- Tail
        if (this.step % tailStepSize == 0) {
            if (this.mainCharacter.falling) {
                this.mainCharacter.fifouTail.shift();
            }
            else {
                let tailIndex = this.step / tailStepSize % RAINBOW.length; // to retrieve color

                let position = Object.assign({}, this.mainCharacter.position);
                this.mainCharacter.fifouTail.push(
                    [position[0], position[1], tailIndex]
                );
                if (this.mainCharacter.fifouTail.length > RAINBOW.length - this.mainCharacter.powerMalus) {
                    this.mainCharacter.fifouTail.shift();
                }
            }
        }

        let newPosition = null;
        // -- Horizontal
        newPosition = this.mainCharacter.position[0] + this.mainCharacter.direction[0];
        if (
            (newPosition - this.mainCharacter.width / 4 > this.canvas.width) ||
            (newPosition + this.mainCharacter.width / 4 < 0)
        ) {
            // -- Auto turn
            this.turning = true;
            this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];

            // -- Passthrough
            // if (this.mainCharacter.direction[0] > 0) {
            //     this.mainCharacter.position[0] = 0;
            // }
            // else {
            //     this.mainCharacter.position[0] = this.canvas.width;
            // }
        }
        else {
            this.mainCharacter.position[0] = newPosition
        }

        // -- Vertical
        newPosition = this.mainCharacter.position[1] + this.mainCharacter.direction[1] - this.mainCharacter.boost;
        if (newPosition - this.mainCharacter.height > this.canvas.height /*this.mainCharacter.height/2*/) {
            console.debug("Death.");
            this.reinit();
            // this.mainCharacter.direction[1] = 0;
            // this.mainCharacter.position[1] = this.canvas.height - this.mainCharacter.height/2;
        }
        else {
            this.mainCharacter.position[1] = newPosition
        }

        // Survival
        if (this.collisions()) {
            console.debug("Immminent death.");
            this.mainCharacter.powerMalus += 2;
            this.mainCharacter.falling = 30 * this.mainCharacter.powerMalus;
            // this.mainCharacter.direction[0] = 0;
            this.mainCharacter.boost = 16;
            // this.score = Math.max(0, this.score - 20);
        }
    };

    // Graphics
    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);
        this.drawBackground();

        if (this.state == GAME_STATE.WAIT) {
            this.drawTheRainbow();
        }

        this.mainCharacter.draw(this.ctx, this.step);
        for (let asteroid of this.asteroids) {
            asteroid.draw(this.ctx, this.step);
        }
        for (let asteroid of this.asteroidCorpses) {
            asteroid.draw(this.ctx, this.step);
        }

        this.drawScore();

        if (this.state == GAME_STATE.WAIT) {
            this.drawInstructions();
        }
        // requestAnimationFrame(() => this.draw());
    }

    drawInstructions() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.font = "20px Arial";
        this.ctx.fillText("TAP SPACE", this.canvas.width / 4, this.canvas.height / 3 + 30);
        this.ctx.fillText("TO GO UP", this.canvas.width / 4, this.canvas.height / 3 + 60);
        this.ctx.fillText("PRESS SPACE", 3 * this.canvas.width / 4, this.canvas.height / 3 + 30);
        this.ctx.fillText("TO GO BACK", 3 * this.canvas.width / 4, this.canvas.height / 3 + 60);
        this.ctx.font = "26px Arial";

        this.ctx.fillText("AVOID THE ASTEROIDS", this.canvas.width / 2, 3 * this.canvas.height / 4 + 30);
        this.ctx.closePath();
    }

    drawScore() {
        if (this.score === null) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.font = "70px Helvetica";
        this.ctx.fillText(this.score, this.canvas.width / 2, this.canvas.height / 4);
        this.ctx.closePath();

        if (this.state == GAME_STATE.WAIT) {
            const size = 140;

            this.ctx.font = "20px Helvetica";
            this.ctx.fillText("SCORE", this.canvas.width / 2, this.canvas.height / 4 - size / 2);

            this.ctx.beginPath();
            this.ctx.fillStyle = null;
            this.ctx.strokeStyle = "white";
            this.ctx.rect(
                this.canvas.width / 2 - size / 2,
                this.canvas.height / 4 - 3 * size / 4,
                size,
                size
            );
            // ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawBackground() {
        // if (this.state == GAME_STATE.WAIT) {}
        // else if (this.state == GAME_STATE.PLAY) {}
        let fadeSpeed = 200; // in steps
        if (this.state == GAME_STATE.WAIT) {
            fadeSpeed = 80;
        }

        let intensity = 1;
        if (this.step < fadeSpeed) {
            intensity = this.step % fadeSpeed / fadeSpeed; // Fade in blue
        }

        if (this.state == GAME_STATE.WAIT) {
            intensity = 1 - intensity;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0, 0, " + intensity * 40 + ", 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        // if (this.state == GAME_STATE.WAIT) {
        //     this.ctx.beginPath();
        //     this.ctx.strokeStyle = "white";
        //     this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        //     this.ctx.stroke();
        //     this.ctx.closePath();
        // }
    }

    drawTheRainbow() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(0, this.canvas.height * .7);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.stroke();
        this.ctx.closePath();

        for (let i = 0; i < RAINBOW.length; i++) {
            const girth = 10;
            this.ctx.beginPath();
            this.ctx.lineWidth = girth;
            this.ctx.strokeStyle = RAINBOW[i];
            this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.lineTo(
                this.canvas.width + girth,
                - RAINBOW.length * girth / 2 + this.canvas.height * .7 + i * girth);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}

// Control
var CTRL_spacePressed = false;
var CTRL_spacePressedTime = null;

function keyDownHandler(e) {
    if (e.key == " ") {
        if (!CTRL_spacePressed) {
            CTRL_spacePressed = true;
            CTRL_spacePressedTime = Date.now();
        }
        // console.debug("Spacebar is pressed"); //DEBUG
        // console.debug(CTRL_spacePressedTime); //DEBUG
    }
}

function keyUpHandler(e) {
    if (e.key == " ") {
        CTRL_spacePressed = false;
        // console.debug("Spacebar is not pressed"); //DEBUG
    }
}

function main() {
    // Initialization
    // console.debug("Hello, World!"); //DEBUG

    // -- Canvas
    let mainCanvas = document.createElement("canvas");
    mainCanvas.height = window.innerHeight;
    mainCanvas.width = Math.min(window.innerHeight, 750); // mainCanvas.width = window.innerWidth;
    document.body.appendChild(mainCanvas);

    // -- Control
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Run
    console.debug("Let's run!"); //DEBUG
    let mainGame = new Game(mainCanvas);
    mainGame.run();
    // let interval = setInterval(() => mainGame.run(), 100);
    // mainGame.draw()
}

main();