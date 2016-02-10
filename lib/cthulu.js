(function () {
  if (typeof CthuluSpace === "undefined") {
    window.CthuluSpace = {};
  }

  var Cthulu = CthuluSpace.Cthulu = function (options) {
    options.radius = 20;
    options.vel = options.vel || [0, 0];
    options.color = options.color || "#ADFF2F"

    CthuluSpace.MovingObject.call(this, options);
  };

  CthuluSpace.Util.inherits(Cthulu, CthuluSpace.MovingObject);

})();
