var hudFont;

export function setFont(font) {
  hudFont = font;
}

export function draw({ sketch, bombs, shield, score }) {
  var {
    width,
    push,
    pop,
    stroke,
    strokeWeight,
    strokeCap,
    noStroke,
    fill,
    text,
    textSize,
    textFont,
    line,
    SQUARE
  } = sketch;

  if (!hudFont) {
    throw new Error('Please supply a font before rendering the HUD');
  }
  textFont(hudFont);
  push();
  noStroke();
  fill(255);
  textSize(32);
  text(String(score).padStart(8), width - 260, 40);
  text('Ж'.repeat(bombs), 5, 40);
  stroke(100, 100, 255, 200);
  strokeWeight(16);
  strokeCap(SQUARE);
  line(width - 260, 55, width - 260 + shield * 2.5, 55);
  pop();
}
