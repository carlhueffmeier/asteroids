export function fixBindings(sketch) {
  var fnsToBind = [
    'push',
    'pop',
    'stroke',
    'noStroke',
    'strokeWeight',
    'strokeCap',
    'fill',
    'noFill',
    'line',
    'ellipse',
    'triangle',
    'translate',
    'rotate',
    'beginShape',
    'endShape',
    'vertex',
    'cos',
    'sin',
    'text',
    'textFont',
    'textSize'
  ];
  // Honest question: is this bad?
  // I know bind creates a new function, meaning I have copy of each function in
  // memory that can't be garbage collected. (which is obvious if I run
  // hasOwnProperty)
  // I don't want to cry wolf and optimize at the wrong end, but it seems to
  // circumvent the prototype mechanism and feels wrong. What's the best
  // practice here?
  fnsToBind.forEach(fn => {
    sketch[fn] = sketch[fn].bind(sketch);
  });
}

export function without(array, valuesToOmit) {
  return array.filter(value => !valuesToOmit.includes(value));
}

export function stableSort(array, compareFn) {
  for (let i = 1; i < array.length; i += 1) {
    for (let j = i; j > 0; j -= 1) {
      if (compareFn(array[j - 1], array[j]) <= 0) {
        break;
      }
      swap(array, j, j - 1);
    }
  }
  function swap(array, ia, ib) {
    [array[ia], array[ib]] = [array[ib], array[ia]];
  }
}
