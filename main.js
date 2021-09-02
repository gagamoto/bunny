// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

'use strict'; let zzfx, zzfxV, zzfxX

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 ~ 884 bytes minified
zzfxV = .3    // volume
zzfx =       // play sound
    (p = 1, k = .05, b = 220, e = 0, r = 0, t = .1, q = 0, D = 1, u = 0, y = 0, v = 0, z = 0, l = 0, E = 0, A = 0, F = 0, c = 0, w = 1, m = 0, B = 0) => {
        let
            M = Math, R = 44100, d = 2 * M.PI, G = u *= 500 * d / R / R, C = b *= (1 - k + 2 * k * M.random(k = [])) * d / R, g = 0, H = 0, a = 0, n = 1, I = 0
            , J = 0, f = 0, x, h; e = R * e + 9; m *= R; r *= R; t *= R; c *= R; y *= 500 * d / R ** 3; A *= d / R; v *= d / R; z *= R; l = R * l | 0; for (h = e + m +
                r + t + c | 0; a < h; k[a++] = f)++J % (100 * F | 0) || (f = q ? 1 < q ? 2 < q ? 3 < q ? M.sin((g % d) ** 3) : M.max(M.min(M.tan(g), 1)
                    , -1) : 1 - (2 * g / d % 2 + 2) % 2 : 1 - 4 * M.abs(M.round(g / d) - g / d) : M.sin(g), f = (l ? 1 - B + B * M.sin(d * a / l) : 1) * (0 < f ? 1 :
                        -1) * M.abs(f) ** D * p * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) : a < e + m + r ? w : a < h - c ? (h - a - c) / t * w : 0), f = c ? f /
                            2 + (c > a ? 0 : (a < h - c ? 1 : (h - a) / c) * k[a - c | 0] / 2) : f), x = (b += u += y) * M.cos(A * H++), g += x - x * E * (1 - 1E9 * (M.sin(a)
                                + 1) % 2), n && ++n > z && (b += v, C += v, n = 0), !l || ++I % l || (b = C, u = G, n = n || 1); p = zzfxX.createBuffer(1, h, R); p.
                                    getChannelData(0).set(k); b = zzfxX.createBufferSource(); b.buffer = p; b.connect(zzfxX.destination
                                    ); b.start(); return b
    }; zzfxX = new (window.AudioContext || webkitAudioContext) // audio context
// End

// Graphics
const SHMECOND = 60; // around 1 seconds
const PAUSE_TIME = 60; // around 1 seconds
const FADE_SPEED = 90; // around 1.5 seconds
const REFERENCE_HEIGHT = 627; // innerHeight for dev
const NUM_STARS = 20; // enough
const RAINBOW = [
    "rgba(255,   0,   0, 1)", // "red"?
    "rgba(255, 125,   0, 1)", // "orange"?
    "rgba(255, 255,   0, 1)", // "yellow"?
    "rgba(  0, 255,   0, 1)", // "green"?
    "rgba(  0,   0, 255, 1)", // "blue"?
    "rgba( 75,   0, 130, 1)" // == "indigo"!
]

// Maths
const SQUARE_ROOT_2 = 1.41421356237;
const DEGREES = Math.PI / 180;

// Engine
// @TODO normalize the values
// @TODO move to a class Engine, member of Game
const TURNING_DELAY = 350; // unit = steps (1 step = 1/60 second)
const FACTOR = window.innerHeight / REFERENCE_HEIGHT; // @TODO remove
const GAME_STATE = {
    WAIT: 0,
    PLAY: 1
}
const SIZES = {
    RABBIT: 30 * FACTOR,
    ASTEROID_MIN: 10 * FACTOR,
    ASTEROID_MAX: 50 * FACTOR
}

class Asteroids {
    constructor(position, color = "white") {
        this.position = position;
        this.direction = [0, 0];
        this.diameter = SIZES.ASTEROID_MIN + Math.round(Math.random() * (SIZES.ASTEROID_MAX - SIZES.ASTEROID_MIN));

        this.still_alive = true;
        this.funeralStep = 0;

        // graphics
        this.color = color;
        this.fifouTail = [];
    };

    draw(ctx, factor = 1, currentStep = 0) {

        ctx.lineWidth = 2;

        // for readability
        const tailDelta = Math.round(4 * factor); // @TODO fix tail angle
        const boumDelta = Math.round(4 * factor);

        let diameter = this.diameter;
        let x = this.position[0];
        let y = this.position[1];

        // Tail
        if (this.still_alive) {
            for (let i = 0; i < this.fifouTail.length; i++) {
                let size = tailDelta; // @TODO fix
                // let size = diameter + (i - this.fifouTail.length) * tailDelta;
                // size -= (RAINBOW.length - this.fifouTail.length); // fix: start with smaller tail
                // if (size <= 0) {
                //     size = 2 * factor;
                // }
                ctx.beginPath();
                // ctx.fillStyle = RAINBOW[i];
                ctx.strokeStyle = RAINBOW[i];
                ctx.arc(
                    this.fifouTail[i][0],
                    this.fifouTail[i][1],
                    (size / 2) * SQUARE_ROOT_2,
                    0, Math.PI * 2, false);
                // ctx.fill();
                ctx.stroke();
                ctx.closePath();

            }

            // Core
            ctx.beginPath();
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
            diameter = (10 * factor); // + (currentStep - this.funeralStep) * boumDelta; @TODO fix
            if (diameter > 150) {
                return;
            }
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.arc(
                x,
                y,
                (diameter / 2) * SQUARE_ROOT_2,
                0, Math.PI * 2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    };
}

class Character {
    constructor(position, speed) {
        this.position = position;
        this.direction = [-speed, 0];

        this.boost = 0;
        this.boosting = false;
        this.turning = false;
        this.falling = 0;
        this.powerMalus = 0;

        this.width = SIZES.RABBIT; // @TODO remove
        this.height = SIZES.RABBIT; // @TODO remove
        this.fifouTail = []; // drawing only
        this.waitShift = 0;
    };

    draw(ctx, currentStep = 0) {
        ctx.lineWidth = 2;

        // Reference square
        let backward = (this.direction[0] < 0);
        let width = this.width;
        let height = this.height;
        let x = this.position[0];
        let y = this.position[1] + this.waitShift;

        // Tail
        // ctx.lineWidth = 1;
        // @TODO width == boost
        for (let i = 0; i < this.fifouTail.length; i++) {
            ctx.beginPath();
            let color = RAINBOW[this.fifouTail[i][2]];
            let size = 10 - i - (RAINBOW.length - this.fifouTail.length); // fix: start with smaller tail
            if (this.powerMalus > 0) {
                size = 3;
            }
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
        if (this.falling || this.powerMalus > 0) {
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
        if (!this.falling) {
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
        if (this.falling || this.powerMalus > 0) {
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
        }
        if (!this.falling) {
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

class Params {
    constructor(factor = 1) {
        // @TODO: Math.round() the values?
        console.debug(factor);
        this.FACTOR = Math.round(factor);
        this.SHGRAVITY = 6 * factor;
        this.BOOST = 16 * factor;
        this.CRUISE_SPEED = 3 * factor;
        this.VERTICAL_DELAY = 200 * factor;
        console.debug(this);
    }
}

class Game {
    constructor(canvas) { // @TODO declare everything in constructor, THEN initialize
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        let factor = canvas.height / REFERENCE_HEIGHT;
        this.params = new Params(factor);

        this.score = null;
        this.best = null;

        this.mainCharacter = null;
        this.waveNum = null;
        this.currentAsteroidsNum = null;
        this.asteroids = null
        this.asteroidCorpses = null;
        this.stars = null;

        this.state = null;
        this.step = null;
        this.CTRL_spaceWasPressed = null;
    };

    initialize() {
        this.switchGameState(GAME_STATE.WAIT);
        this.generateStars();

        this.mainCharacter = new Character(
            [this.canvas.width / 2, this.canvas.height / 2],
            this.params.CRUISE_SPEED
        );

        this.asteroids = [];
        this.asteroidCorpses = [];
        this.currentAsteroidsNum = 0;
        this.waveNum = 0;
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < NUM_STARS; i++) {
            this.stars.push(
                [Math.random(), Math.random()]
            );
        }
    }

    handle_charming_float() {
        if (this.state == GAME_STATE.WAIT) {
            this.mainCharacter.waitShift = Math.sin(this.step / 8) * 3;
        }
    }

    run() {
        this.step += 1;

        this.handle_charming_float();

        if (this.state == GAME_STATE.WAIT && this.step > PAUSE_TIME) {
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
        zzfx(...[1.01, , 76, .1, .06, .06, , 1.93, , 42, , , .15, , , .1, , .07, .25]); // Main screen (Random 51)

        // console.debug("Switch game state to:");
        this.state = state;
        this.step = 0; // reset in both states
        if (this.state == GAME_STATE.WAIT) {
            if (this.score > this.best) { this.best = this.score; }
        }
        else if (this.state == GAME_STATE.PLAY) {
            this.score = 0;
            this.mainCharacter.waitShift = 0;
        }
        this.CTRL_spaceWasPressed = false; // fix: do not start while boosting
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
            zzfx(...[, , 10, .09, .03, 0, , 2.93, , -1, -989, .1, , , 10, , , , .05]); // Badaboum (Random 129)
            this.score += 1; // only on-screen crashes are scored, earlier crashes are discarded
        }
        asteroid.still_alive = false;
        asteroid.funeralStep = this.step;
        this.currentAsteroidsNum -= 1;
    }

    engine() {
        const tailStepSize = 4;

        // Asteroids waves
        // -- Clean-up
        if (this.asteroidCorpses.length) {
            if (
                (this.asteroidCorpses.length > RAINBOW.length) ||
                (this.step - this.asteroidCorpses[0].funeralStep > SHMECOND)
            ) {
                this.asteroidCorpses.shift; // cleaning one corpse per frame seems enough
            }
        }

        // -- Creation @TODO clean
        if (this.currentAsteroidsNum == 0) {
            // console.debug("Burrying.");
            this.asteroidCorpses = this.asteroidCorpses.concat(this.asteroids);

            // console.debug("Initialize wave.");
            this.asteroids = [];
            const minNumAsteroids = 5;
            let waveLength = minNumAsteroids + Math.floor(Math.random() * (RAINBOW.length - minNumAsteroids)); // fix

            for (let i = 0; i < waveLength; i++) {
                let color = RAINBOW[this.waveNum % RAINBOW.length];
                let x = Math.floor(Math.random() * (this.canvas.width / 2) + (this.canvas.width / 4));
                let y = 0 - i * this.params.VERTICAL_DELAY; // @TODO add randomness to delay
                let asteroid = new Asteroids([x, y], color);
                let horizontalDirection = Math.floor(Math.random() * this.params.SHGRAVITY);
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

            // -- Horizontal
            let newPosition = asteroid.position[0] + asteroid.direction[0];
            if (false) { } // placeholder for fix if needed
            else {
                asteroid.position[0] = newPosition
            }

            // -- Vertical
            if (asteroid.direction[1] < this.params.SHGRAVITY * 1.1) {
                asteroid.direction[1] += this.params.FACTOR;
            }

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
                // console.debug("Badaboum.");
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
                    zzfx(...[1.52, , 201, .03, .03, .01, 3, 1.45, 36, , , , , .1, 4.7, , .04, , , .03]); // Turn (Blip 210)
                }
            }

            // -- Boost
            if (CTRL_spacePressed && !this.boosting) {
                // SOUNDS.BOOST
                this.mainCharacter.boost = this.params.BOOST - this.mainCharacter.powerMalus;
                this.boosting = true;
                let pitch = 80 + 80 * Math.random();
                zzfx(...[1.27, , pitch, .02, .07, .09, 1, 1.23, 2.1, .8, , , , , , , .01, .97, .01, .18]); // Shoot 67
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
        if (this.mainCharacter.direction[1] < this.params.SHGRAVITY) {
            this.mainCharacter.direction[1] += this.params.FACTOR;
        }
        if (this.mainCharacter.boost > 0) {
            this.mainCharacter.boost -= Math.min(this.params.FACTOR, this.mainCharacter.boost);
        }
        if (this.mainCharacter.falling > 0) {
            this.mainCharacter.falling -= this.params.FACTOR;
        }
        if (!this.mainCharacter.falling && this.mainCharacter.powerMalus > 0) {
            this.mainCharacter.powerMalus -= .01;
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
            // @TODO factorize turn()
            zzfx(...[1.52, , 201, .03, .03, .01, 3, 1.45, 36, , , , , .1, 4.7, , .04, , , .03]); // Turn (Blip 210)
            this.mainCharacter.turning = true;
            this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];

            // -- Passthrough: removed because not as fun as expected
            // if (this.mainCharacter.direction[0] > 0) { this.mainCharacter.position[0] = 0; }
            // else { this.mainCharacter.position[0] = this.canvas.width; }
        }
        else {
            this.mainCharacter.position[0] = newPosition
        }

        // -- Vertical
        newPosition = this.mainCharacter.position[1] + this.mainCharacter.direction[1] - this.mainCharacter.boost;
        if (newPosition - this.mainCharacter.height > this.canvas.height /*this.mainCharacter.height/2*/) {
            // console.debug("Death.");
            zzfx(...[1.2, , 1, .03, .1, .67, 4, 1.64, , .1, 212, -0.01, , .3, , .1, , .52, .03]); // Death (Powerup 134 - Mutation 4)
            this.initialize();
        }
        else {
            this.mainCharacter.position[1] = newPosition
        }

        // Survival
        if (this.collisions()) {
            // console.debug("Immminent death.");
            zzfx(...[2, , 416, , .01, .17, 4, .23, , , , , , .5, , .4, .02, .63, .02]); // Falling (Hit 183)
            this.mainCharacter.powerMalus += 2;
            this.mainCharacter.falling = (SHMECOND / 2) * this.mainCharacter.powerMalus;
            this.mainCharacter.boost = this.params.BOOST; // jumping effect on collision

            let sustain = this.mainCharacter.falling / 100;
            zzfx(...[2.29, 0, 110, .02, sustain, .38, , 1.38, , , , , .19, .3, , , .16, .51, .02, .34]); // Music 194
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
            asteroid.draw(this.ctx, this.params.FACTOR, this.step);
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
        // this.ctx.font = "20px Arial";
        // this.ctx.fillText("TAP SPACE", this.canvas.width / 4, this.canvas.height / 3 + 30);
        // this.ctx.fillText("TO GO UP", this.canvas.width / 4, this.canvas.height / 3 + 60);
        // this.ctx.fillText("PRESS SPACE", 3 * this.canvas.width / 4, this.canvas.height / 3 + 30);
        // this.ctx.fillText("TO GO BACK", 3 * this.canvas.width / 4, this.canvas.height / 3 + 60);
        this.ctx.font = "bolder 26px Arial";

        this.ctx.fillText("TAP SPACE &", this.canvas.width / 2, 3 * this.canvas.height / 4);
        this.ctx.fillText("DO NOT FALL", this.canvas.width / 2, 3 * this.canvas.height / 4 + 30);
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
        this.ctx.font = "60px Helvetica";
        this.ctx.fillText(this.score, this.canvas.width / 2, this.canvas.height / 4 - 10);
        this.ctx.closePath();

        if (this.state == GAME_STATE.WAIT) {
            const size = 140;

            this.ctx.font = "20px Helvetica";
            this.ctx.fillText("SCORE", this.canvas.width / 2, this.canvas.height / 4 - size / 2);

            if (this.best !== null) {
                this.ctx.font = "14px Arial";
                let message = "BEST: " + this.best;
                this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 4 - size / 2 + 90);
            }

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
        let fadeSpeed = FADE_SPEED;
        if (this.state == GAME_STATE.WAIT) {
            fadeSpeed = PAUSE_TIME;
        }

        let waver = 0;
        let intensity = 1;
        if (this.step < fadeSpeed) {
            intensity = this.step % fadeSpeed / fadeSpeed; // Fade in blue
        }

        if (this.state == GAME_STATE.PLAY && intensity == 1) { waver = Math.sin(this.step / 64); }

        if (this.state == GAME_STATE.WAIT) {
            intensity = 1 - intensity;
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0, 0, " + String(intensity * 40 + waver * 5) + ", 1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath();

        // Stars
        const color = "rgba(255, 255, 255, " + String(intensity) + ")";
        if (this.state == GAME_STATE.PLAY) {
            let index = 0;
            for (let star of this.stars) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 0;
                this.ctx.fillStyle = color;//"white";
                this.ctx.arc(
                    star[0] * this.canvas.width,
                    (star[1] * this.canvas.height + this.step) % this.canvas.height,
                    1 * SQUARE_ROOT_2,
                    0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.closePath();
                index += 1;
            }
        }
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

function press() {
    if (!CTRL_spacePressed) {
        CTRL_spacePressed = true;
        CTRL_spacePressedTime = Date.now();
    }
}

function release() { CTRL_spacePressed = false; }

function keyDownHandler(e) {
    if (e.key == " ") { press(); }
}
function keyUpHandler(e) {
    if (e.key == " ") { release(); }
}

function touchDownHandler(e) {
    e.preventDefault();
    press();
}

function touchUpDownHandler(e) {
    e.preventDefault();
    release();
}

function main() {
    // -- Canvas
    let mainCanvas = document.createElement("canvas");

    let referenceHeight = window.innerHeight;
    // let referenceWidth = window.innerWidth;
    // console.debug(referenceHeight);
    // console.debug(referenceWidth);

    mainCanvas.height = referenceHeight;
    mainCanvas.width = referenceHeight * 10 / 16;
    document.body.appendChild(mainCanvas);

    // -- Control
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("touchstart", touchDownHandler, false);
    document.addEventListener("touchend", touchUpDownHandler, false);

    // Run
    let mainGame = new Game(mainCanvas);
    mainGame.initialize();
    mainGame.run();
}

main();

// @TODO handle control : spaceWasReleased?
