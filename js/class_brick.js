/**
 * Clase Brick (ladrillo) 
 */
class Brick extends GameObject {

    static list = [];

    constructor(x, y, health = 1, speedX = 0, speedY = 0) {
        super(x, y, BRICK_WIDTH, BRICK_HEIGHT, Z_INDEX_BRICK);
        
        this.health = health;
        this.speedX = speedX;
        this.speedY = speedY;
        this.damageFrames = 0;

        this.hitScore = HIT_SCORE;
        
        Brick.list.push(this);
    }

    destroy() {
        if (! this.destroyed) {
            super.destroy();
            Brick.list.splice(Brick.list.indexOf(this), 1);
        }
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.health > 0) {
            if (this.y >= GAME_HEIGHT) {
                this.destroy();
                return;
            } else if (gameStarted && this.y >= BRICK_Y_LIMIT - BRICK_HEIGHT) {
                if (!gameOver) {
                    for (let player of Player.list.slice(0)) {
                        player.explode();
                    }
                    for (let ball of  Ball.list.slice(0)) {
                        ball.destroy();
                    }
                    playSound(SOUND_PLAYER_EXPLOSION);
                    MUSIC.pause();
                    MUSIC.currentTime = 0;
                    gameDirector.destroy();
                    gameOver = true;
                }
            }
            
            if (Math.trunc(Math.random()*60) == 0) {
                new Particle(this.x + this.width/2, this.y + this.height/2, BRICK_COLORS[this.health-1], 1);
            }
        }
        
        if (this.damageFrames > 0) {
            this.damageFrames--;
        } else if (this.damageFrames == 0 && this.health == 0) {
            this.destroy();
            return; 
        }
    }

    draw() {

        let drawX =
            this.x + (globalJitter >= GLOBAL_JITTER_MIN && globalJitter <= GLOBAL_JITTER_MAX ? Math.trunc(Math.random()*12-6) : 0);
        let drawY =
            this.y + (globalJitter >= GLOBAL_JITTER_MIN && globalJitter <= GLOBAL_JITTER_MAX ? Math.trunc(Math.random()*12-6) : 0);

        if (this.health > 0) {

            let imageId = this.health-1;
            if (imageId < 0) imageId = 0;
            else if (imageId >= IMAGES_BRICKS.length) imageId = IMAGES_BRICKS.length-1;
    
            ctx.drawImage(IMAGES_BRICKS[imageId], drawX, drawY);  
        }

        if (this.damageFrames > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.damageFrames/10 + ')';
            ctx.fillRect(Math.trunc(drawX+3), Math.trunc(drawY+3), this.width-6, this.height-6);
        }
        
        // Dibujar linea límite
        if (gameStarted && this.y >= BRICK_Y_LIMIT - 200) {
            
            let gradient = ctx.createLinearGradient(this.x - BRICK_WIDTH, 0, this.x + BRICK_WIDTH * 2, 0);
            gradient.addColorStop(0,    'rgba(255,0,0,0)');
            gradient.addColorStop(0.5,  'rgba(255,0,0,' + Math.abs(BRICK_Y_LIMIT - this.y - 200) / 200 + ')');
            gradient.addColorStop(1,    'rgba(255,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x - BRICK_WIDTH, BRICK_Y_LIMIT - 1 , BRICK_WIDTH * 3, 3);
        }
    }

    damage(value = 1) {
        
        let particleColorIndex = Math.max(0, Math.min(this.health-1, BRICK_COLORS.length-1));

        this.health -= value;
        if (gameDirector) gameDirector.score += this.hitScore * value;
        this.damageFrames = 10;

        if (this.health < 0) this.health = 0;

        for (let i = 0; i < Math.random()*5 + 5; i++) {
            new Particle(this.x + BRICK_WIDTH/2, this.y + BRICK_HEIGHT/2, BRICK_COLORS[particleColorIndex]);
        }
    }
}