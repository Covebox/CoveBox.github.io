document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    let movingCircle = { x: 100, y: 100, radius: 30, velocityX: 2, velocityY: 2 };
    let staticCircle = { x: 400, y: 300, radius: 50 };

    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(movingCircle);
        drawCircle(staticCircle);

        movingCircle.x += movingCircle.velocityX;
        movingCircle.y += movingCircle.velocityY;

        checkCollisionAndBounce(movingCircle, staticCircle);
        requestAnimationFrame(update);
    }

    function calculateDistance(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function calculateBounceAngle(movingCircle, staticCircle) {
        let dx = staticCircle.x - movingCircle.x;
        let dy = staticCircle.y - movingCircle.y;

        let distance = Math.sqrt(dx * dx + dy * dy);
        let normalX = dx / distance;
        let normalY = dy / distance;

        let dotProduct = movingCircle.velocityX * normalX + movingCircle.velocityY * normalY;

        movingCircle.velocityX -= 2 * dotProduct * normalX;
        movingCircle.velocityY -= 2 * dotProduct * normalY;
    }

    function checkCollisionAndBounce(movingCircle, staticCircle) {
        let distance = calculateDistance(movingCircle.x, movingCircle.y, staticCircle.x, staticCircle.y);
        let sumOfRadii = movingCircle.radius + staticCircle.radius;

        if (distance <= sumOfRadii) {
            calculateBounceAngle(movingCircle, staticCircle);
        }
    }

    update();
});
