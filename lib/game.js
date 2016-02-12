(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var Game = CthuluSpace.Game = function () {
    this.cthulu = [];
    this.indicators = [];
    this.planets = [];
    this.score = 0;
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

  Game.prototype.addPlanet = function (planetOptions) {
    this.planets.push(new CthuluSpace.Planet(planetOptions));
  }

  Game.prototype.allObjects = function () {
    return [].concat(this.planets, this.indicators, this.cthulu);
  };

  Game.prototype.randomXPos = function () {
    return (Math.floor(Math.random() * (Game.DIM_X - 200)) + 100);
  };

  Game.prototype.createPlanets = function () {
    if (this.planets.length === 0) {
      this.addPlanet({pos: [this.randomXPos(), 351], type: "earth", game: this})
      this.addPlanet({pos: [this.randomXPos(), 151], type: "earth", game: this})
    }

    if (this.planets[this.planets.length - 1].pos[1] > 150) {
      this.addPlanet({pos: [this.randomXPos(), -50], type: "earth", game: this})
    }
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    ctx.font = "30px Anton";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + this.score, 10, 40);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < -100) ||
      (pos[0] > Game.DIM_X) || (pos[1] > (Game.DIM_Y + 100));
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
      this.planets.splice(this.planets.indexOf(object), 1);
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
      this.score += Math.floor(-yDelta / 5);

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
    this.planets.forEach(function (object) {
      if (CthuluSpace.Util.dist(this.cthulu[0].pos, object.pos) < (object.radius + 10)) {
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
    this.createPlanets();
  }


})();
