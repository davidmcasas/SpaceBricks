/**
 * Clase partícula.
 * 
 * Se usa para añadir dinamismo a los impactos del juego y darle algo de vida a los ladrillos.
 */
class Particle extends GameObject {

    constructor(x, y, color = 'white', speed = null, direction = null) {
        let size = Math.trunc(Math.random()*4+4);
        super(x, y, size, size, Z_INDEX_PARTICLE);

        this.color = color;
        this.direction = direction == null ? Math.random()*Math.PI*2 : direction;
        this.speed = speed == null ? Math.random() * 4 + 2: speed;
        
        this.duration = 100;
    }

    update () {

        if (this.duration <= 0) {
            this.destroy();
        }

        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

        this.duration--;
    }

    draw () {
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.duration/100;
        ctx.fillRect(Math.trunc(this.x), Math.trunc(this.y), this.width, this.height);
        ctx.globalAlpha = 1;

    }
}