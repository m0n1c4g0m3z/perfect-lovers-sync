let lastSecond = -1;
let env, osc;
let audioActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  noCursor();

  env = new p5.Envelope();
  env.setADSR(0.001, 0.05, 0, 0.1);
  env.setRange(0.2, 0);

  osc = new p5.Oscillator('sine');
  osc.freq(600);
  osc.amp(env);
  osc.start();
  osc.amp(0);
}

function mousePressed() {
  userStartAudio();  // Activar el contexto de audio
  audioActive = !audioActive;
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  let r = min(width, height) / 4;
  let offset = r;

  drawClock(-offset, 0, r);
  drawClock(offset, 0, r);

  let sc = second();
  if (sc !== lastSecond) {
    lastSecond = sc;
    if (audioActive) {
      env.play();
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
