document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ship = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 60,
        width: 50,
        height: 50,
        speed: 5,
        dx: 0,
        dy: 0
    };

    const bullets = [];
    const enemies = [];
    const enemySpeed = 2;
    const bulletSpeed = 7;

    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();

    function drawShip() {
        ctx.fillStyle = 'white';
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
    }

    function drawBullets() {
        ctx.fillStyle = 'red';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function drawEnemies() {
        ctx.fillStyle = 'green';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function moveShip() {
        ship.x += ship.dx;
        ship.y += ship.dy;

        if (ship.x < 0) {
            ship.x = 0;
        }
        if (ship.x + ship.width > canvas.width) {
            ship.x = canvas.width - ship.width;
        }
        if (ship.y < 0) {
            ship.y = 0;
        }
        if (ship.y + ship.height > canvas.height) {
            ship.y = canvas.height - ship.height;
        }
    }

    function moveBullets() {
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y + bullet.height < 0) {
                bullets.splice(index, 1);
            }
        });
    }

    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
            }
        });
    }

    function detectCollisions() {
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                }
            });
        });
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        clear();
        drawShip();
        drawBullets();
        drawEnemies();
        moveShip();
        moveBullets();
        moveEnemies();
        detectCollisions();
        checkGamepad();
        requestAnimationFrame(update);
    }

    function keyDown(e) {
        if (e.key === 'd' || e.key === 'D') {
            ship.dx = ship.speed;
        } else if (e.key === 'a' || e.key === 'A') {
            ship.dx = -ship.speed;
        } else if (e.key === 'w' || e.key === 'W') {
            ship.dy = -ship.speed;
        } else if (e.key === 's' || e.key === 'S') {
            ship.dy = ship.speed;
        } else if (e.key === ' ') {
            shooting = true;
        }
    }

    function keyUp(e) {
        if (e.key === 'd' || e.key === 'D' || e.key === 'a' || e.key === 'A') {
            ship.dx = 0;
        } else if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
            ship.dy = 0;
        } else if (e.key === ' ') {
            shooting = false;
        }
    }

    function shoot() {
        bullets.push({
            x: ship.x + ship.width / 2 - 2.5,
            y: ship.y,
            width: 5,
            height: 10,
            speed: bulletSpeed
        });
    }

    function spawnEnemy() {
        const x = Math.random() * (canvas.width - 50);
        enemies.push({
            x: x,
            y: 0,
            width: 50,
            height: 50,
            speed: enemySpeed
        });
    }

    function checkGamepad() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        if (gamepad) {
            // 左スティックの入力をチェック
            const leftStickX = gamepad.axes[0];
            const leftStickY = gamepad.axes[1];
            ship.dx = leftStickX * ship.speed;
            ship.dy = leftStickY * ship.speed;

            // Xボタンの入力をチェック (通常はボタン2)
            if (gamepad.buttons[2].pressed) {
                if (!shooting) {
                    shoot();
                    shooting = true;
                }
            } else {
                shooting = false;
            }
        }
    }

    let shooting = false;

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    window.addEventListener('gamepadconnected', (e) => {
        console.log('ゲームパッドが接続されました:', e.gamepad);
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        console.log('ゲームパッドが切断されました:', e.gamepad);
    });

    setInterval(spawnEnemy, 1000);

    update();
});
