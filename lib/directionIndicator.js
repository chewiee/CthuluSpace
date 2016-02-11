(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var DirectionIndicator = CthuluSpace.DirectionIndicator = function (options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = 5;
    this.color = "#FFA500";
    this.game = options.game;
  };

  DirectionIndicator.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0] + this.vel[0], this.pos[1] + this.vel[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
    ctx.moveTo(this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]);
    ctx.lineTo(this.game.cthulu[0].pos[0], this.game.cthulu[0].pos[1]);
    ctx.strokeStyle=this.color;
    ctx.stroke();
  };

})();
