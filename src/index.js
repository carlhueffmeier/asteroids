import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import Game from './game';
import Ship from './ship';
import Explosion from './explosion';
import Bomb from './bomb';
import Laser from './laser';
import * as hud from './hud';
import { fixBindings } from './helper';

var mySketch = sketch => {
  var bgm;
  var game = Object.create(Game);

  //************************
  // Initialization
  sketch.preload = function preload() {
    var { loadSound, loadFont } = sketch;
    bgm = loadSound('assets/resistors.mp3');
    Explosion.sfx = loadSound('assets/explosion.wav');
    Bomb.sfx = loadSound('assets/laser-charge.mp3');
    Bomb.sfx.playMode('restart');
    Laser.sfx = loadSound('assets/laser.wav');
    Ship.thrustSFX = loadSound('assets/thruster.m4a');
    hud.setFont(loadFont('assets/PressStart2P-Regular.ttf'));
  };

  sketch.setup = function setup() {
    // Fix methods that require `this` to be bound to sketch
    fixBindings(sketch);
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    bgm.loop();
    game.init({ sketch });
  };

  //************************
  // Game Loop
  sketch.draw = function draw() {
    sketch.background(0);
    game.update();
    game.draw();
    hud.draw({
      sketch,
      score: game.score,
      bombs: game.player.bombs,
      shield: game.player.shieldEnergy
    });
  };
};

new p5(mySketch);
