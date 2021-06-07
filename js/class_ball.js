/**
 * Clase Ball (Bola)
 */
 class Ball extends GameObject {

    static list = [];

    constructor(x, y, width = BALL_SIZE, height = BALL_SIZE) {
        super(x, y, width, height, Z_INDEX_BALL);

        this.prevX = this.x;
        this.prevY = this.y;

        this.speed = 12;
        this.direction = Math.PI * 1.5;

        Ball.list.push(this);
        playSound(SOUND_BALL_SPAWN);
    }

    destroy() {
        if (! this.isDestroyed()) {
            super.destroy();
            Ball.list.splice(Ball.list.indexOf(this), 1);
        }
    }

    /**
     * Primero actualiza la posición de la bola, y luego ejecuta los métodos checkPlayerCollision(),
     * checkBrickCollision(), y checkGameBorderCollision(), en ese orden.
     * 
     * Al separar el comportamiento en esos tres métodos, será más fácil crear una clase que extienda
     * de esta y que solo sobreescriba el método que nos interese (como es el caso de la clase SuperBall)
     */
    update() {
        
        this.prevX = this.x;
        this.prevY = this.y;
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

        this.checkPlayerCollision();
        this.checkBrickCollision();
        this.checkGameBorderCollision();
    }

    draw() {
        ctx.fillStyle = 'lime';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/(5/3), 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/(5/3)-4, 0, 2 * Math.PI);
        ctx.fill();
    }

    checkPlayerCollision() {
        // Comprobamos si choca con algún objeto Player
        for (let player of Player.list) {
            if (this.collides(player)) {
                let ballMiddleX = this.width / 2 + this.x;
                let playerMiddleX = player.width / 2 + player.x;
                let diff = ballMiddleX - playerMiddleX;
                let width = player.width + this.width * 2;
                let angle = 1/width * diff;
                if (Math.abs(angle) < 0.01) angle = 0;

                this.direction = Math.PI * (1.5 + angle);
                if (this.prevY + this.height < player.y) {
                    this.y = player.y - this.height;
                }
            }
        }
    }

    checkBrickCollision() {

        // Cada fotograma puede chocar como máximo contra un ladrillo en horizontal y contra otro ladrillo en vertical.
        // También almacenaremos la distancia al ladrillo para poder comprobar si hay otro más cercano y cambiarlo.
        // De todos los ladrillos colisionados en un mismo lado, queremos el más cercano.
        let xCollidedBrick = null; 
        let xCollidedDist = null;
        let yCollidedBrick = null;
        let yCollidedDist = null;

        // Caso especial en diagonal, que se interpretará como vertical en caso de no haber ni horizontal ni vertical.
        let dCollidedBrick = null;
        let dCollidedDist = null;

        // Por cada ladrillo
        for (let brick of Brick.list) {

            // Si la bola colisiona con el ladrillo y el ladrillo tiene puntos de vida superiores a 0
            if (this.collides(brick) && brick.health > 0) {

                // Posición previa del ladrillo. Necesario para determinar el lado del choque.
                let brickPrevX = brick.x - brick.speedX;
                let brickPrevY = brick.y - brick.speedY;

                // Cálculo de distancia entre el centro del ladrillo y el centro de la bola
                let distX = Math.abs((this.prevX + this.width/2) - (brickPrevX + brick.width/2));
                let distY = Math.abs((this.prevY + this.height/2) - (brickPrevY + brick.height/2));
                let dist = Math.sqrt(distX * distX + distY * distY);

                // Comprobamos si esta colisión es horizontal, vertical, interior, o diagonal, en ese orden:
                if ((this.prevY + this.height > brickPrevY && this.prevY < brickPrevY + brick.height)
                    && (this.prevX + this.width <= brickPrevX || this.prevX >= brickPrevX + brick.width)) {
                    if (xCollidedBrick == null || xCollidedDist > dist) {
                        xCollidedBrick = brick;
                        xCollidedDist = dist;
                    }
                } else if ((this.prevX + this.width > brickPrevX && this.prevX < brickPrevX + brick.width)
                    && (this.prevY + this.height <= brickPrevY || this.prevY >= brickPrevY + brick.height)) {
                    if (yCollidedBrick == null || yCollidedDist > dist) {
                        yCollidedBrick = brick;
                        yCollidedDist = dist;
                    }
                } else if (this.prevX < brickPrevX + brick.width && this.prevX + this.width > brickPrevX
                    && this.prevY < brickPrevY + brick.height && this.prevY + this.height > brickPrevY) {
                        brick.damage(1);
                } else if (dCollidedBrick == null || dCollidedDist > dist) {
                        dCollidedBrick = brick;
                        dCollidedDist = dist;
                }

            }
        }

        // Si no existen colisiones horizontales ni verticales pero sí diagonal, consideramos la colisión diagonal como vertical
        if (!xCollidedBrick && !yCollidedBrick && dCollidedBrick) {
            yCollidedBrick = dCollidedBrick;
        }

        // Si se ha colisionado con un ladrillo en horizontal
        if (xCollidedBrick) {
            let brick = xCollidedBrick;

            // Si la velocidad absoluta X de la bola es superior a la velocidad absoluta X del ladrillo,
            // rebotamos en el eje Y solo y dañamos el ladrillo
            if (Math.abs(this.speed * Math.cos(this.direction)) > Math.abs(brick.speedX)) {
                this.direction = -this.direction - Math.PI;
                brick.damage(1);
            }

            // Determinamos si el choque ha sido en el lado izquierdo o derecho:
            // Si izquierdo...
            if (this.prevX + this.width/2 <= brick.x + brick.width/2 - brick.speedX) {
                // La bola se coloca al lado izquierdo del ladrillo
                this.x = brick.x - this.width;
            // Si no...
            } else {
                // La bola se coloca al lado derecho del ladrillo
                this.x = brick.x + brick.width;
            }
        }

        // Si se ha colisionado con un ladrillo en vertical
        if (yCollidedBrick) {
            let brick = yCollidedBrick;

            // Si la velocidad absoluta Y de la bola es superior a la velocidad absoluta Y del ladrillo,
            // rebotamos en el eje X solo y dañamos el ladrillo
            if (Math.abs(this.speed * Math.sin(this.direction)) > Math.abs(brick.speedY)) {
                this.direction = -this.direction;
                brick.damage(1);
            }

            // Determinamos si el choque ha sido en el lado superior o inferior:
            // Si superior...
            if (this.prevY + this.height/2 <= brick.y + brick.height/2 - brick.speedY) {
                // La bola se coloca al lado superior del ladrillo
                this.y = brick.y - this.height;
            // Si no...
            } else {
                // La bola se coloca al lado inferior del ladrillo
                this.y = brick.y + brick.height;
            }

        }

        if (xCollidedBrick || yCollidedBrick) {
            playSound(SOUND_BALL_HIT);
        }

    }

    checkGameBorderCollision() {

        // Rebote en borde superior y desaparación en borde inferior
        if (this.y < 0) {
            this.y = 0;
            this.direction = -this.direction;
        } else if (this.y > GAME_HEIGHT) {
            this.destroy();
        }

        // Rebote en bordes izquierdo y derecho
        if (this.x < 0) {
            this.direction = -this.direction - Math.PI;
            this.x = 0;
        } else if ((this.x + this.width) > GAME_WIDTH) {
            this.direction = -this.direction - Math.PI;
            this.x = GAME_WIDTH - this.width;
        }
    }

}