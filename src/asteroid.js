import Ship from './ship';
import Laser from './laser';
import Bomb from './bomb';

var Asteroid = {
  //************************
  // Initialization
  init({ game, x, y, radius, timeOfDeath }) {
    var { createVector, random } = game.sketch;
    this.game = game;
    this.position = createVector();
    if (x && y) {
      this.setPosition(x, y);
    } else {
      this.setRandomStartingPosition();
    }
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.rotation = random(-0.01, 0.01);
    this.heading = 0;
    this.radius = radius || game.sketch.random(30, 80);
    this.surface = this.createSurface();
    this.timeOfDeath = timeOfDeath;
  },

  setPosition(x, y) {
    this.position.set(x, y);
  },

  setRandomStartingPosition() {
    var { random, width, height } = this.game.sketch;
    var x = random(width);
    var y = random(height);
    // Move to a random edge
    if (random([true, false])) {
      x = random([true, false]) ? width : 0;
    } else {
      y = random([true, false]) ? height : 0;
    }
    this.setPosition(x, y);
  },

  createSurface() {
    var {
      radius,
      game: {
        sketch: { random }
      }
    } = this;
    var roughness = 0.2;
    var minPoints = 8;
    var maxPoints = 25;
    return Array.from(
      { length: Math.floor(random(minPoints, maxPoints + 1)) },
      () => random(-radius * roughness, radius * roughness)
    );
  },

  //************************
  // Update
  update() {
    if (this.timeOfDeath && this.timeOfDeath < Date.now()) {
      this.game.removeObjects(this);
    }
    this.move();
  },

  move() {
    this.position.add(this.velocity);
    this.heading += this.rotation;
    this.checkEdges();
  },

  checkEdges() {
    var {
      radius,
      game: {
        sketch: { width, height }
      }
    } = this;
    if (this.position.x > width + radius) {
      this.position.x = -radius;
    }
    if (this.position.x < -radius) {
      this.position.x = width + radius;
    }
    if (this.position.y > height + radius) {
      this.position.y = -radius;
    }
    if (this.position.y < -radius) {
      this.position.y = height + radius;
    }
  },

  //************************
  // Drawing
  draw() {
    var {
      radius,
      game: {
        sketch: {
          push,
          pop,
          translate,
          rotate,
          stroke,
          strokeWeight,
          fill,
          beginShape,
          endShape,
          vertex,
          cos,
          sin,
          CLOSE,
          TWO_PI
        }
      }
    } = this;

    push();
    translate(this.position.x, this.position.y);
    rotate(this.heading);
    strokeWeight(1);
    stroke(255);
    fill(0);
    beginShape();
    var numberOfPoints = this.surface.length;
    for (var i = 0; i < numberOfPoints; i++) {
      var angle = (TWO_PI / numberOfPoints) * i;
      vertex(
        (radius + this.surface[i]) * cos(angle),
        (radius + this.surface[i]) * sin(angle)
      );
    }
    endShape(CLOSE);
    pop();
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
    if (
      Ship.isPrototypeOf(gameObj) ||
      Laser.isPrototypeOf(gameObj) ||
      Bomb.isPrototypeOf(gameObj)
    ) {
      this.breakToPieces();
      this.game.score += Math.floor(this.radius);
    }
  },

  breakToPieces() {
    var {
      game,
      position: { x, y },
      radius
    } = this;

    if (radius > 10) {
      var pieces = [];
      for (let i = 0; i < 2; i += 1) {
        pieces.push(Object.create(Asteroid));
      }
      pieces.map(piece => {
        piece.init({ game, x, y, radius: radius / 2 });
        if (radius / 2 < 15) {
          piece.timeOfDeath = Date.now() + 2000;
        }
      });
      game.addObjects(...pieces);
    }
    game.removeObjects(this);
    return pieces;
  }
};

export default Asteroid;
