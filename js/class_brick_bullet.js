/**
 * Clase de bala de ladrillo
 */
class BrickBullet extends GameObject {

    constructor(x, y) {
        super(x, y, BULLET_WIDTH, BULLET_HEIGHT, Z_INDEX_BRICK_BULLET);
        this.speedY = 8;
        playSound(SOUND_LASER_SHOOT);
    }

    update () {
        
        this.y += this.speedY;

        for (let player of Player.list) {
            if (this.collides(player)) {
                player.damage(BRICK_BULLET_DAMAGE);
                this.destroy();
            }
        }

        if (this.y >= GAME_HEIGHT) {
            this.destroy();
        }
    }

    draw () {

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'white';
        ctx.strokeRect(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.width), Math.trunc(this.height));
        ctx.fillRect(Math.trunc(this.x+1), Math.trunc(this.y+1), Math.trunc(this.width-2), Math.trunc(this.height-2));
    }
}