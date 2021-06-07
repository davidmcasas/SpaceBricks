/**
 * Clase Background (fondo)
 * 
 * Esta clase se encarga de crear nuevas estrellas de fondo y definir el movimiento en X de estas,
 * que irá alternando de derecha a izquierda.
 */
class Background extends GameObject {

    constructor() {
        super(0, 0, GAME_WIDTH, GAME_HEIGHT, 0);
    
        this.backgroundXSpeed = 0;
        this.backgroundXSpeedLimit = 8;
        this.backgroundXSpeedIncrease = 0.5;
        this.backgroundXDirection = 1;

        for (let y = 0; y < canvas.height; y += 3) {
            this.spawnBackgroundStar(y);
        }
    }

    update() {
        
        this.spawnBackgroundStar();
        if (menuStarted) {
            this.spawnBackgroundStar();
            this.spawnBackgroundStar();
        }

        if (menuStarted && frame % 40 == 0) {
            if (this.backgroundXDirection == 1) {
                this.backgroundXSpeed += this.backgroundXSpeedIncrease;
                if (this.backgroundXSpeed >= this.backgroundXSpeedLimit) this.backgroundXDirection = -1;
            } else {
                this.backgroundXSpeed -= this.backgroundXSpeedIncrease;
                if (this.backgroundXSpeed <= -this.backgroundXSpeedLimit) this.backgroundXDirection = 1;
            }
        }
    }

    spawnBackgroundStar(y = -20) {
        new BackgroundStar(Math.trunc(Math.random() * canvas.width * 2 - canvas.width/2), y, this)
    }

}