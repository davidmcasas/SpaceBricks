/**
 * Clase texto, que permite mostrar caracteres o cadenas de texto con varios efectos.
 */
class Text extends GameObject {

    static list = [];

    constructor(x, y, text, fontSize = 128, color = 'white', fontType = 'Orbitron') {
        super(x, y, 0, 0, Z_INDEX_TEXT);

        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.fontType = fontType;
    
        this.jitterEnabled = false;
        this.jitterAmount = 6;

        this.border = false;
        this.borderWidth = 1;
        this.borderColor = 'white';
        this.fill = true;

        this.speedX = 0;
        this.speedY = 0;
        this.movementEnabled = true;

        this.effectY = [0, -40, -80, -120, -160, -200];
        this.effectYEnabled = false;

        this.autoFade = 1;
        this.effectAutoFadeEnabled = false;

        Text.list.push(this);
    }

    destroy() {
        if (! this.isDestroyed()) {
            super.destroy();
            Text.list.splice(Text.list.indexOf(this), 1);
        }
    }

    update() {

        if (this.effectYEnabled) {

            if (frame % 40 == 0) {
                this.effectY.push(0);
            }

            for (let i = 0; i < this.effectY.length; i++) {
                this.effectY[i] -= 1;
                if (this.effectY[i] < -200) {
                    this.effectY.splice(this.effectY.indexOf(this.effectY[i]), 1);
                }
            }
        }

        if (this.movementEnabled) {
            this.x += this.speedX;
            this.y += this.speedY;
        }

    }

    draw () {

        let drawX = this.jitterEnabled ? this.x + Math.random()*this.jitterAmount - this.jitterAmount/2 : this.x;
        let drawY = this.jitterEnabled ? this.y + Math.random()*this.jitterAmount - this.jitterAmount/2 : this.y;
        
        ctx.font = this.fontSize + 'px ' + this.fontType;


        if (this.effectYEnabled) {
            for (let y of this.effectY) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1 + y/200)  + ')';
                ctx.strokeText(this.text, this.x, this.y + y);
            }
        }

        if (this.fill) {
            if (this.effectAutoFadeEnabled) {
                let prevAlpha = ctx.globalAlpha;
                ctx.globalAlpha = Math.abs(this.autoFade-1);
                this.autoFade += 0.04;
                if (this.autoFade >= 2) this.autoFade-=2;

                ctx.fillStyle = this.color;
                ctx.fillText(this.text, drawX, drawY);

                ctx.globalAlpha = prevAlpha;
            } else {
                ctx.fillStyle = this.color;
                ctx.fillText(this.text, drawX, drawY);
            }
        }
        
        if (this.border) {
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeText(this.text, drawX, drawY);
        }
        
    }

}