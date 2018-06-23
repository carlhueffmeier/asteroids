import Star from './star';

var Starfield = {
  init({ game, numberOfStars = 30 }) {
    this.game = game;
    this.stars = Array.from({ length: numberOfStars }, () =>
      Object.create(Star)
    );
    this.stars.map(star => star.init({ sketch: game.sketch }));
  },

  update() {
    var { sketch } = this.game;
    for (let i = 0; i < this.stars.length; i += 1) {
      this.stars[i].x -= 0.2;
      if (this.stars[i].x < -10) {
        this.stars[i] = Object.create(Star);
        this.stars[i].init({ sketch });
        this.stars[i].x = sketch.width + 10;
      }
    }
  },

  zLayer: -1,
  draw() {
    for (let i = 0; i < this.stars.length; i += 1) {
      this.stars[i].draw();
    }
  }
};

export default Starfield;
