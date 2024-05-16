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
    
