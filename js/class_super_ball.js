/**
 * Clase de la super bola (atraviesa ladrillos y va mucho más rápido)
 */
class SuperBall extends Ball {

    constructor(x, y, width = BALL_SIZE, height = BALL_SIZE) {
        super(x, y, width, height);

        this.speed = 18;
    }

    draw() {

        ctx.fillStyle ='rgb(' + Math.trunc(Math.random()*256) + ',' + Math.trunc(Math.random()*256) + ',' + Math.trunc(Math.random()*256) + ')';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/(5/3), 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'rgb(' + Math.trunc(Math.random()*256) + ',' + Math.trunc(Math.random()*256) + ',' + Math.trunc(Math.random()*256) + ')';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/(5/3)-4, 0, 2 * Math.PI);
        ctx.fill();

    }

    checkBrickCollision() {

        let collision = false;

        for (let brick of Brick.list) {
            if (this.collides(brick) && brick.health > 0) {
                brick.damage(1);
                collision = true;
            }
        }

        if (collision) playSound(SOUND_SUPER_BALL_HIT);
    }

}