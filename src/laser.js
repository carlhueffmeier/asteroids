import Asteroid from './asteroid';

var Laser = {
  radius: 5,

  init({ game, position, heading }) {
    var { createVector } = game.sketch;
    this.game = game;
    this.position = position.copy();
    this.heading = heading;
    this.velocity = createVector(0, -10).rotate(this.heading);
    if (this.sfx) {
      this.sfx.play();
    }
  },

  //************************
  // Update
  update() {
    this.move();
    this.checkEdges();
  },

  move() {
    this.position.add(this.velocity);
  },

  checkEdges() {
    var {
      position: { x, y },
      game: {
        sketch: { width, height }
      }
    } = this;
    if (x > width || x < 0 || y > height || y < 0) {
      this.game.removeObjects(this);
    }
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

  handleCollision(gameObj) {
    if (Asteroid.isPrototypeOf(gameObj)) {
      this.game.removeObjects(this);
    }
  },

  //************************
  // Drawing
  draw() {
    var {
      position: { x, y },
      heading,
      game: {
        sketch: { push, pop, translate, rotate, stroke, fill, ellipse }
      }
    } = this;

    push();
    translate(x, y);
    rotate(heading);
    stroke(250, 150, 150, 50);
    fill(250, 100, 100, 100);
    ellipse(0, 0, 5, 30);
    pop();
  }
};

export default Laser;
