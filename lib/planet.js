(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var PlanetTypes = function (type) {
    switch (type) {
      case "earth":
        return {
          radius: 50,
          vel: [0, 0],
          color: "#FFFFFF",
          scoreValue: 100
        }
        break;
      case "mercury":
        break;
      case "saturn":
        break;
      case "station":
        break;
      case "asteroid":
        break;
    }
  };

  var Planet = CthuluSpace.Planet = function (options) {
    options = CthuluSpace.Util.extend(options, PlanetTypes(options.type));

    CthuluSpace.MovingObject.call(this, options);
  }

  CthuluSpace.Util.inherits(Planet, CthuluSpace.MovingObject);
})();
