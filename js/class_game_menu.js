/**
 * Clase del menú del juego.
 * Su constructor carga e inicia el desplazamiento de las letras "SPACE BRICKS" y,
 * una vez llegan a su posición final, carga la música de fondo entre otros efectos.
 */
class GameMenu extends GameObject {

    constructor() {
        super(0, 0, GAME_WIDTH, GAME_HEIGHT, 1);

        this.texts = [];
        this.addCharacters();

        this.displaceTextMax = 460;
        this.displaceText = 0;
        for (let text of this.texts) {
            text.y -= this.displaceTextMax;
            text.effectYEnabled = true;
            text.border = true;
            text.fill = false;
        }

        this.keyboardEnabled = false;
        this.terminating = false;
        this.terminationFrames = 120;
        this.flash = 0;

        playSound(SOUND_INTRO_RISER);
    }

    addCharacters() {
        
        this.texts.push(new Text(440, 280, 'S', 96, 'white'));
        this.texts.push(new Text(520, 280, 'P', 96, 'white'));
        this.texts.push(new Text(600, 280, 'A', 96, 'white'));
        this.texts.push(new Text(680, 280, 'C', 96, 'white'));
        this.texts.push(new Text(760, 280, 'E', 96, 'white'));

        for (let text of this.texts) {
            text.border = true;
            text.borderWidth = 3;
            text.borderColor = 'white';
        } 
    
        this.texts.push(new Text(370, 400, 'B', 128, 'lime'));
        this.texts.push(new Text(470, 400, 'R', 128, 'orange'));
        this.texts.push(new Text(570, 400, 'I', 128, 'yellow'));
        this.texts.push(new Text(595, 400, 'C', 128, 'blue'));
        this.texts.push(new Text(695, 400, 'K', 128, 'red'));
        this.texts.push(new Text(795, 400, 'S', 128, 'magenta'));

        
        for (let text of this.texts) {
            if (text.border == true) continue;
            text.border = true;
            text.borderWidth = 3;
            text.borderColor = 'white';
        } 
    
    }

    update() {
        
        if (this.flash > 0) this.flash -= 0.1;
        if (this.terminating) {

            this.terminationFrames--;
            if (this.terminationFrames == 0) {
                gameDirector = new GameDirector();
                this.destroy();
            }

        } else {

            if (this.displaceText < this.displaceTextMax) {
                for (let text of this.texts) {
                    text.y += 2;
                }
                background.backgroundXSpeed += 0.01;
                this.displaceText += 2;
            } else if (!this.keyboardEnabled) {
                for (let i = 0; i < this.texts.length; i++) {
                    this.texts[i].effectYEnabled = true;
                    this.texts[i].jitterEnabled = true;
                    this.texts[i].fill = true;
                    if (i >= 0 && i < 5) this.texts[i].borderColor = 'lime';
                    else if (i >= 5 && i <= 10) this.texts[i].borderColor = 'black';
                }
                this.flash = 1;
                this.keyboardEnabled = true;
                menuStarted = true;
                background.backgroundXSpeed = background.backgroundXSpeedLimit;
                MUSIC.play();
                SOUND_INTRO_RISER.pause();

                if (isMobileDevice()) {
                    let text = new Text(440, 540, 'Touch here to start', 36, 'white');
                    this.texts.push(text);
                    text.effectAutoFadeEnabled = true;
                } else {
                    let text = new Text(420, 540, 'Press SPACE to start', 36, 'white');
                    this.texts.push(text);
                    text.effectAutoFadeEnabled = true;
                }

                this.texts.push(new Text(430, 700, 'Created by David M. Casas (davidmcasas.com)', 16, 'gray'));
                if (isMobileDevice()) this.texts.push(new Text(0, GAME_HEIGHT, 'Touch left or right to move. Touch mid screen to shoot.', 16, 'gray'));
                else this.texts.push(new Text(0, GAME_HEIGHT, 'Press M to mute/unmute sound', 16, 'gray'));
            } else {
                if (frame % 16 == 0) {
                    let health = Math.trunc(Math.random()*5+1)
                    let column = Math.trunc(Math.random()*5);
                    let x = column * BRICK_WIDTH;
                    new Brick(x, -BRICK_HEIGHT, health, 0, 2);
                    x = GAME_WIDTH - BRICK_WIDTH - BRICK_WIDTH * column;
                    new Brick(x, -BRICK_HEIGHT, health, 0, 2);
                }
            }
    
            if (this.keyboardEnabled && keySpace) {
                playSound(SOUND_SWOOSH);
                this.flash = 1;
                this.terminating = true;
                for (let text of this.texts) {
                    if (text.effectYEnabled) {
                        text.jitterEnabled = false;
                        text.speedX = -(580-text.x)*0.02;
                        text.speedY = -5;
                        text.movementEnabled = true;

                    } else {
                        text.destroy();
                    }
                }

                for (let brick of Brick.list) {
                    brick.damage(brick.health);
                }
            }
        }

    }

    draw () {

        if (this.flash > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.flash + ')';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        }
    }

    destroy() {
        if (! this.isDestroyed()) {
            super.destroy();
            for (let object of this.texts) {
                object.destroy();
            }
        }
    }

}