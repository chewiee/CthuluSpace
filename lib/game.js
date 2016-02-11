(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var Game = CthuluSpace.Game = function () {
    this.cthulu = [];
    this.indicators = [];
    this.bounceObjects = [];
    this.gameOver = false;
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = 600;
  Game.DIM_Y = 800;
  Game.FPS = 60;

  Game.prototype.addClickIndicator = function (options) {
    options.game = this;
    var clickIndicator = new CthuluSpace.ClickIndicator(options);

    this.indicators.push(clickIndicator);

    return clickIndicator;
  }

  Game.prototype.addCthulu = function () {
    this.cthulu = [new CthuluSpace.Cthulu({pos: [300, 600], game: this})]

    return this.cthulu[0];
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.bounceObjects, this.indicators, this.cthulu);
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach(function (object) {
      if (object instanceof CthuluSpace.MovingObject) {
        object.move(delta);
      }
    });
  };

  Game.prototype.remove = function (object) {
    if (object instanceof CthuluSpace.Cthulu) {
      this.cthulu.splice(this.cthulu.indexOf(object), 1);
    } else if (object instanceof CthuluSpace.MovingObject) {
      this.bounceObjects.splice(this.bounceObjects.indexOf(object), 1);
    } else if (object instanceof CthuluSpace.ClickIndicator ||
      object instanceof CthuluSpace.DirectionIndicator) {
      this.indicators.splice(this.indicators.indexOf(object), 1);
    } else {
      throw "i cant believe you've done this";
    }
  };

  Game.prototype.setIndicators = function (delta) {
    this.indicators.forEach(function (indicator) {
      if (indicator instanceof CthuluSpace.ClickIndicator) {
        indicator.setLength(delta);
      }
    })
  };

  Game.prototype.centerOnCthulu = function () {
    if (this.cthulu[0].pos[1] < 600) {
      var yDelta = this.cthulu[0].pos[1] - 600;

      if (!!this.cthulu[0].endPos) {
        this.cthulu[0].endPos[1] = this.cthulu[0].endPos[1] - yDelta;
      }

      this.allObjects().forEach(function (object) {
        object.pos[1] = object.pos[1] - yDelta;
      })
    }
  };

  Game.prototype.checkForLanded = function () {
    var landed = false;
    this.bounceObjects.forEach(function (object) {
      if (CthuluSpace.Util.dist(this.cthulu[0].pos, object.pos) < object.radius) {
        landed = true;
      }
    }.bind(this));

    if (landed) {

    } else {
      this.gameOver = true;
    }
  }

  Game.prototype.step = function (delta) {
    this.moveObjects(delta);
    this.setIndicators(delta);
    if (!!this.cthulu[0]) {
      this.cthulu[0].checkForStop();
      this.centerOnCthulu();
    }
  }


})();