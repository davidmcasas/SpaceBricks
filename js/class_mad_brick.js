/**
 * Clase MadBrick
 * 
 * Este tipo especial de ladrillo dispara y parpadea en rojo.
 */
class MadBrick extends Brick {

    constructor(x, y, health = 1, speedX = 0, speedY = 0) {
        super(x, y, health, speedX, speedY);

        this.hitScore = HIT_SCORE * 4;
        this.glowFrames = 0;
        this.maxGlowFrames = 30;
    }

    update() {

        super.update();

        if (this.health <= 0) return;

        this.glowFrames++;
        if (this.glowFrames >= this.maxGlowFrames) {
            this.glowFrames = 0;
        }

        if (this.y > 0 && !gameOver && Math.trunc(Math.random()*240) == 0) {
            new BrickBullet(this.x + this.width/2 - BULLET_WIDTH/2, this.y + this.height/2 - BRICK_HEIGHT/2);
        }
        
    }

    draw() {

        super.draw();
        if (this.health <= 0) return;

        ctx.fillStyle = 'rgba(255, 0, 0, ' + Math.abs(this.glowFrames/this.maxGlowFrames) + ')';
        ctx.fillRect(Math.trunc(this.x+3), Math.trunc(this.y+3), this.width-6, this.height-6);
        
    }
}