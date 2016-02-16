(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var Cthulu = CthuluSpace.Cthulu = function (options) {
    options.radius = 20;
    options.vel = options.vel || [0, 0];
    options.color = options.color || "#ADFF2F"
    this.launchSteps = 0;
    this.moving = false;

    CthuluSpace.MovingObject.call(this, options);
  };

  CthuluSpace.Util.inherits(Cthulu, CthuluSpace.MovingObject);

  Cthulu.prototype.launchCthulu = function (pos) {
    this.moving = true;
    this.endPos = pos;
    this.launchSteps = 1;
    this.vel = [
      (this.endPos[0] - this.pos[0]) / 40,
      (this.endPos[1] - this.pos[1]) / 40
    ]
    this.image = new Image();
    this.image.onload = function () {
      this.imageLoaded = true;
    }.bind(this);
    this.image.src = 'lib/images/cthulu0.gif';
  };

  Cthulu.prototype.checkForStop = function () {
    if (!!this.endPos && this.pos[1] <= this.endPos[1]) {
      this.pos = this.endPos;
      this.moving = false;
      this.radius = 20;
      this.launchSteps = 0;
      this.vel = [0,0];
      this.endPos = undefined;
      this.game.checkForLanded();
    }

    if (this.launchSteps > 0) {
      this.radius = (50 - (0.075*(this.launchSteps - 20)*(this.launchSteps - 20)));
      this.launchSteps = this.launchSteps + 1;
    }
  };

})();
