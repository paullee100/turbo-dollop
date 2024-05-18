"use strict";

const requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameSingleton() {
    this.size = undefined;
    this.spritesStillLoading = 0;
    this.gameWorld = undefined;
    this.sound = true;

    this.mainMenu = new Menu();
}

GameSingleton.prototype.start = function(divName, canvasName, x, y) {
    this.size = new Vector2(x, y);
    Canvas.init(divName, canvasName);
    this.loadAssets();
    this.assetLoadingLoop();
}

GameSingleton.prototype.init = function() {
    this.gameWorld = new GameWorld();
    this.policy = new GamePolicy();

    this.initMenus();

    AI.init(this.gameWorld, this.policy);
}

GameSingleton.prototype.initMenus = function(inGame) {

    let labels = generateMainMenuLabels("Classic 8-Ball");

    let buttons = generateMainMenuButtons(inGame);

    this.mainMenu.init(
        sprites.mainMenuBackground,
        labels,
        buttons,
        sounds.jazzTune
    );
}

GameSingleton.prototype.loadSprite = function(imageName) {
    console.log("Loading sprite: " + imageName);
    const image = new Image();
    image.src = imageName;
    this.spritesStillLoading++;
    image.onload = function() {
        Game.spritesStillLoading--;
    };
    return image;
}

GameSingleton.prototype.assetLoadingLoop = function() {
    if (!this.spritesStillLoading > 0) {
        requestAnimationFrame(Game.assetLoadingLoop);
    } else {
        Game.init();
        requestAnimationFrame(this.mainMenu.load.bind(this.mainMenu));
    }
}

GameSingleton.prototype.handleInput = function() {

    if (Keyboard.down(Keys.escape)) {
        GAME_STOPPED = true;
        Game.initMenus(true);
        requestAnimationFrame(Game.mainMenu.load.bind(this.mainMenu));
    }
}

GameSingleton.prototype.startNewGame = function() {
    Canvas._canvas.style.cursor = "auto";

    Game.gameWorld = new GameWorld();
    Game.policy = new GamePolicy();

    Canvas.clear();
    Canvas.drawImage(
        sprites.controls,
        new Vector2(Game.size.x/2, Game.size.y/2),
        0,
        1,
        new Vector2(sprites.controls.width/2, sprites.controls.height/2)
    );

    setTimeout(() => {
        AI.init(Game.gameWorld, Game.policy);

        if (AI_ON && AI_PLAYER_NUM == 0) {
            AI.startSession();
        }
        Game.mainLoop();
    }, 5000);
}

GameSingleton.prototype.continueGame = function() {
    Canvas._canvas.style.cursor = "auto";

    requestAnimationFrame(Game.mainLoop);
}

GameSingleton.prototype.mainLoop = function() {

    if (DISPLAY && !GAME_STOPPED) {
        Game.gameWorld.handleInput(DELTA);
        Game.gameWorld.update(DELTA);
        Canvas.clear();
        Game.gameWorld.draw();
        Mouse.reset();
        Game.handleInput();
        requestAnimationFrame(Game.mainLoop);
    }
}

let Game = new GameSingleton();