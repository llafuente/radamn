//copyright: http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

//init radamn first!
(function() {
    require("../lib/radamn.js");
    var canvas = document.createElement('canvas');
    canvas.height = 640;
    canvas.width = 640;
    var ctx = canvas.getContext('2d'); // this create the window with the proper size
}());




// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "/resources/lostdecadegames/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "/resources/lostdecadegames/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "/resources/lostdecadegames/monster.png";

// Game objects
var hero = {
    speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

document.addEventListener("keydown", function (e) {
    keysDown[e.char.toLowerCase()] = true;
}, false);

document.addEventListener("keyup", function (e) {
    delete keysDown[e.char.toLowerCase()];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
    if ("up" in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if ("down" in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if ("left" in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if ("right" in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main;
main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();
    console.log("render");

    then = now;
    window.requestAnimationFrame(main);
};

// Let's play this game!
reset();
var then = Date.now();
//setInterval(main, 1); // Execute as fast as possible <-- Radamn dont need this, either the browser, use requestAnimationFrame!!!

window.requestAnimationFrame(main);

Radamn.on("quit", function(e) { //quit event
    Radamn.quit();
});

Radamn.on("keydown", function(e) {
    if (e.char == "F5") {
        Radamn.getWindow().screenshot();
    } else if (e.char == "Escape") {
        Radamn.quit();
    }
});