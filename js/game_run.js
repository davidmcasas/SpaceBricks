/**
 * Marca de tiempo del fotograma anterior.
 * Usado por la función animate() para determinar si ha transcurrido tiempo suficiente para pintar un nuevo fotograma.
 */
let lastFrameTimestamp = 0;
/**
 * Función de animación. Tras ser llamada por primera vez, se ejecuta sucesivamente a cada fotograma.
 * La velocidad de llamada viene determinada por la velocidad de refresco del monitor (lo ideal es 60Hz).
 * Dentro de la función se aplica una comprobación de tiempo para limitar la velocidad de fotogramas si la
 * frecuencia del dispositivo es superior a la deseada.
 * 
 * @param {*} timestamp Marca de tiempo transcurrido desde la ejecución del código. Enviado por requestAnimationFrame().
 */
function animate(timestamp) {

    // El próximo fotograma volvemos a llamar a esta función
    window.requestAnimationFrame(animate);  

    // Tiempo transcurrido desde el último fotograma hasta ahora.
    let elapsed = timestamp - lastFrameTimestamp;

    // Sumamos décimas de milisegundo para contrarrestar posibles errores de redondeo y evitar que se pierdan
    // fotogramas, aunque esto implique una tasa de fotogramas imperceptiblemente mayor a la deseada.
    elapsed += 0.5;

    // Si el tiempo transcurrido es mayor al intervalo de tiempo necesario para cambiar de fotograma,
    // actualizamos la marca de tiempo anterior
    if (elapsed >= FPS_INTERVAL) lastFrameTimestamp = timestamp - (elapsed % FPS_INTERVAL);
    // Si no, cancelamos la ejecución de este fotograma.
    else return;
    
    // Si el juego no está pausado, o si está pausado y avanzamos un fotograma
    if (!pause || (pause && skip)) {
        
        // Desactivamos el avance de fotograma
        skip = false;

        // Sumamos un fotograma
        frame++;
        
        // Pintamos todo de negro para tapar los dibujados anteriores, con el grado de opacitdad indicado en FRAME_OPACITY
        ctx.fillStyle = 'rgba(0,0,0,' + FRAME_OPACITY + ')';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Calculamos el globalJitter en funcion de la música (función fija dado que sabemos que la música va a 120 BPM).
        globalJitter = (MUSIC.currentTime % 0.5) * 60;
        
        // Hacemos una copia de la lista de objetos del juego y, por cada uno, ejecutamos su método
        // update() y luego draw(), siempre comprobando que el objeto no esté destruído.
        // La razón de hacer una copia de la lista en lugar de iterar directamente sobre la original,
        // es que la original puede verse alterada durante la ejecución del ciclo si se destruyen objetos,
        // lo cual puede alterar el índice del forEach y hacer que algunos objetos no se actualicen.
        // Tampoco nos sirve un bucle con índice inverso ya que algunos objetos en su update() podrían destruir
        // otros objetos situados en cualquier lugar de la lista. Este es el camino seguro:
        GameObject.list.slice(0).forEach(gameObject => {
            if (!gameObject.destroyed) gameObject.update();
            if (!gameObject.destroyed) gameObject.draw();
        });
    }
    
}

// Inicializamos el fondo
background = new Background();

// Inicializamos el texto de inicio y le activamos el efecto auto fade
if (isMobileDevice()) {
    let initText = new Text(380, 360, "Double tap to start", 48);
    initText.effectAutoFadeEnabled = true;
} else {
    let initText = new Text(380, 360, "Press SPACE key...", 48);
    initText.effectAutoFadeEnabled = true;
}

// Mostramos un pequeño texto con la versión del juego en la esquina inferior izquierda
new Text(0, GAME_HEIGHT, GAME_VERSION, 16, 'gray');

// Finalmente, comenzamos el ciclo de animación.
window.requestAnimationFrame(animate);