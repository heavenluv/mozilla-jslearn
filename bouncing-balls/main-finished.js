// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const para = document.querySelector('p');
let count = 0;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

class Shape{
  constructor(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
  }
}

// define Ball constructor

class Ball extends Shape{
    constructor(x, y, velX, velY, exists = false, color, size) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    }
  draw= () => {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  };
  update= () => {
    if((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
  };
  collisionDetect = () => {
    for(let j = 0; j < balls.length; j++) {
      if(!(this === balls[j]) && balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
          //making the balls go crazy
          this.velX += random(-5,5);
          this.velY += random(-5,5);
        }
      }
    }
  }
}


class EvilCircle extends Shape {
  constructor(x, y, velX, velY, exists = false, color, size) {
    super(x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
  }

  draw = () => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.stroke();
  };
  checkBounds = () => {
    if((this.x + this.size) >= width) {
      this.x = width - 5;
    }

    if((this.x - this.size) <= 0) {
      this.x = 5;
    }

    if((this.y + this.size) >= height) {
      this.y = height - 5;
    }

    if((this.y - this.size) <= 0) {
      this.y = 5;
    }
  };
  setControls = () => {
    let _this = this;
    window.onkeydown = function(e) {
      if (e.key === 'a') {
        _this.x -= _this.velX;
      } else if (e.key === 'd') {
        _this.x += _this.velX;
      } else if (e.key === 'w') {
        _this.y -= _this.velY;
      } else if (e.key === 's') {
        _this.y += _this.velY;
      }
    }
  };
  collisionDetect = () => {
    for(let j = 0; j < balls.length; j++) {
      if(balls[j].exists) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          //balls[j].color = this.color = 'rgb(' + 0 + ',' + 0 + ',' + 0 +')';
          balls[j].exists = false;
          --count;
        }
      }
    }
  }
  //the pointer like object that can remove balls by moving the cursor
  devour = () => {
    
  }

}

// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errorsß
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  ++count;
}

const evilc = new EvilCircle(random(10, width - 10), random(0, height - 10), 20, 20, true, 'white', 10);
evilc.setControls();

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  for(const ball of balls) {
    if(ball.exists){
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
    evilc.draw()
    evilc.checkBounds();
    evilc.collisionDetect();
    console.log(evilc);
    para.textContent = count;
  }
  requestAnimationFrame(loop);
}

loop();