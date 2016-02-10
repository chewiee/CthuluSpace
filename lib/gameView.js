(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var GameView = CthuluSpace.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.cthulu = this.game.addCthulu();
  };

  GameView.prototype.bindClickHandlers = function () {
    var canvasEl = document.getElementsByTagName("canvas")[0];

    canvasEl.addEventListener('mousedown', function(e) {
      var vel = [
        this.game.cthulu[0].pos[0] - e.clientX,
        this.game.cthulu[0].pos[1] - e.clientY
      ]
      vel = CthuluSpace.Util.dir(vel);
      vel[0] = vel[0] * 5;
      vel[1] = vel[1] * 5;

      if (vel[1] < -0.3) {
        this.clickIndicator = this.game.addClickIndicator({
          pos: this.game.cthulu[0].pos,
          vel: vel,
          active: true
        });
      }
    }.bind(this), false);

    canvasEl.addEventListener('mouseup', function() {
      if (!!this.clickIndicator) {
        this.clickIndicator.active = false;
      }
    }.bind(this), false);

  };

  GameView.prototype.start = function () {
    this.bindClickHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function (time) {
    var timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  };
})();
