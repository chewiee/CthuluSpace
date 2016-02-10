(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var ClickIndicator = CthuluSpace.ClickIndicator = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = 5;
    this.active = options.active;
    this.color = "#FFA500";
    this.game = options.game;


  };

  ClickIndicator.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.game.cthulu[0].pos[0], this.game.cthulu[0].pos[1]);
    ctx.strokeStyle=this.color;
    ctx.stroke();
  };

  var NORMAL_FRAME_TIME_DELTA = 1000/60;

  ClickIndicator.prototype.setLength = function (timeDelta) {
    if (!this.active) {
      this.game.remove(this);
    } else {
      var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

      if (this.game.isOutOfBounds(this.pos)) {
        this.game.remove(this);
      }
    }
  };
})();
