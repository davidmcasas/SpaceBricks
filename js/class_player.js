/**
 * Clase jugador, que representa la pala del jugador.
 * El indicador de carga del jugador también se controla y dibuja aquí.
 */
class Player extends GameObject {

    static list = [];

    constructor(x = canvas.width/2-80, y = GAME_HEIGHT, width = 160, height = 24) {
        super(x, y, width, height, Z_INDEX_PLAYER);

        this.charge = 10;
        this.ballCharge = 10;
        this.maxCharge = 100;
        this.chargeIncrease = 0.1;
        this.acceleration = 2;
        this.friction = 1;
        this.speed = 0;
        this.maxSpeed = 14;

        this.spawning = true;
        this.damageFrames = 0;

        Player.list.push(this);
    }

    destroy() {
        if (! this.isDestroyed()) {
            super.destroy();
            Player.list.splice(Player.list.indexOf(this), 1);
        }
    }

    update() {

        if (this.spawning) {
            this.y -= 2;
            if (this.y <= PLAYER_Y_POSITION) {
                this.y = PLAYER_Y_POSITION;
                this.spawning = false;
            }
            return;
        }

        this.charge += this.chargeIncrease;
        if (this.charge > this.maxCharge) this.charge = this.maxCharge;
        else if (this.charge < 0) this.charge = 0;

        if (this.damageFrames > 0) this.damageFrames--;

        if (keySpace && keySpaceSingle) {
            keySpaceSingle = false;
            if (this.charge >= this.maxCharge) {
                this.charge -= this.maxCharge;
                let x = this.x + this.width/2 - BALL_SIZE/2;
                let y = this.y - BALL_SIZE/2;
                new SuperBall(x, y);
            } else if (this.charge >= this.ballCharge) {
                this.charge -= this.ballCharge;
                let x = this.x + this.width/2 - BALL_SIZE/2;
                let y = this.y - BALL_SIZE/2;
                new Ball(x, y);
            }
            
        }

        if (this.speed > 0) this.speed -= this.friction;
        else if (this.speed < 0) this.speed += this.friction;

        if (keyLeft && !keyRight) this.speed -= this.acceleration;
        else if (keyRight && !keyLeft) this.speed += this.acceleration;

        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

        this.x += this.speed;

        if (this.x < 0) {
            this.x = 0;
            this.speed = 0;
        } else if ((this.x + this.width) > GAME_WIDTH) {
            this.x = GAME_WIDTH - this.width;
            this.speed = 0;
        }
    }

    draw() {
        ctx.fillStyle = 'lime';
        ctx.fillRect(parseInt(this.x), parseInt(this.y), this.width, this.height);
        if (this.damageFrames > 0) {
            ctx.fillStyle = 'rgba(255,0,0,' + this.damageFrames/10 + ')';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(parseInt(this.x+4), parseInt(this.y+4), this.width-8, this.height-8);

        ctx.font = '32px Orbitron';
        let prevAlign = ctx.textAlign;
        ctx.textAlign = "center";

        if (this.charge == this.maxCharge) ctx.fillStyle =
            'rgb(' + parseInt(Math.random()*256) + ',' + parseInt(Math.random()*256) + ',' + parseInt(Math.random()*256) + ')';
        else ctx.fillStyle = this.charge < this.ballCharge ? "red" : "lime";
        ctx.fillText(parseInt(this.charge) + '%', this.x + this.width/2, this.y + this.height * 2 + 8);
    }

    damage(damage = 20) {
        this.charge -= damage;
        this.speed = 0;
        this.damageFrames = 10;
        playSound(SOUND_PLAYER_HURT);
    }

    explode() {
        for (let i = 0; i < 40; i++) {
            new Particle(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
        }
        this.destroy();
    }
}