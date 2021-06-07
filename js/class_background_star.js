/**
 * Clase BackgroundStar (Estrella de fondo)
 * 
 * La escala de cada estrella se establece de forma aleatoria al momento de su creación, y afecta
 * a su tamaño, brillo y velocidad.
 * 
 * El atributo "amplification" se usará para que la estrella aumente y disminuya de tamaño y
 * transparencia visible cíclicamente, haciendo el efecto de estrella que brilla.
 */
class BackgroundStar extends GameObject {

    constructor(x, y, background) {
        let scale = (Math.random()/1.5 + 0.25) // de 0.25 a 1.0
        super(x, y, 6 * scale, 6 * scale, Z_INDEX_BACKGROUND_STAR)

        this.x = x;
        this.y = y;
        this.width = 6 * scale;
        this.height = 6 * scale;

        this.scale = scale;
        this.speed = 8;
        this.background = background;

        this.amplification = Math.random()*0.3 + 1;
        this.amplifying = true;
    }

    update() {

        if (this.amplifying) {
            this.amplification += 0.01;
            if (this.amplification >= 1.3) {
                this.amplifying = false;
            }
        } else {
            this.amplification -= 0.01;

            if (this.amplification <= 1) {
                this.amplifying = true;
            }
        }

        this.y += this.speed * this.scale * (menuStarted ? 1 : 0.25);
        this.x += this.background.backgroundXSpeed * this.scale; // * (menuStarted ? 1 : 0);
        if (this.y > GAME_HEIGHT) this.destroy();
    }

    draw() {
        let alpha = this.scale - 0.25 + (this.amplification - 1) - (menuStarted ? 0 : 0.4);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        ctx.fillRect(Math.trunc(this.x), Math.trunc(this.y), Math.trunc(this.width * this.amplification), Math.trunc(this.height * this.amplification));
    }

}