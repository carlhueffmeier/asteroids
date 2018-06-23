import Starfield from './starfield';
import Asteroid from './asteroid';
import Ship from './ship';
import { without, stableSort } from './helper';

var Game = {
  init({ sketch }) {
    this.sketch = sketch;
    this.score = 0;
    this.player = Object.create(Ship);
    this.asteroidSpawnInterval = 5e3;
    this.asteroidSpawnTime = Date.now() + this.asteroidSpawnInterval;
    var numberOfAsteroids = 6;
    var asteroids = Array.from({ length: numberOfAsteroids }, () =>
      Object.create(Asteroid)
    );
    var starfield = Object.create(Starfield);
    this.gameObjects = [starfield, this.player, ...asteroids];
    this.gameObjects.map(obj => obj.init({ game: this }));
  },

  update() {
    if (Date.now() >= this.asteroidSpawnTime) {
      this.spawnAsteroid();
      this.asteroidSpawnTime = Date.now() + this.asteroidSpawnInterval;
    }
    this.gameObjects.map(obj => obj.update());
    this.detectCollisions();
  },

  spawnAsteroid() {
    if (this.gameObjects.length > 30) {
      return;
    }
    let asteroid = Object.create(Asteroid);
    asteroid.init({ game: this });
    this.addObjects(asteroid);
  },

  draw() {
    stableSort(this.gameObjects, (a, b) => (a.zLayer || 0) - (b.zLayer || 0));
    this.gameObjects.map(obj => obj.draw());
  },

  //************************
  // Game object management
  addObjects(...objectsToAdd) {
    this.gameObjects = [...this.gameObjects, ...objectsToAdd];
  },

  removeObjects(...objectsToRemove) {
    this.gameObjects = without(this.gameObjects, objectsToRemove);
  },

  //************************
  // Collision handling
  detectCollisions() {
    var { gameObjects } = this;
    var collisions = [];
    for (let a of gameObjects) {
      for (let b of gameObjects) {
        if (a === b) continue;
        if (!a.supportsCollisions || !b.supportsCollisions) continue;
        if (this.areColliding(a, b)) {
          collisions.push([a, b]);
        }
      }
    }
    this.notifyCollisions(collisions);
  },

  areColliding(a, b) {
    var distance = this.getDistance(a, b);
    return distance < a.boundingRadius() + b.boundingRadius();
  },

  getDistance(a, b) {
    var { dist } = this.sketch;
    var { x: ax, y: ay } = a.getPosition();
    var { x: bx, y: by } = b.getPosition();
    return dist(ax, ay, bx, by);
  },

  notifyCollisions(collisions) {
    collisions.forEach(function notifyCollision([a, b]) {
      if (a.handleCollision) a.handleCollision(b);
      if (b.handleCollision) b.handleCollision(a);
    });
  }
};

export default Game;
