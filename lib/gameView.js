(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var GameView = CthuluSpace.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.clicking = false;
  };

  var mouseMove = function (e) {
    if (!this.clicking && !this.game.cthulu[0].moving) {
      var canvasRect = document.getElementsByTagName("canvas")[0].getBoundingClientRect();

      var vel = [
        this.game.cthulu[0].pos[0] - (e.clientX - canvasRect.left),
        this.game.cthulu[0].pos[1] - (e.clientY - canvasRect.top)
      ]
      vel = CthuluSpace.Util.dir(vel);
      vel[0] = vel[0] * 100;
      vel[1] = vel[1] * 100;


      if (vel[1] < -0.3) {
        if (!this.directionIndicator) {
          this.game.indicators = [];
          this.directionIndicator = new CthuluSpace.DirectionIndicator({
            pos: this.game.cthulu[0].pos,
            vel: vel,
            game: this.game
          })
          this.game.indicators.push(this.directionIndicator);
        } else {
          this.directionIndicator.pos = this.game.cthulu[0].pos;
          this.directionIndicator.vel = vel;
        }
      }
    }
  };

  var startClick = function (e) {
    var canvasRect = document.getElementsByTagName("canvas")[0].getBoundingClientRect();

    this.clicking = true;
    this.game.cthulu[0].image = CthuluSpace.ImageLoader.cthuluLaunching;

    var vel = [
      this.game.cthulu[0].pos[0] - (e.clientX - canvasRect.left),
      this.game.cthulu[0].pos[1] - (e.clientY - canvasRect.top)
    ]
    vel = CthuluSpace.Util.dir(vel);
    vel[0] = vel[0] * (10 + this.game.planetsEaten / 40);
    vel[1] = vel[1] * (10 + this.game.planetsEaten / 40);

    if (vel[1] < -0.3  && !this.game.cthulu[0].endPos) {
      if (this.directionIndicator) {this.game.remove(this.directionIndicator)};
      this.directionIndicator = undefined;
      this.clickIndicator = this.game.addClickIndicator({
        pos: this.game.cthulu[0].pos,
        vel: vel,
        active: true
      });
    }
  };

  var endClick = function() {
    this.clicking = false;
    this.game.cthulu[0].image = CthuluSpace.ImageLoader.cthuluNormal;

    if (!!this.clickIndicator && !this.game.cthulu[0].endPos) {
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

  GameView.prototype.startImageLoad = function () {
    if(CthuluSpace.ImageLoader.loaded >= CthuluSpace.ImageLoader.totalLoad) {
      this.start()
    } else {
      setTimeout(function () {
        this.startImageLoad();
      }.bind(this), 200);
    }
  };

  GameView.prototype.start = function () {
    this.game.addCthulu();

    this.directionIndicator = new CthuluSpace.DirectionIndicator({
      pos: this.game.cthulu[0].pos,
      vel: [0, -100],
      game: this.game
    })

    this.game.indicators.push(this.directionIndicator);

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

      setTimeout(function () {
        var canvasEl = document.getElementsByTagName("canvas")[0];
        var canvasClone = canvasEl.cloneNode(true);
        canvasEl.parentNode.replaceChild(canvasClone, canvasEl)

        this.game = new CthuluSpace.Game();
        this.ctx = canvasClone.getContext("2d");

        this.start();
      }.bind(this), 2000);
    } else {
      requestAnimationFrame(this.animate.bind(this));
    }

  };
})();
