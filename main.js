const SQUARE_ROOT_2 = 1.41421356237;
const DEGREES = Math.PI/180;
const SHGRAVITY = 6;
const TURNING_DELAY = 400;
const VERTICAL_DELAY = 120; 
const MAIN_CHAR = {
    SIZE: 50
}

class Asteroids{
    constructor(position, color = "green", angle = 0){
        console.log(this);
        this.position = position;
        this.direction = [0, 0];
        this.angle = angle;

        this.still_alive = true;
        this.color = color;
        this.diameter = MAIN_CHAR.SIZE * 1.5;
    };

    draw(ctx){
        var width = this.diameter;

        // Rotated square
        ctx.beginPath();
        ctx.fillStyle= this.color;
        ctx.rect(this.position[0]-width/2,this.position[1]-width/2,width,width);
        ctx.fill();
        ctx.closePath();
    };
}

class Character{
    constructor(position, angle = 0){
        console.log(this);
        this.position = position;
        this.direction = [4, 0];
        this.angle = angle;
        this.boost = 0;

        this.boosting = false;
        this.turning = false;

        this.width = MAIN_CHAR.SIZE;
        this.height = MAIN_CHAR.SIZE;
    };

    draw(ctx){
        // Reference square
        var width = MAIN_CHAR.SIZE;

        // Rotated square
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.position[0], this.position[1]);
        ctx.rotate(this.angle * DEGREES);
        ctx.fillStyle= "rgba(255,255,255,.3)";
        ctx.rect(0-width/2,0-width/2,width,width);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        // Triangle
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.position[0], this.position[1]);
        // ctx.rotate(this.angle * DEGREES);
        ctx.fillStyle= "pink";
        ctx.beginPath();
        if (this.direction[0] < 0){
            ctx.moveTo(-width/2, 0);
            ctx.lineTo(width/2, width/2);
            ctx.lineTo(width/2, -width/2);
        }
        else {
            ctx.moveTo(width/2, 0);
            ctx.lineTo(-width/2, width/2);
            ctx.lineTo(-width/2, -width/2);
        }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
};

const GAME_STATE = {
    WAIT: 0,
    PLAY: 1
}

class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.score = null;
        this.lastScore = null;

        this.reinit();
    };

    reinit(){
        this.switchGameState(GAME_STATE.WAIT);
        this.step = null;
        this.CTRL_spaceWasPressed = false;

        this.mainCharacter = new Character(
            [this.canvas.width/2, this.canvas.height/2]
        );

        this.asteroids = [];
        this.currentAsteroidsNum = 0;

        this.waveNum = 0;

        if (this.score) {
            this.lastScore = this.score;
            this.score = null;
        }
        console.debug(this); // @TODO debug print state method
    }

    run(){ // @TODO timestamp?
        // @TODO handle control : spaceWasReleased?
        if (this.state == GAME_STATE.WAIT){
            if (CTRL_spacePressed) {
                this.CTRL_spaceWasPressed = true;
            }
            else if (this.CTRL_spaceWasPressed && !CTRL_spacePressed)
            {
                this.switchGameState(GAME_STATE.PLAY);
            }
        }
        else if (this.state == GAME_STATE.PLAY){
            this.engine();
        }
        this.draw();
        requestAnimationFrame(() => this.run());
    };

    switchGameState(state){
        console.debug("Switch game state to:");
        this.state = state;
        console.debug(this.state); //DEBUG

        if (this.state == GAME_STATE.WAIT){
            console.debug("Press SPACE to play"); //DEBUG
        }
        else if (this.state == GAME_STATE.PLAY){
            console.debug("We are playing"); //DEBUG
            this.step = 0
        }

        // Reset @TODO
        this.CTRL_spaceWasPressed = false;
    }

    // Engine
    engine() {
        // Auto
        // -- Waves
        // ---- Asteroids
        if (this.currentAsteroidsNum == 0){
            console.debug("Init wave.");
            this.asteroids = [];
            var n = 3; // @TODO Random number
            for (var i = 0; i < n; i++){
                var asteroid = new Asteroids([100,0-i*100],"yellow"); // @TODO Random rainbow color
                asteroid.direction[0] = 2*i+1; // @TODO random + random position also
                this.asteroids.push(asteroid);
            }
            this.currentAsteroidsNum = this.asteroids.length;
            this.waveNum += 1;
        }

        for (asteroid of this.asteroids){
            if (!asteroid.still_alive){
                continue;
            }
            if (asteroid.direction[1] < SHGRAVITY){
                asteroid.direction[1] += 1;
            }

            // -- Horizontal
            newPosition = asteroid.position[0] + asteroid.direction[0];
            if (false){
            //     (newPosition - this.mainCharacter.width/4 > this.canvas.width) || // witdh/2 or width ?
            //     (newPosition + this.mainCharacter.width/4 < 0)
            // ){
                // this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];
            }
            else {
                asteroid.position[0] = newPosition
            }

            // -- Vertical
            newPosition = asteroid.position[1] + asteroid.direction[1];
            if (newPosition > this.canvas.height){
                console.debug("Badaboum.");
                asteroid.still_alive = false;
                this.currentAsteroidsNum -= 1;
                console.debug(this.currentAsteroidsNum);
                console.debug(asteroid.position);
            }
            else{
                asteroid.position[1] = newPosition
            }
        }


        // Control
        // -- U-turn
        if (CTRL_spacePressed && !this.turning){
            if (Date.now() - CTRL_spacePressedTime > TURNING_DELAY){
                this.turning = true;
                this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];
                // this.mainCharacter.boost = 0;
            }
        }

        // -- Boost
        if (this.mainCharacter.direction[1] < SHGRAVITY){
            this.mainCharacter.direction[1] += 1;
        }
        if (this.mainCharacter.boost > 0) {
            this.mainCharacter.boost -= 1;
        }
        if (CTRL_spacePressed && !this.boosting){
            this.mainCharacter.boost = 16;
            this.boosting = true;
        }
        if (this.mainCharacter.position[1] < 0){
            this.mainCharacter.boost = 0;
        }
        if (!CTRL_spacePressed){
            this.boosting = false;
            this.turning = false;
        }

        // Movements
        this.mainCharacter.angle = this.mainCharacter.angle + 1 % 360; // DEBUG
        var newPosition = null;

        // -- Horizontal
        newPosition = this.mainCharacter.position[0] + this.mainCharacter.direction[0];
        if (
            (newPosition - this.mainCharacter.width/4 > this.canvas.width) || // witdh/2 or width ?
            (newPosition + this.mainCharacter.width/4 < 0)
        ){
            // this.mainCharacter.direction[0] = -this.mainCharacter.direction[0];
            if (this.mainCharacter.direction[0] > 0){
                this.mainCharacter.position[0] = 0;
            }
            else{
                this.mainCharacter.position[0] = this.canvas.width;
            }
        }
        else {
            this.mainCharacter.position[0] = newPosition
        }

        // -- Vertical
        newPosition = this.mainCharacter.position[1] + this.mainCharacter.direction[1] - this.mainCharacter.boost;
        if (newPosition + this.mainCharacter.height/2 > this.canvas.height /*this.mainCharacter.height/2*/ ){
            console.debug("Death.");
            this.reinit();
            // this.mainCharacter.direction[1] = 0;
            // this.mainCharacter.position[1] = this.canvas.height - this.mainCharacter.height/2;
        }
        else{
            this.mainCharacter.position[1] = newPosition
        }
    };

    // Graphics
    draw(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);

        if (this.state == GAME_STATE.WAIT){
            this.drawMainScreen();
        }
        else if (this.state == GAME_STATE.PLAY){
            this.drawBackground();
            this.mainCharacter.draw(this.ctx);

            for (var asteroid of this.asteroids){
                asteroid.draw(this.ctx);
            }
        }
        // requestAnimationFrame(() => this.draw());
    }

    drawBackground(){
        const fadeSpeed = 500;
        var intensity = 1;
        if (this.step < fadeSpeed){
            intensity = this.step % fadeSpeed / fadeSpeed; // Fade in blue
        }

        this.ctx.fillStyle = "rgba(0, 0, "+ intensity * 40 + ", 1)";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        // @TODO stars
    }

    drawMainScreen(){
        // @TODO
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
}

// Control
var CTRL_spacePressed = false;
var CTRL_spacePressedTime = null;

function keyDownHandler(e){
    if (e.key == " "){
        if (!CTRL_spacePressed){
            CTRL_spacePressed = true;
            CTRL_spacePressedTime = Date.now();
        }
        // console.debug("Spacebar is pressed"); //DEBUG
        // console.debug(CTRL_spacePressedTime); //DEBUG

    } 
}

function keyUpHandler(e){
    if (e.key == " "){
        CTRL_spacePressed = false;
        // console.debug("Spacebar is not pressed"); //DEBUG
    } 
}

function main() {
    // Initialization
    console.debug("Hello, World!"); //DEBUG

    // -- Canvas
    var mainCanvas = document.createElement("canvas");
    mainCanvas.width  = window.innerWidth;
    mainCanvas.height = window.innerHeight;
    // mainCanvas.width  = window.innerWidth * .9; // DEBUG
    // mainCanvas.height = window.innerHeight * .9; // DEBUG
    document.body.appendChild(mainCanvas);

    // -- Control
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Run
    console.debug("Let's run!"); //DEBUG
    var mainGame = new Game(mainCanvas);
    mainGame.run();
    // var interval = setInterval(() => mainGame.run(), 100); // @TODO clear interval (Chrome)
    // mainGame.draw()
}

main();