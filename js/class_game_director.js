/**
 * Clase GameDirector (director de juego).
 * Clase de instanciación única (solo debe haber una al mismo tiempo).
 * Se encarga de controlar la aparición de ladrillos y el ajuste de dificultad.
 */
class GameDirector extends GameObject {

    constructor() {
        super(0, 0, 0, 0, 0);

        this.frame = 0;
        this.score = 0;
        this.difficultyRating = 1;
        this.brickYSpeed = 0.25;
        this.nextSpawnFrame = 1;
        
        new Player();
        gameStarted = true;

        new ScoreScreen(this);
    }

    update() {

        this.frame++;

        if (this.frame >= this.nextSpawnFrame) {
            this.spawnRandomBrickPattern();
        }

        if (this.frame % (DIFFICULTY_INCREASE_FRAMES) == 0) {
            this.difficultyRating++;
            if (this.difficultyRating > MAX_DIFFICULTY) {
                this.difficultyRating = MAX_DIFFICULTY;
            }
        } 
    }

    spawnRandomBrickPattern() {
        
        let brickPattern = BRICK_PATTERNS[Math.trunc(Math.random() * BRICK_PATTERNS.length)];
        let x = BRICK_COLUMNS_MARGIN * BRICK_WIDTH
            + BRICK_WIDTH * Math.trunc(Math.random() * (BRICK_COLUMNS - BRICK_COLUMNS_MARGIN - brickPattern[0].length-1));
        for (let i = 0; i < brickPattern.length; i++) {
            for (let j = 0; j < brickPattern[i].length; j++) {
                let health = Math.min(Math.max(this.getRandomHealth(), 1), BRICK_MAX_HEALTH);
                if (brickPattern[i][j] >= 1) {
                    if (this.getMadBrick()) {
                        new MadBrick (x + BRICK_WIDTH * j, -BRICK_HEIGHT * (brickPattern.length - i), health, 0, this.brickYSpeed);
                    } else {
                        new Brick (x + BRICK_WIDTH * j, -BRICK_HEIGHT * (brickPattern.length - i), health, 0, this.brickYSpeed);
                    }
                }
            }
        }

        this.nextSpawnFrame += (brickPattern.length + BRICK_SPACE_BETWEEN_PATTERNS) * BRICK_HEIGHT / this.brickYSpeed;
    }

    getRandomHealth() {
        switch (this.difficultyRating) {
            case 1 : return Math.trunc(Math.random() * 2 + 1);
            case 2 : return Math.trunc(Math.random() * 3 + 1);
            case 3 : return Math.trunc(Math.random() * 3 + 1);
            case 4 : return Math.trunc(Math.random() * 2 + 2);
            case 5 : return Math.trunc(Math.random() * 4 + 1);
            case 6 : return Math.trunc(Math.random() * 3 + 2);
            case 7 : return Math.trunc(Math.random() * 4 + 2);
            case 8 : return Math.trunc(Math.random() * 3 + 3);
            case 9 : return Math.trunc(Math.random() * 2 + 4);
            default : case 10 : return Math.trunc(Math.random() * 1 + 5);
        }
    }

    getMadBrick() {
        switch (this.difficultyRating) {
            case 1 : return Math.trunc(Math.random() * 30) == 0;
            case 2 : return Math.trunc(Math.random() * 28) == 0;
            case 3 : return Math.trunc(Math.random() * 26) == 0;
            case 4 : return Math.trunc(Math.random() * 24) == 0;
            case 5 : return Math.trunc(Math.random() * 22) == 0;
            case 6 : return Math.trunc(Math.random() * 20) == 0;
            case 7 : return Math.trunc(Math.random() * 18) == 0;
            case 8 : return Math.trunc(Math.random() * 16) == 0;
            case 9 : return Math.trunc(Math.random() * 14) == 0;
            default : case 10 : return Math.trunc(Math.random() * 12) == 0;
        }
    }

}