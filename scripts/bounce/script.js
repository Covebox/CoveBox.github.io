document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    let circleA = { x: 100, y: 100, radius: 30, velocityX: 2, velocityY: 2, mass: 2 };
    let circleB = { x: 300, y: 300, radius: 50, velocityX: -1, velocityY: -1, mass: 3 };

    const gravity = 0.1; // Gravitationskonstante

    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(circleA);
        drawCircle(circleB);

        // Gravitation hinzufügen
        circleA.velocityY += gravity;
        circleB.velocityY += gravity;

        // Bewegung aktualisieren
        circleA.x += circleA.velocityX;
        circleA.y += circleA.velocityY;
        circleB.x += circleB.velocityX;
        circleB.y += circleB.velocityY;

        // Kollision mit dem Boden und den Seitenwänden prüfen
        preventEscape(circleA);
        preventEscape(circleB);

        checkCollisionAndBounce(circleA, circleB);
        requestAnimationFrame(update);
    }

    function preventEscape(circle) {
        // Bodenkollision
        if (circle.y + circle.radius > canvas.height) {
            circle.y = canvas.height - circle.radius;
            circle.velocityY *= -.9; // Richtungsumkehr bei Kollision mit dem Boden
        }

        // Seitenkollision
        if (circle.x - circle.radius < 0) {
			circle.x = circle.radius
            circle.velocityX *= -.9; // Richtungsumkehr bei Kollision mit den Seitenwänden
		}
			
		if ( circle.x + circle.radius > canvas.width) {
			circle.x = canvas.width - circle.radius 
            circle.velocityX *= -.9; // Richtungsumkehr bei Kollision mit den Seitenwänden
        }
    }

    function calculateDistance(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function calculateBounce(circleA, circleB) {
        let dx = circleB.x - circleA.x;
        let dy = circleB.y - circleA.y;
        let collisionAngle = Math.atan2(dy, dx);

        let speedA = Math.sqrt(circleA.velocityX * circleA.velocityX + circleA.velocityY * circleA.velocityY);
        let speedB = Math.sqrt(circleB.velocityX * circleB.velocityX + circleB.velocityY * circleB.velocityY);

        let directionA = Math.atan2(circleA.velocityY, circleA.velocityX);
        let directionB = Math.atan2(circleB.velocityY, circleB.velocityX);

        let velocityAX = speedA * Math.cos(directionA - collisionAngle) * .5;
        let velocityAY = speedA * Math.sin(directionA - collisionAngle) * .5;
        let velocityBX = speedB * Math.cos(directionB - collisionAngle) * .5;
        let velocityBY = speedB * Math.sin(directionB - collisionAngle) * .5;

        let finalVelocityAX = ((circleA.mass - circleB.mass) * velocityAX + 2 * circleB.mass * velocityBX) / (circleA.mass + circleB.mass);
        let finalVelocityBX = ((circleB.mass - circleA.mass) * velocityBX + 2 * circleA.mass * velocityAX) / (circleA.mass + circleB.mass);

        circleA.velocityX = Math.cos(collisionAngle) * finalVelocityAX + Math.cos(collisionAngle + Math.PI / 2) * velocityAY;
        circleA.velocityY = Math.sin(collisionAngle) * finalVelocityAX + Math.sin(collisionAngle + Math.PI / 2) * velocityAY;
        circleB.velocityX = Math.cos(collisionAngle) * finalVelocityBX + Math.cos(collisionAngle + Math.PI / 2) * velocityBY;
        circleB.velocityY = Math.sin(collisionAngle) * finalVelocityBX + Math.sin(collisionAngle + Math.PI / 2) * velocityBY;
    }

    function checkCollisionAndBounce(circleA, circleB) {
        let distance = calculateDistance(circleA.x, circleA.y, circleB.x, circleB.y);
        let sumOfRadii = circleA.radius + circleB.radius;

        if (distance <= sumOfRadii) {
            calculateBounce(circleA, circleB);
        }
    }

    update();
});
