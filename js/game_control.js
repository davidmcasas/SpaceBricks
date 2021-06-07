function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

// Teclas de control
let keyLeft = false;
let keyRight = false;

// La tecla SPACE lleva dos variables, para evitar pulsaciónes automáticas de la tecla si se deja pulsada.
let keySpace = false;
let keySpaceSingle = false;

function startGame() {
    for (let text of Text.list.slice(0)) {
        text.destroy();
    }
    readySounds();
    document.documentElement.requestFullscreen()
    if (isMobileDevice()) window.screen.orientation.lock("landscape");
    window.removeEventListener('keydown', initGame);
    new GameMenu();
}

// Función para comprobar si es la primera vez que se toca la pantalla
let firstTouch = true;
let secondTouch = false;
function touch() {
    if (firstTouch && !menuStarted){
        firstTouch = false;
        secondTouch = true;
    } else if (secondTouch && !menuStarted) {
        secondTouch = false;
        startGame();
    }
}

// Eventos en pantalla táctil
document.getElementById("left-button").addEventListener("touchstart", function(e) { touch(); keyLeft = true; });
document.getElementById("left-button").addEventListener("touchend", function(e) { keyLeft = false; });
document.getElementById("left-button").addEventListener("touchcancel", function(e) { keyLeft = false; });

document.getElementById("right-button").addEventListener("touchstart", function(e) { touch(); keyRight = true; });
document.getElementById("right-button").addEventListener("touchend", function(e) { keyRight = false; });
document.getElementById("right-button").addEventListener("touchcancel", function(e) { keyRight = false; });

document.getElementById("mid-button").addEventListener("touchstart", function(e) { touch(); keySpace = true; keySpaceSingle = true; });
document.getElementById("mid-button").addEventListener("touchend", function(e) { keySpace = false; keySpaceSingle = false; });
document.getElementById("mid-button").addEventListener("touchcancel", function(e) { keySpace = false; keySpaceSingle = false; });

// Añadimos un primer evento 'keydown' para detectar la primera pulsación de tecla SPACE.
window.addEventListener('keydown', initGame);
function initGame(event) {
    firstTouch = false;
    if (event.key == ' ') {
        startGame();
    }
}

// Añadimos el evento 'keydown' principal para detectar las pulsaciones de teclas del juego.
window.addEventListener("keydown", function (event) {

    if (event.defaultPrevented) {
        return;
    }
    
    switch (event.key) {
        case "a" : case "A" : case "ArrowLeft": {
            if (gameStarted) keyLeft = true;
        } break;
        case "d" : case "D" : case "ArrowRight": {
            if (gameStarted) keyRight = true;
        } break;
        case " ": { // Space
            if (keySpace) return;
            keySpace = true;
            keySpaceSingle = true;
        } break;
        case "f" : case "F" : {
            if (this.document.fullscreenElement == null) document.documentElement.requestFullscreen();
            else this.document.exitFullscreen();
        } break;
        case "p": case "P" : {
            if (menuStarted && debug) pause = !pause;
        } break;
        case "n" : case "N" : {
            if (menuStarted && debug) skip = true;
        } break;
        case "m" : case "M" : {
            if (soundMuted) {
                soundMuted = false;
                unMuteSounds();
                if (menuStarted && !gameOver) MUSIC.play();
            } else {
                soundMuted = true;
                muteSounds();
                MUSIC.pause();
                MUSIC.currentTime = 0;
            }
        } break;
        default: return;
    }
    
    event.preventDefault();
}, true);

// Añadimos el evento 'keyuo' principal para detectar cuándo dejan de pulsarse las teclas del juego.
window.addEventListener("keyup", function (event) {

    if (event.defaultPrevented) {
        return;
    }

    switch (event.key) {
        case "a" : case "A" : case "ArrowLeft": {
            if (gameStarted) keyLeft= false;
        } break;
        case "d" : case "D" : case "ArrowRight": {
            if (gameStarted) keyRight = false;
        } break;
        case " ": { // Spacebar
            keySpace = false;
            keySpaceSingle = false;
        } break;
        case "f" : case "F" : {
            //
        } break;
        case "p" : case "P" : {
            //
        } break;
        case "n" : case "N" : {
            if (menuStarted && debug) skip = false;
        } break;
        case "m" : case "M" : {
            if (menuStarted) skip = false;
        } break;
        default: return;
    }

    event.preventDefault();

}, true);

// Cuando la ventana se redimensione, recalculamos la posición del canvas.
// Esto sirve para que, si en nuestro juego se hace uso del ratón, la redimensión de la ventana no afecte a su funcionamiento.
window.addEventListener('resize', function() {
    canvasPosition = canvas.getBoundingClientRect();
});
