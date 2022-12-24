let BreakoutGame = function (canvas) {
  let ctx = canvas.getContext("2d");
  let ballRadius = 10;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 2;
  let dy = -2;
  let paddleHeight = 10;
  let paddleWidth = 75;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleDirection = "";
  let rightPressed = false;
  let leftPressed = false;
  let brickRowCount = 5;
  let brickColumnCount = 3;
  let brickWidth = 75;
  let brickHeight = 20;
  let brickPadding = 10;
  let brickOffsetTop = 30;
  let brickOffsetLeft = 30;
  let score = 0;
  let lives = 3;
  let bricks = [];
  let gameAudio = new Audio();
  let brickAudio = new Audio();

  gameAudio.src = "assets/game_music.ogg";
  brickAudio.src = "assets/button.ogg";
  gameAudio.play()
  gameAudio.loop=true

  resizeHandler();

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  addEventListener("keydown", keyDownHandler);
  addEventListener("keyup", keyUpHandler);
  addEventListener("mousemove", mouseMoveHandler);
  addEventListener("touchstart", touchStartHandler);
  addEventListener("touchend", touchEndHandler);
  addEventListener("click", clickHandler);

  function resizeHandler() {
    let scaleX = innerWidth / canvas.width;
    let scaleY = innerHeight / canvas.height;
    let scaleToFit = Math.min(scaleX, scaleY);
    let scaleToCover = Math.max(scaleX, scaleY);

    canvas.style.transform = `scale(${scaleToFit})  translate(-50%, -50%)`;
  }
  function keyDownHandler(e) {
    if (e.code == "ArrowRight") {
      rightPressed = true;
    } else if (e.code == "ArrowLeft") {
      leftPressed = true;
    }
  }
  function keyUpHandler(e) {
    if (e.code == "ArrowRight") {
      rightPressed = false;
    } else if (e.code == "ArrowLeft") {
      leftPressed = false;
    }
  }
  function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }
  function touchStartHandler(e) {
    e.preventDefault();
    gameAudio.play();
    let relativeX = e.targetTouches[0].screenX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      if (relativeX < paddleX) {
        paddleDirection = "left";
      }
      if (relativeX > paddleX) {
        paddleDirection = "right";
      }
    }
  }
  function touchEndHandler(e) {
    paddleDirection = "";
  }
  function clickHandler() {
    gameAudio.play();
  }
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        let b = bricks[c][r];
        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            brickAudio.play();
            score++;
            if (score == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
          let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "brown";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#e8eb34";
    ctx.fillText("Score: " + score, 8, 20);
  }
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (paddleDirection == "left") {
      paddleX -= 10;
    }
    if (paddleDirection == "right") {
      paddleX += 10;
    }
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          //alert("GAME OVER");
          //  document.location.reload();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
  }

  draw();
  return this;
};
