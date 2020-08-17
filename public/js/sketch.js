var taxies = [];
function windowResized() {
    resizeCanvas(windowWidth, windowHeight, WEBGL);//3Dの場合は引数にWEBGLを忘れずに！
    canvas.position(0, 0);
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');//canvasを後ろに移動する
    img = loadImage('../pic/3367.png');
    for (let i = 0; i < 10; ++i) {
        taxies.push(new taxi_right(random(-width / 2, width / 2), ((i + 1) * 100) - height / 2, -random(4, 8)));
    }
}
function draw() {
    background(255);
    for (let i = 0; i < taxies.length; ++i) {
        taxies[i].judge_colide();
        taxies[i].move();
        taxies[i].draw();
    }
    for (let i = 0; i < taxies.length - 1; ++i) {
        stroke(random(255), random(255), random(255), 100); // 線の色
        strokeWeight(10); // 線の太さ
        line(taxies[i].x + img.width / 6, taxies[i].y, taxies[i + 1].x + img.width / 6, taxies[i + 1].y)
        if (i < taxies.length - 2) {
            stroke(random(255), random(255), random(255), 100); // 線の色
            strokeWeight(10); // 線の太さ
            line(taxies[i].x + img.width / 6, taxies[i].y, taxies[i + 2].x + img.width / 6, taxies[i + 2].y)
        }

    }
}

class taxi_right {
    constructor(x, y, speed) {
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.init_x = width / 2;
    }
    move() {
        this.x += this.speed;
    }

    draw() {
        image(img, this.x, this.y, img.width / 3, img.height / 3);
    }

    judge_colide() {
        if (this.x < -width / 2 - img.width / 3) {
            this.x = this.init_x;
        }
    }
}