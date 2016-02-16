(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var MovingObject = CthuluSpace.MovingObject = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.scoreValue = options.scoreValue || 0;
    this.game = options.game;
  };

  MovingObject.prototype.draw = function (ctx) {
    if (this.imageLoaded) {
      ctx.drawImage(
        this.image,
        this.pos[0] - this.radius,
        this.pos[1] - this.radius,
        this.radius * 2,
        this.radius * 2
      )
    } else {
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.arc(
        this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
      );
      ctx.fill();
    }
  };

  var NORMAL_FRAME_TIME_DELTA = 1000/60;

  MovingObject.prototype.move = function (timeDelta) {
    var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.game.isOutOfBounds(this.pos)) {
      this.remove();
    }
  };

  MovingObject.prototype.remove = function () {
    this.game.remove(this);
  };

})();
