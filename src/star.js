var Star = {
  init({ sketch }) {
    var { random, width, height } = sketch;
    this.sketch = sketch;
    this.x = random(width);
    this.y = random(height);
    this.r = random(2, 6);

    if (random(100) < 20) {
      this.color = {
        r: random(100, 255),
        g: random(100, 255),
        b: random(100, 255)
      };
    } else {
      this.color = { r: 255, g: 255, b: 255 };
    }
  },

  draw() {
    var { push, pop, stroke, strokeWeight, fill, ellipse } = this.sketch;
    push();
    strokeWeight(3);
    stroke(this.color.r, this.color.g, this.color.b, 100);
    fill(255, 255, 255, 200);
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }
};

export default Star;
