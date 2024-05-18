"use strict";

function GameWorld() {

    this.whiteBallStartingPosition = new Vector2(413,413);

    this.redBalls = [
    new Ball(new Vector2(1056,433),COLOR.RED),//3
    new Ball(new Vector2(1090,374),COLOR.RED),//4
    new Ball(new Vector2(1126,393),COLOR.RED),//8
    new Ball(new Vector2(1126,472),COLOR.RED),//10;
    new Ball(new Vector2(1162,335),COLOR.RED),//11
    new Ball(new Vector2(1162,374),COLOR.RED),//12
    new Ball(new Vector2(1162,452),COLOR.RED)//14
    ]

    this.yellowBalls = [
    new Ball(new Vector2(1022,413),COLOR.YELLOW),//1
    new Ball(new Vector2(1056,393),COLOR.YELLOW),//2
    new Ball(new Vector2(1090,452),COLOR.YELLOW),//6
    new Ball(new Vector2(1126,354),COLOR.YELLOW),//7
    new Ball(new Vector2(1126,433),COLOR.YELLOW),//9
    new Ball(new Vector2(1162,413),COLOR.YELLOW),//13
    new Ball(new Vector2(1162,491),COLOR.YELLOW)//15
    ];

    this.whiteBall = new Ball(new Vector2(413,413),COLOR.WHITE);
    this.blackBall = new Ball(new Vector2(1090,413),COLOR.BLACK);

    this.balls = [
    this.yellowBalls[0],
    this.yellowBalls[1],
    this.redBalls[0],
    this.redBalls[1],
    this.blackBall,
    this.yellowBalls[2],
    this.yellowBalls[3],
    this.redBalls[2],
    this.yellowBalls[4],
    this.redBalls[3],
    this.redBalls[4],
    this.redBalls[5],
    this.yellowBalls[5],
    this.redBalls[6],
    this.yellowBalls[6],
    this.whiteBall]

    this.stick = new Stick({ x : 413, y : 413 });

    this.gameOver = false;
}

GameWorld.prototype.getBallsSetByColor = function(color) {

    if(color === COLOR.RED) {
        return this.redBalls;
    }
    if(color === COLOR.YELLOW) {
        return this.yellowBalls;
    }
    if(color === COLOR.WHITE) {
        return this.whiteBall;
    }
    if(color === COLOR.BLACK) {
        return this.blackBall;
    }
}

GameWorld.prototype.handleInput = function (delta) {
    this.stick.handleInput(delta);
};

GameWorld.prototype.update = function (delta) {
    this.stick.update(delta);

    for (let i = 0 ; i < this.balls.length; i++){
        for(let j = i + 1 ; j < this.balls.length ; j++){
            this.handleCollision(this.balls[i], this.balls[j], delta);
        }
    }

    for (let i = 0 ; i < this.balls.length; i++) {
        this.balls[i].update(delta);
    }

    if (!this.ballsMoving() && AI.finishedSession) {
        Game.policy.updateTurnOutcome();
        if(Game.policy.foul){
            this.ballInHand();
        }
    }

};

GameWorld.prototype.ballInHand = function() {
    if (AI_ON && Game.policy.turn === AI_PLAYER_NUM) {
        return;
    }

    KEYBOARD_INPUT_ON = false;
    this.stick.visible = false;
    if (!Mouse.left.down) {
        this.whiteBall.position = Mouse.position;
    } else {
        let ballsOverlap = this.whiteBallOverlapsBalls();

        if(!Game.policy.isOutsideBorder(Mouse.position,this.whiteBall.origin) &&
            !Game.policy.isInsideHole(Mouse.position) &&
            !ballsOverlap){
            KEYBOARD_INPUT_ON = true;
            Keyboard.reset();
            Mouse.reset();
            this.whiteBall.position = Mouse.position;
            this.whiteBall.inHole = false;
            Game.policy.foul = false;
            this.stick.position = this.whiteBall.position;
            this.stick.visible = true;
        }
    }

}

GameWorld.prototype.whiteBallOverlapsBalls = function() {

    let ballsOverlap = false;
    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.whiteBall !== this.balls[i]){
            if(this.whiteBall.position.distanceFrom(this.balls[i].position)<BALL_SIZE){
                ballsOverlap = true;
            }
        }
    }

    return ballsOverlap;
}

GameWorld.prototype.ballsMoving = function() {

    let ballsMoving = false;

    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.balls[i].moving){
            ballsMoving = true;
        }
    }

    return ballsMoving;
}

GameWorld.prototype.handleCollision = function(ball1, ball2, delta) {

    if(ball1.inHole || ball2.inHole)
        return;

    if(!ball1.moving && !ball2.moving)
        return;

    var ball1NewPos = ball1.position.add(ball1.velocity.multiply(delta));
    var ball2NewPos = ball2.position.add(ball2.velocity.multiply(delta));

    var dist = ball1NewPos.distanceFrom(ball2NewPos);

    if(dist<BALL_SIZE){
        Game.policy.checkCollisionValidity(ball1, ball2);

        var power = (Math.abs(ball1.velocity.x) + Math.abs(ball1.velocity.y)) + 
                    (Math.abs(ball2.velocity.x) + Math.abs(ball2.velocity.y));
        power = power * 0.00482;

        if(Game.sound && SOUND_ON) {
            var ballsCollide = sounds.ballsCollide.cloneNode(true);
            ballsCollide.volume = (power/20) < 1 ? (power/20) : 1;
            ballsCollide.play();
        }

        var opposite = ball1.position.y - ball2.position.y;
        var adjacent = ball1.position.x - ball2.position.x;
        var rotation = Math.atan2(opposite, adjacent);

        ball1.moving = true;
        ball2.moving = true;

        var velocity2 = new Vector2(90*Math.cos(rotation + Math.PI)*power,90*Math.sin(rotation + Math.PI)*power);
        ball2.velocity = ball2.velocity.addTo(velocity2);

        ball2.velocity.multiplyWith(0.97);

        var velocity1 = new Vector2(90*Math.cos(rotation)*power,90*Math.sin(rotation)*power);
        ball1.velocity = ball1.velocity.addTo(velocity1);

        ball1.velocity.multiplyWith(0.97);
    }

}

GameWorld.prototype.draw = function () {
    Canvas.drawImage(sprites.background);
    Game.policy.drawScores();

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].draw();
    }

    this.stick.draw();
};

GameWorld.prototype.reset = function () {
    this.gameOver = false;

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].reset();
    }

    this.stick.reset();

    if(AI_ON && AI_PLAYER_NUM === 0){
        AI.startSession();
    }
};

GameWorld.prototype.initiateState = function(balls) {
    
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].position.x = balls[i].position.x;
        this.balls[i].position.y = balls[i].position.y;
        this.balls[i].visible = balls[i].visible;
        this.balls[i].inHole = balls[i].inHole;
    }

    this.stick.position = this.whiteBall.position;
}

