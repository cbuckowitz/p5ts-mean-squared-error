// GLOBAL VARS & TYPES

class Trail {
  private steps: p5.Vector[] = [];
  private decay: number = 0.5;

  addStep($pos: p5.Vector): void {
    this.steps.push(createVector($pos.x, $pos.y, 255));
  }

  draw($options?: { stroke?: p5.Color; weigth?: number }): void {
    let col = $options.stroke ?? color("lightblue");

    push();
    stroke(col);
    strokeWeight($options.weigth ?? 3);

    for (let step of this.steps) {
      col.setAlpha(step.z);
      stroke(col);
      point(step.x, step.y);
      step.z -= this.decay;
    }

    this.steps = this.steps.filter(($step, $idx) => $step.z > 0);

    pop();
  }
}

class MatPlot {
  private width: number;
  private heigth: number;
  private x_min: number;
  private x_max: number;
  private y_min: number;
  private y_max: number;
  private pos_x: number;
  private pos_y: number;

  private scale_x: number;
  private scale_y: number;

  top: number;
  bottom: number;
  left: number;
  right: number;

  constructor(
    $width: number,
    $heigth: number,
    $x_min: number,
    $x_max: number,
    $y_min: number,
    $y_max: number,
    $pos_x: number,
    $pos_y: number
  ) {
    this.width = $width;
    this.heigth = $heigth;
    this.x_min = $x_min;
    this.x_max = $x_max;
    this.y_min = $y_min;
    this.y_max = $y_max;
    this.pos_x = $pos_x;
    this.pos_y = $pos_y;

    this.top = this.pos_y;
    this.bottom = this.pos_y + this.heigth;
    this.left = this.pos_x;
    this.right = this.pos_x + this.width;

    function scale($max: number, $min: number, $size: number): number {
      return $size / ($max - $min);
    }

    this.scale_x = scale(this.x_max, this.x_min, this.width);
    this.scale_y = scale(this.y_max, this.y_min, this.heigth);
  }

  protected screenX($x: number): number {
    return this.boxX(this.scale_x * ($x - this.x_min) + this.pos_x);
  }

  protected screenY($y: number): number {
    return this.boxY(this.bottom - this.scale_y * ($y - this.y_min));
  }

  protected mapX($x: number): number {
    return ($x - this.left) / this.scale_x + this.x_min;
  }

  protected mapY($y: number): number {
    return (this.bottom - $y) / this.scale_y + this.y_min;
  }

  protected boxX($x: number): number {
    if ($x < this.left) return this.left;
    if ($x > this.right) return this.right;
    return $x;
  }

  protected boxY($y: number): number {
    if ($y < this.top) return this.top;
    if ($y > this.bottom) return this.bottom;
    return $y;
  }

  protected drawLine($x1: number, $y1: number, $x2: number, $y2: number, $color: p5.Color = color(0), $weigth = 1) {
    push();
    stroke($color);
    strokeWeight($weigth);

    line($x1, $y1, $x2, $y2);
    pop();
  }

  line($x1: number, $y1: number, $x2: number, $y2: number, $color: p5.Color = color(0), $weigth = 1) {
    this.drawLine(this.screenX($x1), this.screenY($y1), this.screenX($x2), this.screenY($y2), $color, $weigth);
  }

  plotPos($x: number, $y: number): p5.Vector | undefined {
    if ($x >= this.left && $x <= this.right && $y >= this.top && $y <= this.bottom) {
      return createVector(this.mapX($x), this.mapY($y));
    }
  }

  screenPos($x: number, $y: number): p5.Vector | undefined {
    return createVector(this.screenX($x), this.screenY($y));
  }

  background($color: p5.Color) {
    push();
    fill($color);
    noStroke();

    fill($color);

    rect(this.pos_x, this.pos_y, this.width, this.heigth);

    pop();
  }

  vertical($x: number, $color: p5.Color = color(0), $weigth = 1) {
    this.line($x, this.y_min, $x, this.y_max, $color, $weigth);
  }

  horizontal($y: number, $color: p5.Color = color(0), $weigth = 1) {
    this.line(this.x_min, $y, this.x_max, $y, $color, $weigth);
  }

  grid($spacing: p5.Vector, $color: p5.Color = color(0), $weigth = 1) {
    // vertical grid lines
    for (let x = 0; x <= this.x_max; x += $spacing.x) {
      this.vertical(x, $color, $weigth);
    }
    for (let x = 0; x >= this.x_min; x -= $spacing.x) {
      this.vertical(x, $color, $weigth);
    }

    // horizontal grid lines
    for (let y = 0; y <= this.y_max; y += $spacing.y) {
      this.horizontal(y, $color, $weigth);
    }
    for (let y = 0; y >= this.y_min; y -= $spacing.y) {
      this.horizontal(y, $color, $weigth);
    }
  }

  xAxis($spacing: number, $ticklen: Number = 5, $color: p5.Color = color(0), $weigth = 1) {
    this.horizontal(0, $color, $weigth);

    for (let x = 0; x <= this.x_max; x += $spacing) {
      this.line(x, 0, x, -$ticklen, $color, $weigth);
    }

    for (let x = 0; x >= this.x_min; x -= $spacing) {
      this.line(x, 0, x, -$ticklen, $color, $weigth);
    }
  }

  yAxis($spacing: number, $ticklen: Number = 5, $color: p5.Color = color(0), $weigth = 1) {
    this.vertical(0, $color, $weigth);

    for (let y = 0; y <= this.y_max; y += $spacing) {
      this.line(0, y, -$ticklen, y, $color, $weigth);
    }
    for (let y = 0; y >= this.y_min; y -= $spacing) {
      this.line(0, y, -$ticklen, y, $color, $weigth);
    }
  }

  mark($x: number, $y: number, $color: p5.Color = color(0), $symbol = "x", $weigth = 1, $size = 1): void {
    let sx = this.screenX($x);
    let sy = this.screenY($y);
    let d = (this.width * $size) / 100;

    push();
    stroke($color);
    strokeWeight($weigth);

    switch ($symbol) {
      case "x": {
        line(sx - d, sy - d, sx + d, sy + d);
        line(sx - d, sy + d, sx + d, sy - d);

        break;
      }
    }

    pop();
  }

  rect(
    $x: number,
    $y: number,
    $width: number,
    $heigth: number,
    $options: { fill?: p5.Color; stroke?: p5.Color; weight?: number } = {}
  ): void {
    let x1 = this.screenX($x);
    let y1 = this.screenY($y);
    let width = this.screenX($x + $width) - x1;
    let heigth = this.screenY($y + $heigth) - y1;

    push();

    if ($options.stroke == null) {
      noStroke();
    } else {
      stroke($options.stroke);
      strokeWeight($options.weight ?? 1);
    }

    fill($options.fill ?? color(0));

    rect(x1, y1, width, heigth);

    pop();
  }

  plot($formula: ($x: number) => number, $color: p5.Color = color(0), $weigth = 1) {
    let lsx = undefined;
    let lsy = undefined;

    for (let sx = this.left; sx <= this.right; sx++) {
      let x = this.mapX(sx);
      let y = $formula(x);

      let sy = this.screenY(y);

      if (lsx == undefined) {
        lsx = sx;
      }

      if (lsy == undefined) {
        lsy = sy;
      }

      if ((sy < this.bottom && sy > this.top) || (lsy < this.bottom && lsy > this.top)) {
        this.drawLine(lsx, lsy, sx, sy, $color, $weigth);
      }

      lsy = sy;
      lsx = sx;
    }
  }
}

let plot: MatPlot;
let msqe: MatPlot;
let trailSqr: Trail;
let trailD: Trail;
let data: [number, number][] = [
  [2, 2],
  [3, 3],
  [-5, -2],
  [5, 2],
  [-2, 3],
];

// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  // FULLSCREEN CANVAS
  // let canvas = createCanvas(windowWidth, windowHeight);
  windowResized();
  // SHAPES ARE DRAWN FROM THE CENTER
  // rectMode(CENTER);

  plot = new MatPlot(480, 480, -10, 10, -10, 10, 10, 10);
  msqe = new MatPlot(480, 480, -2, 2, -10, 100, 510, 10);
  trailSqr = new Trail();
  trailD = new Trail();
  // THIS WILL SET THE FRAMERATE TO 30.
  // NOTE: THIS IS -NOT- REQUIRED
  // frameRate(60);
}

let z = 0;

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  // CLEAR BACKGROUND
  background(255);

  plot.background(color(255));

  plot.grid(createVector(1, 1), color(128, 100), 1);
  plot.xAxis(5, 0.5);
  plot.xAxis(1, 0.2);
  plot.yAxis(5, 0.5);
  plot.yAxis(1, 0.2);

  z += 0.01;
  // plot.plot(($x) => $x * $x * tan(z) * $x + $x * $x + $x * sin(z) + cos(z), color("blue"), 2);

  let f1 = ($x: number) => cos(z) * $x * $x * $x + sin(z) * $x * $x + sin(z) * 2;
  let f2 = ($x: number) => sin(z) * $x + 3*sin(z * 0.1);

  // plot.plot(f1, color("blue"), 2);
  plot.plot(f2, color("green"), 2);

  let dy = abs(f2(2) - 2);

  let sumSqr = 0;
  let sumD = 0;

  for (let sample of data) {
    let sx = sample[0];
    let sy = sample[1];
    plot.mark(sx, sy, color("red"));

    let fx = sx;
    let fy = f2(fx);
    let d = sy - fy;

    sumSqr += d * d;
    sumD += abs(d);

    plot.rect(fx, fy, abs(d), d, { fill: color(255, 165, 0, 100) });

    plot.line(fx, fy, sx, sy, color(0, 165, 255, 100), 5);
  }

  let meanSqr = sumSqr / data.length;
  let meanD = sumD / data.length;

  msqe.xAxis(0.5, 2);
  msqe.xAxis(0.1, 0.5);
  // msqe.xAxis(5, 0.2);
  msqe.yAxis(10, 0.1);
  msqe.grid(createVector(0.5, 10), color(128, 100), 1);

  msqe.mark(sin(z), meanSqr, color(255, 165, 0));

  msqe.mark(sin(z), meanSqr, color(255, 165, 0));
  msqe.mark(sin(z), meanD, color(0, 165, 255));

  let step = trailSqr.addStep(msqe.screenPos(sin(z), meanSqr));
  trailD.addStep(msqe.screenPos(sin(z), meanD));

  trailSqr.draw({ stroke: color(255, 165, 0) });
  trailD.draw({ stroke: color(0, 165, 255) });

  // msqe.yAxis(5, 0.2);

  // TRANSLATE TO CENTER OF SCREEN
  // translate(width / 2, height / 2);

  // DRAW EACH SHAPE
  // for (var i = 0; i < numberOfShapes; i++) {
  //   const shape = shapeCollection[i];

  //   // UPDATE SHAPE ROTATION
  //   shape.angle += (numberOfShapes - i) * (speed / 1000);

  //   // DRAW SHAPE
  //   strokeWeight(3 + i);
  //   ShapesHelper.draw(shape);
  // }
}

// @ts-ignore
function mouseReleased(event?: object): void {
  let v = plot.plotPos(mouseX, mouseY);

  if (v) {
    data.push([v.x, v.y]);
  }
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
// @ts-ignore
function windowResized() {
  // createCanvas(windowWidth, windowHeight);

  let canvas = createCanvas(1000, windowHeight);
  canvas.parent('sketch');

  console.log("🛸 Window resized");
}

// INITIALIZE THE SHAPES ARRAY
// function initShapes() {
//   shapeCollection = [];
//   const colorsArr = ColorHelper.getColorsArray(numberOfShapes);
//   for (let i = 0; i < numberOfShapes; i++) {
//     const radius = 20 * i;
//     // shapeCollection.push(ShapesHelper.StarShape(radius, colorsArr[i]));
//     shapeCollection.push(ShapesHelper.PolygonShape(radius, colorsArr[i], 3 + i));
//   }
// }
