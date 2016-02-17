(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var PlanetTypes = function (type) {
    var earthImages = [
      CthuluSpace.ImageLoader.earth1,
      CthuluSpace.ImageLoader.earth2,
      CthuluSpace.ImageLoader.earth3,
      CthuluSpace.ImageLoader.earth4,
      CthuluSpace.ImageLoader.earth5,
    ]
    switch (type) {
      case "earth":
        return {
          radius: 50,
          vel: [0, 0],
          color: "#FFFFFF",
          image: earthImages[Math.floor(Math.random()*earthImages.length)],
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
    this.type = options.type;
    options = CthuluSpace.Util.extend(options, PlanetTypes(options.type));

    CthuluSpace.MovingObject.call(this, options);
  };

  CthuluSpace.Util.inherits(Planet, CthuluSpace.MovingObject);

})();
