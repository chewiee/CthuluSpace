(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var GameView = CthuluSpace.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
  };

  var mouseMove = function (e) {

    if (!this.clickIndicator) {
      var vel = [
        this.game.cthulu[0].pos[0] - e.clientX,
        this.game.cthulu[0].pos[1] - e.clientY
      ]
      vel = CthuluSpace.Util.dir(vel);
      vel[0] = vel[0] * 100;
      vel[1] = vel[1] * 100;


      if (vel[1] < -0.3) {
        if (!this.directionIndicator) {
          this.directionIndicator = new CthuluSpace.DirectionIndicator({
            pos: this.game.cthulu[0].pos,
            vel: vel,
            game: this.game
          })
          this.game.indicators.push(this.directionIndicator);
        } else {
          this.directionIndicator.vel = vel;
        }
      }
    }
  };

  var startClick = function (e) {
    var vel = [
      this.game.cthulu[0].pos[0] - e.clientX,
      this.game.cthulu[0].pos[1] - e.clientY
    ]
    vel = CthuluSpace.Util.dir(vel);
    vel[0] = vel[0] * 10;
    vel[1] = vel[1] * 10;

    if (vel[1] < -0.3  && !this.game.cthulu[0].endPos) {
      this.game.remove(this.directionIndicator);
      this.clickIndicator = this.game.addClickIndicator({
        pos: this.game.cthulu[0].pos,
        vel: vel,
        active: true
      });
    }
  };

  var endClick = function() {
    if (!!this.clickIndicator) {
      this.clickIndicator.active = false;
      this.clickIndicator.resolveClick();
    }
  };

  GameView.prototype.bindClickHandlers = function () {
    var canvasEl = document.getElementsByTagName("canvas")[0];

    canvasEl.addEventListener('mousemove', mouseMove.bind(this), false);
    canvasEl.addEventListener('mousedown', startClick.bind(this), false);
    canvasEl.addEventListener('mouseup', endClick.bind(this), false);
  };

  GameView.prototype.start = function () {
    this.game.bounceObjects.push(new CthuluSpace.MovingObject({
      pos: [400, 200],
      vel: [0,0],
      radius: 100,
      color: "#FFFFFF",
      game: this.game
    }))

    this.game.addCthulu();

    this.bindClickHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function (time) {
    var timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    if (this.game.gameOver) {
      console.log("starting over");

      var canvasEl = document.getElementsByTagName("canvas")[0];
      var canvasClone = canvasEl.cloneNode(true);
      canvasEl.parentNode.replaceChild(canvasClone, canvasEl)

      this.game = new CthuluSpace.Game();
      this.ctx = canvasClone.getContext("2d");

      this.start();
    } else {
      requestAnimationFrame(this.animate.bind(this));
    }

  };
})();
