// Canvas와 Context를 가져옵니다.
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// 플레이어 설정
let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 12 // 플레이어의 이동 속도
};

// 플레이어가 발사할 수 있는 총알 배열
let bullets = [];
let bulletSpeed = 10; // 총알의 이동 속도
let bulletWidth = 8; // 총알의 너비
let bulletHeight = 16; // 총알의 높이

// 적 배열
let enemies = [];
let enemySpeed = 3; // 적의 이동 속도
let maxEnemies = 5; // 최대 적의 수
let enemySpawnInterval = 2000; // 적이 생성되는 간격 (ms)
let lastSpawnTime = 0; // 마지막 적 생성 시간

// 점수 초기화 및 표시
let score = 0;
let scoreElement = document.getElementById("scoreValue");
scoreElement.textContent = score;

// 플레이어 이동 함수
function movePlayer(direction) {
  if (direction === "left" && player.x > 0) {
    player.x -= player.speed;
  } else if (direction === "right" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

// 총알 발사 함수
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - bulletWidth / 2, // 총알 중앙으로 설정
    y: player.y,
    width: bulletWidth,
    height: bulletHeight
  });
}

// 적 생성 함수 (2개씩 생성)
function spawnEnemies() {
  for (let i = 0; i < 2; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: 0,
      width: 50,
      height: 50,
      speed: enemySpeed // 기존 적과 동일한 속도로 설정
    });
  }
}

// 적 이동 함수
function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemySpeed;

    // 적이 바닥에 닿으면 게임 오버
    if (enemy.y > canvas.height) {
      gameOver();
    }
  });
}

// 충돌 감지 함수
function checkCollisions() {
  bullets.forEach(bullet => {
    enemies.forEach(enemy => {
      if (bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y) {
        // 충돌 시 총알과 적 제거
        bullets.splice(bullets.indexOf(bullet), 1);
        enemies.splice(enemies.indexOf(enemy), 1);
        score += 10;
        scoreElement.textContent = score;

        // 점수가 100점을 초과할 때마다 적 추가
        if (score > 100 && score % 100 === 0) {
          spawnEnemies(); // 점수가 100점 이상일 때 2개씩 적 추가
        }
      }
    });
  });
}

// 게임 오버 처리 함수
function gameOver() {
  alert("Game Over! Your score: " + score);
  document.location.reload();
}

// 게임 루프
function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 그리기
  ctx.fillStyle = "skyblue"; // 하늘색(파란색)으로 플레이어 색상 변경
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 총알 그리기 및 이동
  ctx.fillStyle = "pink"; // 핑크색으로 총알 색상 변경
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y -= bulletSpeed;

    // 화면을 벗어난 총알 제거
    if (bullet.y < 0) {
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });

  // 적 그리기 및 이동
  ctx.fillStyle = "purple"; // 보라색으로 적의 색상 변경
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  moveEnemies();
  checkCollisions();

  // 일정 간격으로 적 생성
  if (timestamp - lastSpawnTime > enemySpawnInterval && enemies.length < maxEnemies) {
    spawnEnemies();
    lastSpawnTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

// 키 입력 처리
document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") {
    movePlayer("left");
  } else if (event.key === "ArrowRight") {
    movePlayer("right");
  } else if (event.key === " ") { // 스페이스바를 눌러 총알 발사
    shootBullet();
  }
});

// 게임 시작
requestAnimationFrame(gameLoop);
