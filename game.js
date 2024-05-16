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
        dx: 0
    };

    const bullets = [];
    let shooting = false;

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

    function moveShip() {
        ship.x += ship.dx;

        if (ship.x < 0) {
            ship.x = 0;
        }

        if (ship.x + ship.width > canvas.width) {
            ship.x = canvas.width - ship.width;
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

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        clear();
        drawShip();
        drawBullets();
        moveShip();
        moveBullets();
        requestAnimationFrame(update);

        // ゲームパッドの状態をチェック
        checkGamepad();
    }

    function keyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            ship.dx = ship.speed;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            ship.dx = -ship.speed;
        }
    }

    function keyUp(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
            ship.dx = 0;
        }
    }

    function shoot() {
        bullets.push({
            x: ship.x + ship.width / 2 - 2.5,
            y: ship.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }

    // ゲームパッドのボタンとスティックをチェックする関数
    function checkGamepad() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        if (gamepad) {
            // 左スティックの入力をチェック
            const leftStickX = gamepad.axes[0];
            if (leftStickX > 0.1) {
                ship.dx = ship.speed;
            } else if (leftStickX < -0.1) {
                ship.dx = -ship.speed;
            } else {
                ship.dx = 0;
            }

            // ボタンの入力をチェック (ここではボタン0を射撃に対応させる)
            if (gamepad.buttons[0].pressed) {
                if (!shooting) {
                    shoot();
                    shooting = true;
                }
            } else {
                shooting = false;
            }
        }
    }

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    document.addEventListener('keypress', (e) => {
        if (e.key === ' ') {
            shoot();
        }
    });

    window.addEventListener('gamepadconnected', (e) => {
        console.log('ゲームパッドが接続されました:', e.gamepad);
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        console.log('ゲームパッドが切断されました:', e.gamepad);
    });

    update();
});
