/**
 * Clase que muestra el marcador de puntuación. Se le pasa el objeto GameDirector, del cual se lee la puntuación.
 * Esta clase también hace de pantalla de "FINAL SCORE".
 */
class ScoreScreen extends GameObject {

    constructor(gameDirector) {
        super(GAME_WIDTH - 256, 0, 256, 32, Z_INDEX_SCORE_SCREEN);

        this.gameDirector = gameDirector;
    
        this.texts = [];

        this.finalOpacity = 0;
        this.finalTextShown = false;

        for (let i = 0; i < 10; i ++) {
            this.texts.push(new Text(GAME_WIDTH - 25 * i - 16, 28, 0, 32, 'lime'));
        }
    }

    update() {
        
        for (let i = 0; i < 10; i++){
            this.texts[i].text = 0;
        }
        let score = this.gameDirector.score;
        let i = 0;
        while (score > 0 && i < 10) {
            this.texts[i].text = parseInt(score % 10);
            score = parseInt(score/10);
            i++;
        }

        if (gameOver) {
            if (this.finalOpacity < 1) {
                this.finalOpacity += 0.005;
            } else {
                background.destroy();
                for (let brick of Brick.list.slice(0)) {
                    brick.destroy();
                }
            }
            if (this.x > 520) {
                this.x -= 3;
                this.y += 2;
                for (let text of this.texts) {
                    text.x -= 3;
                    text.y += 2;
                }
            } else if (!this.finalTextShown) {
                this.finalTextShown = true;
                new Text (650, 320, 'FINAL SCORE', 36);
                let text;
                if (isMobileDevice()) text = new Text (650, 420, 'Touch screen to restart', 36);
                else text = new Text (650, 420, 'Press SPACE to restart', 36);
                text.effectAutoFadeEnabled = true;
            } else if (this.finalTextShown && keySpaceSingle) {
                keySpaceSingle = false;
                GameObject.list.slice(0).forEach(gameObject => {
                    gameObject.destroy();
                });
                gameStarted = false;
                menuStarted = false;
                gameOver = false;
                gameDirector = null;
                frame = 0;
                ctx.textAlign = "left";
                background = new Background();
                new GameMenu();
            } 
        } 
    }

    draw() {
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,' + this.finalOpacity + ')';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}