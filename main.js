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

// Charming Rabbit
// MIT License - Copyright 2021 Antoine Dricot
// A dumb and charming game.

// Graphics
const REFERENCE_HEIGHT = 627; // innerHeight for dev
const REFERENCE_WIDTH = 391; // innerWidth for dev

const SHMECOND = 60; // around 1 seconds
const PAUSE_TIME = 60; // around 1 seconds
const FADE_SPEED = 90; // around 1.5 seconds
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
const SHGRAVITY = 6;
const VERTICAL_SHTEP = 1;
const BOOST = 16;
const CRUISE_SPEED = 3;
const TURNING_DELAY = 350; // unit = steps (1 step = 1/60 second)
const GAME_STATE = {
    WAIT: 0,
    PLAY: 1
};
const SIZES = {
    RABBIT: 30,
    ASTEROID_MIN: 10,
    ASTEROID_MAX: 50
};

function drawCenteredRect(ctx = null, x = 0, y = 0, w = 0, h = 0, fillStyle = "white", strokeStyle = null, strokeWidth = 2) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.rect(x - w / 2, y - h / 2, w, h);
    if (fillStyle) { ctx.fill(); }
    if (strokeStyle) { ctx.stroke(); }
    ctx.closePath();
}

function drawCenteredRound(ctx = null, x = 0, y = 0, radius = 0, fillStyle = "white", strokeStyle = null, strokeWidth = 2) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillStyle) { ctx.fill(); }
    if (strokeStyle) { ctx.stroke(); }
    ctx.closePath();
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

        if (this.still_alive) {
            // Tail
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
            drawCenteredRound(ctx, x, y, diameter / 2, "black", "white")
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

        this.width = SIZES.RABBIT; // @TODO remove?
        this.height = SIZES.RABBIT; // @TODO remove?
        this.fifouTail = []; // drawing only
        this.waitShift = 0;
    };

    turn() {
        zzfx(...[1.52, , 201, .03, .03, .01, 3, 1.45, 36, , , , , .1, 4.7, , .04, , , .03]); // Turn (Blip 210)
        this.turning = true;
        this.direction[0] = -this.direction[0];
    }

    draw(ctx, currentStep = 0) {
        // Reference square
        let backward = (this.direction[0] < 0);
        let width = this.width;
        let height = this.height;
        let x = this.position[0];
        let y = this.position[1] + this.waitShift;

        // Tail
        const minSize = 4;
        const maxSize = 12;
        const tailCenter = [
            - width / 2 + width * backward,
            height / 6
        ];

        for (let i = 0; i < this.fifouTail.length; i++) {
            let color = RAINBOW[this.fifouTail[i][2]];
            let radius = maxSize - i - (RAINBOW.length - this.fifouTail.length); // fix: start with smaller tail
            if (radius < minSize || this.powerMalus > 0) {
                radius = minSize;
            }
            drawCenteredRound(ctx, this.fifouTail[i][0] + tailCenter[0], this.fifouTail[i][1] + tailCenter[1], radius, null, color);
        }

        //     ctx.lineWidth = 2;
        //     // Ear back
        //     ctx.beginPath();
        //     ctx.fillStyle = "white";
        //     ctx.strokeStyle = "black";
        //     ctx.arc(
        //         x + (width / 4) * !backward - (width / 4) * backward, // @TODO factorize the shift
        //         y - height / 2,
        //         (width / 8) * SQUARE_ROOT_2,
        //         0, Math.PI * 2, false);
        //     ctx.fill();
        //     ctx.stroke();
        //     ctx.closePath();

        // Body
        let shift = 0;
        if (this.falling) {
            shift = Math.sin(currentStep) * 2;
        }
        drawCenteredRect(ctx, x + shift, y, width, height, "white", "black")

        //     // Ear front
        //     ctx.beginPath();
        //     ctx.fillStyle = "white";
        //     // ctx.strokeStyle = "black";
        //     ctx.arc(
        //         x - (width / 4) * !backward + (width / 4) * backward,
        //         y - height / 2,
        //         (width / 8) * SQUARE_ROOT_2,
        //         0, Math.PI * 2, false);
        //     ctx.fill();
        //     // ctx.stroke();
        //     ctx.closePath();

        //     ctx.beginPath();
        //     // ctx.fillStyle = "white";
        //     ctx.strokeStyle = "black";
        //     ctx.arc(
        //         x - (width / 4) * !backward + (width / 4) * backward,
        //         y - height / 2,
        //         (width / 8) * SQUARE_ROOT_2,
        //         Math.PI * 1, Math.PI * 2, false);
        //     // ctx.fill();
        //     ctx.stroke();
        //     ctx.closePath();

        //     // Eye left
        //     if (this.falling || this.powerMalus > 0) {
        //         ctx.beginPath();
        //         ctx.fillStyle = "white";
        //         ctx.strokeStyle = "black";
        //         ctx.arc(
        //             x, // + (width / 6) * backward - (width / 6) * !backward, // @TODO factorize the shift
        //             y,
        //             (width / 12) * SQUARE_ROOT_2,
        //             0, Math.PI * 2, false);
        //         // ctx.fill();
        //         ctx.stroke();
        //         ctx.closePath();
        //     }
        //     if (!this.falling) {
        //         ctx.beginPath();
        //         ctx.fillStyle = "black";
        //         ctx.arc(
        //             x,
        //             y,
        //             (width / 32) * SQUARE_ROOT_2,
        //             0, Math.PI * 2, false);
        //         ctx.fill();
        //         ctx.closePath();
        //     }

        //     // Eye right
        //     if (this.falling || this.powerMalus > 0) {
        //         ctx.beginPath();
        //         ctx.fillStyle = "white";
        //         ctx.strokeStyle = "black";
        //         ctx.arc(
        //             x + (width / 3) * !backward - (width / 3) * backward, // @TODO factorize the shift
        //             y,
        //             (width / 12) * SQUARE_ROOT_2,
        //             0, Math.PI * 2, false);
        //         // ctx.fill();
        //         ctx.stroke();
        //         ctx.closePath();
        //     }
        //     if (!this.falling) {
        //         ctx.beginPath();
        //         ctx.fillStyle = "black";
        //         ctx.arc(
        //             x + (width / 3) * !backward - (width / 3) * backward,
        //             y,
        //             (width / 32) * SQUARE_ROOT_2,
        //             0, Math.PI * 2, false);
        //         ctx.fill();
        //         ctx.closePath();
        //     }

        //     // Cheeks left
        //     ctx.beginPath();
        //     ctx.fillStyle = "rgba(255, 125, 125, .5)";
        //     ctx.arc(
        //         x + (width / 3),
        //         y + height / 3,
        //         (width / 12) * SQUARE_ROOT_2,
        //         0, Math.PI * 2, false);
        //     ctx.fill();
        //     ctx.closePath();

        //     // Cheeks right
        //     ctx.beginPath();
        //     ctx.fillStyle = "rgba(255, 125, 125, .5)";
        //     ctx.arc(
        //         x - (width / 3),
        //         y + height / 3,
        //         (width / 12) * SQUARE_ROOT_2,
        //         0, Math.PI * 2, false);
        //     ctx.fill();
        //     ctx.closePath();
    }
};

class Params {
    constructor() {
        // remove
    }
}

class Game {
    constructor(canvas) { // @TODO declare everything in constructor, THEN initialize
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        let factor = canvas.height / REFERENCE_HEIGHT;
        this.ctx.scale(factor, factor);

        this.params = new Params();

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
            [REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 2],
            CRUISE_SPEED
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

    manageAsteroidWaves() {
        // -- Clean-up
        if (this.asteroidCorpses.length) {
            if (
                (this.asteroidCorpses.length > RAINBOW.length) ||
                (this.step - this.asteroidCorpses[0].funeralStep > SHMECOND)
            ) {
                this.asteroidCorpses.shift; // cleaning one corpse per frame seems enough
            }
        }

        // -- Creation
        if (this.currentAsteroidsNum == 0) {
            // Burry the old wave
            this.asteroidCorpses = this.asteroidCorpses.concat(this.asteroids);

            // Initialize the new wave
            this.asteroids = [];
            const minNumAsteroids = 4;
            const maxNumAsteroids = RAINBOW.length;
            let waveLength = minNumAsteroids + Math.round(Math.random() * (maxNumAsteroids - minNumAsteroids));

            for (let i = 0; i < waveLength; i++) {
                let color = RAINBOW[this.waveNum % RAINBOW.length];
                // @TODO remove debug positions
                let x = i * SIZES.ASTEROID_MAX; // Math.floor(Math.random() * (REFERENCE_WIDTH / 2) + (REFERENCE_WIDTH / 4));
                let y = i * SIZES.ASTEROID_MAX; // 0 - i * this.params.VERTICAL_DELAY; // @TODO add randomness to delay
                let asteroid = new Asteroids([x, y], color);

                let horizontalDirection = Math.floor(Math.random() * CRUISE_SPEED * 2);
                if (x > REFERENCE_WIDTH / 2) {
                    horizontalDirection = - horizontalDirection;
                }
                asteroid.direction[0] = horizontalDirection;
                this.asteroids.push(asteroid);
            }

            this.currentAsteroidsNum = this.asteroids.length;
            this.waveNum += 1;
        }
    }

    moveAsteroids() {
        for (let asteroid of this.asteroids) {
            if (!asteroid.still_alive) {
                continue;
            }

            // // -- Tail
            // if (this.step % (tailStepSize) == 0) {
            //     let position = Object.assign({}, asteroid.position);
            //     asteroid.fifouTail.push(
            //         [position[0], position[1], null]
            //     );
            //     if (asteroid.fifouTail.length > RAINBOW.length) {
            //         asteroid.fifouTail.shift();
            //     }
            // }

            if (asteroid.direction[1] < SHGRAVITY * 1.1) {
                asteroid.direction[1] += VERTICAL_SHTEP; // asteroids will go 1.1 faster than us
            }
            asteroid.position[0] = asteroid.position[0] + asteroid.direction[0];
            asteroid.position[1] = asteroid.position[1] + asteroid.direction[1];

            // -- Badaboum
            if (
                (asteroid.position[1] > REFERENCE_HEIGHT) ||
                (asteroid.position[0] > REFERENCE_WIDTH) ||
                (asteroid.position[0] < 0)
            ) {
                this.badaboum(asteroid);
            }
        }
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

    controlMainCharacter() {
        if (this.mainCharacter.falling) { return; }

        // -- Turn
        if (CTRL_spacePressed &&
            !this.mainCharacter.turning &&
            (Date.now() - CTRL_spacePressedTime > TURNING_DELAY)
        ) {
            this.mainCharacter.turn();
        }

        // -- Boost
        if (CTRL_spacePressed && !this.mainCharacter.boosting) {
            this.mainCharacter.boosting = true;
            this.mainCharacter.boost = BOOST - this.mainCharacter.powerMalus;
            const pitch = 80; // @TODO Math.random(); ?
            zzfx(...[1.27, , pitch, .02, .07, .09, 1, 1.23, 2.1, .8, , , , , , , .01, .97, .01, .18]); // Shoot 67
        }

        if (this.mainCharacter.position[1] < 0) {
            this.mainCharacter.boost = 0; // Icarus lock
        }

        if (!CTRL_spacePressed) {
            this.mainCharacter.boosting = false;
            this.mainCharacter.turning = false;
        }
    }

    tailMainCharacter() {
        const tailStepSize = 4;
        if (this.step % tailStepSize != 0) { return; }

        if (this.mainCharacter.falling) {
            this.mainCharacter.fifouTail.shift();
        }
        else {
            let tailIndex = this.step / tailStepSize % RAINBOW.length; // color index

            let position = Object.assign({}, this.mainCharacter.position); // hard copy
            this.mainCharacter.fifouTail.push(
                [position[0], position[1], tailIndex]
            );

            if (this.mainCharacter.fifouTail.length > RAINBOW.length) {
                this.mainCharacter.fifouTail.shift();
            }
        }
    }

    moveMainCharacter() {
        // -- Acceleration
        if (this.mainCharacter.direction[1] < SHGRAVITY) {
            // this.mainCharacter.direction[1] += VERTICAL_SHTEP;
        }

        // -- Horizontal
        const xMargin = this.mainCharacter.width / 4;
        let newX = this.mainCharacter.position[0] + this.mainCharacter.direction[0];
        this.mainCharacter.position[0] = newX;


        if ((newX - xMargin > REFERENCE_WIDTH) || (newX + xMargin < 0)) {
            // -- Auto turn
            this.mainCharacter.turn();

            // -- Passthrough (removed cause not as fun as expected)
            // if (this.mainCharacter.direction[0] > 0) { this.mainCharacter.position[0] = 0; }
            // else { this.mainCharacter.position[0] = REFERENCE_WIDTH; }
        }

        // -- Vertical
        const yMargin = this.mainCharacter.height;
        let newY = this.mainCharacter.position[1] + this.mainCharacter.direction[1] - this.mainCharacter.boost;
        this.mainCharacter.position[1] = newY

        if (newY - yMargin > REFERENCE_HEIGHT) {
            // console.debug("Death.");
            zzfx(...[1.2, , 1, .03, .1, .67, 4, 1.64, , .1, 212, -0.01, , .3, , .1, , .52, .03]); // Death (Powerup 134 - Mutation 4)
            this.initialize();
        }
    }

    engine() {
        // Asteroids
        this.manageAsteroidWaves();
        this.moveAsteroids();
        /*        
                
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
                                (asteroid.position[1] > REFERENCE_HEIGHT) ||
                                (asteroid.position[0] > REFERENCE_WIDTH) ||
                                (asteroid.position[0] < 0)
                            ) {
                                // console.debug("Badaboum.");
                                this.badaboum(asteroid);
                            }
                        }
                */
        // -- Control
        this.controlMainCharacter();

        // -- Movements
        if (this.mainCharacter.boost > 0) {
            this.mainCharacter.boost -= 1;
        }
        /*
                if (this.mainCharacter.falling > 0) {
                    this.mainCharacter.falling -= this.params.FACTOR;
                }
                if (!this.mainCharacter.falling && this.mainCharacter.powerMalus > 0) {
                    this.mainCharacter.powerMalus -= .01;
                }
        */
        this.tailMainCharacter();
        this.moveMainCharacter();

        // Survival
        /*
                if (this.collisions()) {
                    // console.debug("Immminent death.");
                    zzfx(...[2, , 416, , .01, .17, 4, .23, , , , , , .5, , .4, .02, .63, .02]); // Falling (Hit 183)
                    this.mainCharacter.powerMalus += 2;
                    this.mainCharacter.falling = (SHMECOND / 2) * this.mainCharacter.powerMalus;
                    this.mainCharacter.boost = this.params.BOOST; // safe jumping effect on collision
        
                    let sustain = this.mainCharacter.falling / 100;
                    zzfx(...[2.29, 0, 110, .02, sustain, .38, , 1.38, , , , , .19, .3, , , .16, .51, .02, .34]); // Music 194
                }
        */
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
        // for (let asteroid of this.asteroidCorpses) {
        //     asteroid.draw(this.ctx, this.step);
        // }
        this.drawScore();
        if (this.state == GAME_STATE.WAIT) {
            this.drawInstructions();
        }
    }

    drawBackground() {
        let fadeSpeed = FADE_SPEED;
        if (this.state == GAME_STATE.WAIT) {
            fadeSpeed = PAUSE_TIME;
        }

        let intensity = 1;
        let waver = 0;

        // @TODO fade
        // @TODO wave
        // if (this.step < fadeSpeed) {
        //     intensity = this.step % fadeSpeed / fadeSpeed; // Fade in blue
        // }

        // if (this.state == GAME_STATE.PLAY && intensity == 1) { waver = Math.sin(this.step / 64); }

        // if (this.state == GAME_STATE.WAIT) {
        //     intensity = 1 - intensity;
        // }

        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(0, 0, " + String(intensity * 40 + waver * 5) + ", 1)";
        this.ctx.fillRect(0, 0, REFERENCE_WIDTH, REFERENCE_HEIGHT);
        this.ctx.closePath();

        // Stars
        const color = "rgba(255, 255, 255, " + String(intensity) + ")";
        if (this.state == GAME_STATE.PLAY /*|| true*/) {
            for (let star of this.stars) {
                drawCenteredRound(
                    this.ctx,
                    star[0] * REFERENCE_WIDTH,
                    (star[1] * REFERENCE_HEIGHT + this.step) % REFERENCE_HEIGHT,
                    2,
                    color
                );
            }
        }
    }

    drawTheRainbow() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(0, REFERENCE_HEIGHT * .7);
        this.ctx.lineTo(REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 2);
        this.ctx.stroke();
        this.ctx.closePath();

        for (let i = 0; i < RAINBOW.length; i++) {
            const girth = 10;
            this.ctx.beginPath();
            this.ctx.lineWidth = girth;
            this.ctx.strokeStyle = RAINBOW[i];
            this.ctx.moveTo(REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 2);
            this.ctx.lineTo(
                REFERENCE_WIDTH + girth,
                - RAINBOW.length * girth / 2 + REFERENCE_HEIGHT * .7 + i * girth);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawScore() {
        this.score = 623; // @TODO debug value to remove
        this.best = 1623; // @TODO debug value to remove
        if (this.score === null) {
            return;
        }

        const fontSize = 60;
        this.ctx.font = String(fontSize) + "px Helvetica";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.score, REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 4);

        // @TODO draw best score well centered
        // if (this.state == GAME_STATE.WAIT) {
        //     const size = fontSize * 2;

        //     this.ctx.font = "20px Helvetica";
        //     this.ctx.fillText("SCORE", REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 4 - size / 2 + 6);

        //     if (this.best !== null) {
        //         this.ctx.font = "14px Arial";
        //         let message = "BEST: " + this.best;
        //         this.ctx.fillText(message, REFERENCE_WIDTH / 2, REFERENCE_HEIGHT / 4 );
        //     }

        //     drawCenteredRect(
        //         this.ctx, REFERENCE_WIDTH / 2,
        //         REFERENCE_HEIGHT / 4 - fontSize / 2,
        //         size, size, null, "white"
        //     );
        // }
    }

    drawInstructions() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        let fontSize = 30;
        this.ctx.font = "bolder " + String(fontSize) + "px Arial";
        this.ctx.fillText("TAP SPACE", REFERENCE_WIDTH / 2, 3 * REFERENCE_HEIGHT / 4);
        this.ctx.fillText("DO NOT FALL", REFERENCE_WIDTH / 2, 3 * REFERENCE_HEIGHT / 4 + fontSize * 1.3);
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
    let actualHeight = window.innerHeight;
    mainCanvas.height = actualHeight;
    mainCanvas.width = actualHeight * 10 / 16;
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
// @TODO factorize drawSquare(...)
// @TODO factorize drawArc(...)
// @TODO movement with correct factor
// @TODO vertical delays are random
