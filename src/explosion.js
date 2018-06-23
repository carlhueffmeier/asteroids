var Explosion = {
  maxFrames: 300,

  init({ game, position }) {
    this.game = game;
    this.position = position.copy();
    this.frame = 0;
    if (this.sfx) {
      this.sfx.play();
    }
  },

  update() {
    this.frame += 1;
    if (this.frame >= this.maxFrames) {
      this.game.removeObjects(this);
    }
  },

  draw() {
    var {
      frame,
      maxFrames,
      position: { x, y },
      game: {
        sketch: { push, pop, translate, noStroke, fill, random, ellipse }
      }
    } = this;

    push();
    translate(x, y);
    noStroke();
    if (frame <= maxFrames / 2) {
      fill(255, 239, 0, random(50, 100));
      ellipse(0, 0, frame * 2 + random(15), frame * 2 + random(15));
      fill(215, 0, 0, random(50, 100));
      ellipse(0, 0, frame * 0.1 + random(10), frame * 0.1 + random(10));
    } else if (frame > maxFrames / 2 && frame < maxFrames) {
      fill(255, 239, 0, 150 - (frame / maxFrames) * 150);
      ellipse(0, 0, frame * 2 + random(15), frame * 2 + random(15));
      fill(215, 0, 0, 150 - (frame / maxFrames) * 150);
      ellipse(0, 0, random(15, 20), random(15, 20));
    }
    pop();
  }
};

export default Explosion;
