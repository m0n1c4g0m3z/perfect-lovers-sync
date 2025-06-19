let lastSecond = -1;
let env1, osc1, env2, osc2, reverb;
let audioActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noCursor();

  env1 = new p5.Envelope();
  env1.setADSR(0.01, 0.05, 0, 0.1);
  env1.setRange(0.4, 0);

  osc1 = new p5.Oscillator('square');
  osc1.freq(1800);
  osc1.amp(env1);
  osc1.start();
  osc1.amp(0);

  env2 = new p5.Envelope();
  env2.setADSR(0.05, 0.4, 0, 1.0);
  env2.setRange(0.7, 0);

  osc2 = new p5.Oscillator('triangle');
  osc2.freq(80);
  osc2.amp(env2);
  osc2.start();
  osc2.amp(0);

  reverb = new p5.Reverb();
  reverb.process(osc2, 6, 4);
}

function mousePressed() {
  userStartAudio();
  audioActive = !audioActive;
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  let r = min(width, height) / 4;
  let offset = r;

  drawClock(-offset, 0, r);
  drawClock(offset, 0, r);

  // Paneo dinámico entre -1 y 1
  let pan = sin(frameCount * 0.01);
  osc1.pan(pan);      // "tic" oscila suavemente
  osc2.pan(-pan);     // "toc" en contrafase

  let sc = second();
  if (sc !== lastSecond) {
    lastSecond = sc;
    if (audioActive) {
      if (sc % 2 === 0) {
        env1.play();
      } else {
        env2.play();
      }
    }
  }
}

function drawClock(x, y, radius) {
  push();
  translate(x, y);
  noFill();
  stroke(255);
  strokeWeight(2);
  ellipse(0, 0, radius * 2);

  let hr = hour() % 12;
  let mn = minute();
  let sc = second();

  strokeWeight(4);
  let hourAngle = map(hr + mn / 60, 0, 12, 0, 360) - 90;
  line(0, 0, cos(hourAngle) * radius * 0.5, sin(hourAngle) * radius * 0.5);

  strokeWeight(3);
  let minuteAngle = map(mn + sc / 60, 0, 60, 0, 360) - 90;
  line(0, 0, cos(minuteAngle) * radius * 0.7, sin(minuteAngle) * radius * 0.7);

  strokeWeight(1.5);
  let secondAngle = map(sc, 0, 60, 0, 360) - 90;
  line(0, 0, cos(secondAngle) * radius * 0.9, sin(secondAngle) * radius * 0.9);
  pop();
}
