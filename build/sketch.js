var Trail = (function () {
    function Trail() {
        this.steps = [];
        this.decay = 0.5;
    }
    Trail.prototype.addStep = function ($pos) {
        this.steps.push(createVector($pos.x, $pos.y, 255));
    };
    Trail.prototype.draw = function ($options) {
        var _a, _b;
        var col = (_a = $options.stroke) !== null && _a !== void 0 ? _a : color("lightblue");
        push();
        stroke(col);
        strokeWeight((_b = $options.weigth) !== null && _b !== void 0 ? _b : 3);
        for (var _i = 0, _c = this.steps; _i < _c.length; _i++) {
            var step = _c[_i];
            col.setAlpha(step.z);
            stroke(col);
            point(step.x, step.y);
            step.z -= this.decay;
        }
        this.steps = this.steps.filter(function ($step, $idx) { return $step.z > 0; });
        pop();
    };
    return Trail;
}());
var MatPlot = (function () {
    function MatPlot($width, $heigth, $x_min, $x_max, $y_min, $y_max, $pos_x, $pos_y) {
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
        function scale($max, $min, $size) {
            return $size / ($max - $min);
        }
        this.scale_x = scale(this.x_max, this.x_min, this.width);
        this.scale_y = scale(this.y_max, this.y_min, this.heigth);
    }
    MatPlot.prototype.screenX = function ($x) {
        return this.boxX(this.scale_x * ($x - this.x_min) + this.pos_x);
    };
    MatPlot.prototype.screenY = function ($y) {
        return this.boxY(this.bottom - this.scale_y * ($y - this.y_min));
    };
    MatPlot.prototype.mapX = function ($x) {
        return ($x - this.left) / this.scale_x + this.x_min;
    };
    MatPlot.prototype.mapY = function ($y) {
        return (this.bottom - $y) / this.scale_y + this.y_min;
    };
    MatPlot.prototype.boxX = function ($x) {
        if ($x < this.left)
            return this.left;
        if ($x > this.right)
            return this.right;
        return $x;
    };
    MatPlot.prototype.boxY = function ($y) {
        if ($y < this.top)
            return this.top;
        if ($y > this.bottom)
            return this.bottom;
        return $y;
    };
    MatPlot.prototype.drawLine = function ($x1, $y1, $x2, $y2, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        push();
        stroke($color);
        strokeWeight($weigth);
        line($x1, $y1, $x2, $y2);
        pop();
    };
    MatPlot.prototype.line = function ($x1, $y1, $x2, $y2, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        this.drawLine(this.screenX($x1), this.screenY($y1), this.screenX($x2), this.screenY($y2), $color, $weigth);
    };
    MatPlot.prototype.plotPos = function ($x, $y) {
        if ($x >= this.left && $x <= this.right && $y >= this.top && $y <= this.bottom) {
            return createVector(this.mapX($x), this.mapY($y));
        }
    };
    MatPlot.prototype.screenPos = function ($x, $y) {
        return createVector(this.screenX($x), this.screenY($y));
    };
    MatPlot.prototype.background = function ($color) {
        push();
        fill($color);
        noStroke();
        fill($color);
        rect(this.pos_x, this.pos_y, this.width, this.heigth);
        pop();
    };
    MatPlot.prototype.vertical = function ($x, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        this.line($x, this.y_min, $x, this.y_max, $color, $weigth);
    };
    MatPlot.prototype.horizontal = function ($y, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        this.line(this.x_min, $y, this.x_max, $y, $color, $weigth);
    };
    MatPlot.prototype.grid = function ($spacing, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        for (var x = 0; x <= this.x_max; x += $spacing.x) {
            this.vertical(x, $color, $weigth);
        }
        for (var x = 0; x >= this.x_min; x -= $spacing.x) {
            this.vertical(x, $color, $weigth);
        }
        for (var y = 0; y <= this.y_max; y += $spacing.y) {
            this.horizontal(y, $color, $weigth);
        }
        for (var y = 0; y >= this.y_min; y -= $spacing.y) {
            this.horizontal(y, $color, $weigth);
        }
    };
    MatPlot.prototype.xAxis = function ($spacing, $ticklen, $color, $weigth) {
        if ($ticklen === void 0) { $ticklen = 5; }
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        this.horizontal(0, $color, $weigth);
        for (var x = 0; x <= this.x_max; x += $spacing) {
            this.line(x, 0, x, -$ticklen, $color, $weigth);
        }
        for (var x = 0; x >= this.x_min; x -= $spacing) {
            this.line(x, 0, x, -$ticklen, $color, $weigth);
        }
    };
    MatPlot.prototype.yAxis = function ($spacing, $ticklen, $color, $weigth) {
        if ($ticklen === void 0) { $ticklen = 5; }
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        this.vertical(0, $color, $weigth);
        for (var y = 0; y <= this.y_max; y += $spacing) {
            this.line(0, y, -$ticklen, y, $color, $weigth);
        }
        for (var y = 0; y >= this.y_min; y -= $spacing) {
            this.line(0, y, -$ticklen, y, $color, $weigth);
        }
    };
    MatPlot.prototype.mark = function ($x, $y, $color, $symbol, $weigth, $size) {
        if ($color === void 0) { $color = color(0); }
        if ($symbol === void 0) { $symbol = "x"; }
        if ($weigth === void 0) { $weigth = 1; }
        if ($size === void 0) { $size = 1; }
        var sx = this.screenX($x);
        var sy = this.screenY($y);
        var d = (this.width * $size) / 100;
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
    };
    MatPlot.prototype.rect = function ($x, $y, $width, $heigth, $options) {
        var _a, _b;
        if ($options === void 0) { $options = {}; }
        var x1 = this.screenX($x);
        var y1 = this.screenY($y);
        var width = this.screenX($x + $width) - x1;
        var heigth = this.screenY($y + $heigth) - y1;
        push();
        if ($options.stroke == null) {
            noStroke();
        }
        else {
            stroke($options.stroke);
            strokeWeight((_a = $options.weight) !== null && _a !== void 0 ? _a : 1);
        }
        fill((_b = $options.fill) !== null && _b !== void 0 ? _b : color(0));
        rect(x1, y1, width, heigth);
        pop();
    };
    MatPlot.prototype.plot = function ($formula, $color, $weigth) {
        if ($color === void 0) { $color = color(0); }
        if ($weigth === void 0) { $weigth = 1; }
        var lsx = undefined;
        var lsy = undefined;
        for (var sx = this.left; sx <= this.right; sx++) {
            var x = this.mapX(sx);
            var y = $formula(x);
            var sy = this.screenY(y);
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
    };
    return MatPlot;
}());
var plot;
var msqe;
var trailSqr;
var trailD;
var data = [
    [2, 2],
    [3, 3],
    [-5, -2],
    [5, 2],
    [-2, 3],
];
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    var canvas = createCanvas(1000, windowHeight);
    canvas.parent('sketch');
    plot = new MatPlot(480, 480, -10, 10, -10, 10, 10, 10);
    msqe = new MatPlot(480, 480, -2, 2, -10, 100, 510, 10);
    trailSqr = new Trail();
    trailD = new Trail();
}
var z = 0;
function draw() {
    background(255);
    plot.background(color(255));
    plot.grid(createVector(1, 1), color(128, 100), 1);
    plot.xAxis(5, 0.5);
    plot.xAxis(1, 0.2);
    plot.yAxis(5, 0.5);
    plot.yAxis(1, 0.2);
    z += 0.01;
    var f1 = function ($x) { return cos(z) * $x * $x * $x + sin(z) * $x * $x + sin(z) * 2; };
    var f2 = function ($x) { return sin(z) * $x + 3 * sin(z * 0.1); };
    plot.plot(f2, color("green"), 2);
    var dy = abs(f2(2) - 2);
    var sumSqr = 0;
    var sumD = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var sample = data_1[_i];
        var sx = sample[0];
        var sy = sample[1];
        plot.mark(sx, sy, color("red"));
        var fx = sx;
        var fy = f2(fx);
        var d = sy - fy;
        sumSqr += d * d;
        sumD += abs(d);
        plot.rect(fx, fy, abs(d), d, { fill: color(255, 165, 0, 100) });
        plot.line(fx, fy, sx, sy, color(0, 165, 255, 100), 5);
    }
    var meanSqr = sumSqr / data.length;
    var meanD = sumD / data.length;
    msqe.xAxis(0.5, 2);
    msqe.xAxis(0.1, 0.5);
    msqe.yAxis(10, 0.1);
    msqe.grid(createVector(0.5, 10), color(128, 100), 1);
    msqe.mark(sin(z), meanSqr, color(255, 165, 0));
    msqe.mark(sin(z), meanSqr, color(255, 165, 0));
    msqe.mark(sin(z), meanD, color(0, 165, 255));
    var step = trailSqr.addStep(msqe.screenPos(sin(z), meanSqr));
    trailD.addStep(msqe.screenPos(sin(z), meanD));
    trailSqr.draw({ stroke: color(255, 165, 0) });
    trailD.draw({ stroke: color(0, 165, 255) });
}
function mouseReleased(event) {
    var v = plot.plotPos(mouseX, mouseY);
    if (v) {
        data.push([v.x, v.y]);
    }
}
function windowResized() {
    createCanvas(windowWidth, windowHeight);
    console.log("🛸 Window resized");
}
//# sourceMappingURL=sketch.js.map