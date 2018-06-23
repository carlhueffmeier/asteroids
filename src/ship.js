import Asteroid from './asteroid';
import Laser from './laser';
import Bomb from './bomb';
import Explosion from './explosion';
import { $ } from './bling';

var Ship = {
  //************************
  // Initialization
  init({ game }) {
    var { createVector } = game.sketch;
    this.game = game;
    this.size = 10;
    this.position = createVector();
    this.velocity = createVector();

    this.setupEventHandlers();
    this.reset();
  },

  setupEventHandlers() {
    $('body').on('keydown', event => {
      var { key } = event;
      if (key === 'ArrowLeft') {
        this.turn(-1);
      } else if (key === 'ArrowRight') {
        this.turn(1);
      } else if (key === 'ArrowUp') {
        this.thrust(true);
      } else if (key === 'Shift') {
        this.shield(true);
      } else if (key === ' ') {
        this.shoot();
      } else if (key === 'Enter') {
        this.dropBomb();
      }
      return false;
    });

    $('body').on('keyup', event => {
      var { key } = event;
      if (['ArrowLeft', 'ArrowRight'].includes(key)) {
        this.turn(0);
      } else if (key === 'ArrowUp') {
        this.thrust(false);
      } else if (key === 'Shift') {
        this.shield(false);
      }
      return false;
    });
  },

  reset() {
    var { width, height, HALF_PI } = this.game.sketch;
    this.isThrusting = false;
    this.position.set(width / 2, height / 2);
    this.velocity.set(0, 0);
    this.heading = HALF_PI;
    this.rotation = 0;
    this.afterBurn = 0;
    this.isImmortal = true;
    this.immortalCounter = 500;
    this.shieldEnergy = 100;
    this.isShielded = false;
    this.bombs = 3;
  },

  //************************
  // Update
  update() {
    if (this.isImmortal) {
      this.immortalCounter--;
      if (this.immortalCounter == 0) {
        this.isImmortal = false;
      }
    }

    if (this.isShielded) {
      this.shieldEnergy -= 0.5; // reduce shield energy when shielded
      if (this.shieldEnergy <= 0) {
        this.isShielded = false; // turn off shield when energy is depleted
      }
    } else if (this.shieldEnergy < 100) {
      this.shieldEnergy += 0.5; // regenerate energy when inactive
    }

    this.move();
    this.checkEdges();
  },

  move() {
    var { createVector } = this.game.sketch;
    this.heading += this.rotation;
    if (this.isThrusting) {
      this.velocity.add(createVector(0, -2).rotate(this.heading));
    }
    this.velocity.mult(0.97).limit(4);
    if (this.isImmortal) {
      this.velocity.limit(1.5);
    }
    this.position.add(this.velocity);
  },

  checkEdges() {
    var {
      size,
      position,
      game: {
        sketch: { width, height }
      }
    } = this;
    if (position.x > width + size) {
      position.x = -size;
    }
    if (position.x < -size) {
      position.x = width + size;
    }
    if (position.y > height + size) {
      position.y = -size;
    }
    if (position.y < -size) {
      position.y = height + size;
    }
  },

  //************************
  // Collision handling
  supportsCollisions: true,

  boundingRadius() {
    return this.size;
  },

  getPosition() {
    return this.position;
  },

  handleCollision(gameObj) {
    if (Asteroid.isPrototypeOf(gameObj) && !this.isInvincible()) {
      this.explode();
    }
  },

  isInvincible() {
    return this.isImmortal || this.isShielded;
  },

  //************************
  // Actions
  thrust(isThrusting) {
    this.isThrusting = isThrusting;
    this.afterBurn = 1;
    if (isThrusting) {
      this.thrustSFX.loop();
    } else {
      this.thrustSFX.stop();
    }
  },

  shield(isShielded) {
    if (!this.isImmortal) {
      this.isShielded = isShielded;
    }
  },

  turn(direction) {
    this.rotation = direction * 0.15;
  },

  explode() {
    var { game, position } = this;
    var explosion = Object.create(Explosion);
    explosion.init({ game, position });
    this.game.addObjects(explosion);
    this.game.score = Math.max(this.game.score - 5000, 0);
    this.reset();
  },

  shoot() {
    var { game, position, heading } = this;
    var laser = Object.create(Laser);
    laser.init({ game, position, heading });
    game.addObjects(laser);
  },

  dropBomb() {
    var { game, position } = this;
    if (this.bombs > 0) {
      let bomb = Object.create(Bomb);
      bomb.init({ game, position });
      this.game.addObjects(bomb);
      this.bombs -= 1;
    }
  },

  //************************
  // Drawing
  draw() {
    var {
      position: { x, y },
      game: {
        sketch: { push, pop, translate, rotate }
      }
    } = this;

    push();
    translate(this.position.x, this.position.y);
    rotate(this.heading);
    this.drawAfterburner();
    this.drawShip();

    if (this.isImmortal) {
      this.drawImmortalState();
    }

    if (this.isShielded) {
      this.drawShield();
    }

    pop();
  },

  drawShip() {
    var {
      size,
      game: {
        sketch: { fill, stroke, triangle }
      }
    } = this;

    fill(0);
    stroke(255);
    triangle(-size, size, 0, -size * 2, size, size);
  },

  drawAfterburner() {
    var {
      afterBurn,
      game: {
        sketch: { noStroke, fill, ellipse, random }
      }
    } = this;

    if (afterBurn > 0.1 && random() > 0.3) {
      noStroke();
      fill(255, 239, 0, 100 * afterBurn);
      ellipse(
        0,
        40 * afterBurn,
        15 * afterBurn + 10,
        40 * afterBurn + 10 + 10 * random()
      );
      fill(215, 0, 0, afterBurn * 200 * random());
      ellipse(0, 18 * afterBurn, 14 * afterBurn, 10 * afterBurn);
      if (!this.isThrusting) {
        this.afterBurn *= 0.8;
      }
    }
  },

  drawImmortalState() {
    var {
      size,
      game: {
        sketch: {
          stroke,
          strokeWeight,
          noFill,
          rotate,
          beginShape,
          endShape,
          vertex,
          cos,
          sin,
          frameCount,
          CLOSE,
          TWO_PI
        }
      }
    } = this;

    stroke(255, 0, 0, this.immortalCounter / 3 + 50);
    strokeWeight(3);
    noFill();
    rotate(((frameCount % 500) / 500) * TWO_PI - this.heading);
    if (frameCount % 2 == 0) {
      rotate(TWO_PI / 8);
    }
    beginShape();
    for (var i = 0; i < 4; i++) {
      var angle = (TWO_PI / 4) * i;
      vertex(size * 3 * cos(angle), size * 3 * sin(angle));
    }
    endShape(CLOSE);
  },

  drawShield() {
    var {
      size,
      game: {
        sketch: {
          frameCount,
          stroke,
          strokeWeight,
          random,
          noFill,
          rotate,
          TWO_PI,
          beginShape,
          endShape,
          vertex,
          sin,
          cos,
          CLOSE
        }
      }
    } = this;

    stroke(100, 100, 255, 200 + sin(frameCount / 10) * 40);
    strokeWeight(random(3, 6));
    noFill();
    rotate(((frameCount % 500) / 500) * TWO_PI - this.heading);
    if (frameCount % 2 == 0) {
      rotate(TWO_PI / 8);
    }
    beginShape();
    for (var i = 0; i < 4; i++) {
      var angle = (TWO_PI / 4) * i;
      vertex(size * 3 * cos(angle), size * 3 * sin(angle));
    }
    endShape(CLOSE);
  }
};

export default Ship;
