var Bomb = {
  maxFrames: 250,
  initialRadius: 20,
  blastRadius: 300,

  init({ game, position }) {
    this.game = game;
    this.radius = 0;
    this.frames = 0;
    this.position = position.copy();
    if (this.sfx) {
      this.sfx.play();
    }
  },

  //************************
  // Update
  update() {
    this.frames += 1;
    if (this.frames >= this.maxFrames) {
      this.game.removeObjects(this);
      return;
    }
    this.radius =
      this.initialRadius +
      (this.frames / this.maxFrames) * (this.blastRadius - this.initialRadius);
  },

  //************************
  // Collision handling
  supportsCollisions: true,

  boundingRadius() {
    return this.radius;
  },

  getPosition() {
    return this.position;
  },

  //************************
  // Drawing
  draw() {
    var {
      radius,
      frames,
      maxFrames,
      position: { x, y },
      game: {
        sketch: {
          push,
          pop,
          stroke,
          strokeWeight,
          translate,
          noFill,
          rotate,
          TWO_PI,
          beginShape,
          endShape,
          vertex,
          cos,
          sin,
          CLOSE,
          ellipse
        }
      }
    } = this;

    push();
    translate(x, y);
    stroke(255, 0, 0, 200 - this.frames / 3);
    strokeWeight(8);
    noFill();
    rotate((frames / maxFrames) * TWO_PI);
    if (frames % 3 === 0) {
      rotate(TWO_PI / 8);
    }
    if (frames % 3 === 1) {
      rotate(TWO_PI / 16);
    }
    beginShape();
    for (var i = 0; i < 4; i++) {
      var angle = (TWO_PI / 4) * i;
      vertex(radius * cos(angle), radius * sin(angle));
    }
    endShape(CLOSE);
    ellipse(0, 0, radius * 2, radius * 2);
    pop();
  }
};

export default Bomb;
