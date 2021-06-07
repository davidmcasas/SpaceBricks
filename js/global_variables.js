/**
 * Versión del juego.
 */
 const GAME_VERSION = "v1.0";

 // Elemento Canvas, referencia al contexto 2D, y asignación de dimensiones.
 const canvas = document.getElementById('canvas');
 const ctx = canvas.getContext('2d');
 canvas.width = 1280;
 canvas.height = 720;
 
 
 // -------------------
 // CONSTANTES GLOBALES
 // -------------------
 
 /**
  * Ancho del juego en píxeles
  */
 const GAME_WIDTH = canvas.width;
 
 /**
  * Alto del juego en píxeles
  */
 const GAME_HEIGHT = canvas.height;
 
 /**
  * Número de fotogramas por segundo objetivo. Con esta variable, podemos evitar
  * que el juego vaya a más fotogramas de los indicados (en caso de que se ejecute en una
  * pantalla de más 60Hz, por ejemplo), pero no se evita que el juego pueda a ir a menos
  * fotogramas en caso de que el dispositivo que ejecuta el juego no sea lo suficientemente potente.
  */
const TARGET_FPS = 60;
 
 /**
  * Tiempo mínimo que debe transcurrir entre fotogramas, expresado en milisegundos.
  */
 const FPS_INTERVAL = 1000 / TARGET_FPS;
 
 /**
  * Opacidad de borrado de fotograma en una escala de 0 a 1. Útil para crear sensación de movimiento con efecto ghosting.
  */
 const FRAME_OPACITY = 0.4;
 
 /**
  * Ancho de un ladrillo en píxeles. Se corresponde con el ancho de las imágenes usadas para los ladrillos.
  */
 const BRICK_WIDTH = 64;
 
 /**
  * Alto de un ladrillo en píxeles. Se corresponde con el alto de las imágenes usadas para los ladrillos.
  */
 const BRICK_HEIGHT = 32;
 
 /**
  * Número de columnas de ladrillos con las que podemos ocupar la pantalla, en base al ancho del juego y el ancho de ladrillo.
  * Si se usa 1280 de ancho de juego y 64 de ancho de ladrillo, tendremos 20 columnas justas.
  */
 const BRICK_COLUMNS = Math.trunc(GAME_WIDTH / BRICK_WIDTH);
 
 /**
  * Número de columnas de margen en las que no queremos que caigan ladrillos.
  * Se aplica el mismo margen tanto al lado izquierdo como al derecho.
  */
 const BRICK_COLUMNS_MARGIN = 2;
 
 /**
  * Cuánto espacio (medido en ladrillos) de margen vertical habrá entre la aparición de cada patrón de ladrillos.
  */
 const BRICK_SPACE_BETWEEN_PATTERNS = 4;
 
 /**
  * Vida máxima que puede tener un ladrillo.
  * Basado en la longitud del array de imágenes de ladrillos que tenemos. (Cada imagen es un nivel de vida distinto).
  */
 const BRICK_MAX_HEALTH = IMAGES_BRICKS.length;
 
 /**
  * Daño que hacen las balas de los ladrillos.
  */
 const BRICK_BULLET_DAMAGE = 10;
 
 /**
  * Ancho de las balas de los ladrillos.
  */
 const BULLET_WIDTH = 8;
 
 /**
  * Alto de las balas de los ladrillos.
  */
 const BULLET_HEIGHT = 16;
 
 /**
  * Tamaño en píxeles del cuadrado de colisión de las bolas.
  */
 const BALL_SIZE = 24;
 
 /**
  * Posición vertical que ocupa el jugador en la pantalla.
  */
 const PLAYER_Y_POSITION = GAME_HEIGHT - 80;
 
 /**
  * Límite vertical que desencadena el Game Over si un ladrillo lo toca.
  */
 const BRICK_Y_LIMIT = PLAYER_Y_POSITION - BRICK_HEIGHT;
 
 /**
  * Nivel de dificultad máxima alcancable.
  */
 const MAX_DIFFICULTY = 10;
 
 /**
  * Indica cada cuántos fotogramas incrementa la dificultad.
  * Se puede calcular indicando los segundos deseados y multiplicando por TARGET_FPS
  */
 const DIFFICULTY_INCREASE_FRAMES = 45 * TARGET_FPS;
 
 /**
  * Incremento de puntuación por cada golpe en un ladrillo. (Este valor se multiplicará para ladrillos especiales).
  */
 const HIT_SCORE = 50;
 
 // Índices Z por defecto.
 // Los métodos update() y draw() de los objetos se ejecutarán en el orden Z.
 // Por tanto, los objetos con mayor índice Z quedarán visualmente por encima de los de menor índice.
 const Z_INDEX_TEXT              = 90;
 const Z_INDEX_SCORE_SCREEN      = 80;
 const Z_INDEX_PARTICLE          = 70;
 const Z_INDEX_PLAYER            = 60;
 const Z_INDEX_BRICK_BULLET      = 50;
 const Z_INDEX_BALL              = 40;
 const Z_INDEX_BRICK             = 30;
 const Z_INDEX_BACKGROUND_STAR   = 20;
 const Z_INDEX_BACKGROUND        = 10;
 
 // ------------------
 // Variables globales
 // ------------------
 
 /**
  * Número de fotograma actual.
  */
 let frame = 0;
 
 /**
  * Determina si el menú del juego ha comenzado.
  */
 let menuStarted = false;
 
 /**
  * Determina si la partida ha comenzado.
  */
 let gameStarted = false;
 
 /**
  * Determina si el juego ha finalizado.
  */
 let gameOver = false;
 
 /**
  * Referencia a la instancia de GameDirector
  */
 let gameDirector;
 
 /**
  * Referencia a la instancia de Background.
  */
 let background;
 
 /**
  * Número de fotograma de tembleque global. Se usa para hacer que los ladrillos "vibren" al ritmo de la música.
  */
 let globalJitter = 0;
 
 // La canción del juego tiene un ritmo de 120 BPM. Como el juego va a ir a 60 FPS, esto significa un beat cada 30 FPS.
 // Pero la función de JavaScript que determina en qué posición esta el audio no es instantánea, y tendremos que desfasar
 // la condición para que los ladrillos no vibren a destiempo. Por eso, en lugar de vibrar entre los fotogramas 0 y 6 a
 // partir de cada beat, vamos a vibrar entre los fotogramas 24 y 30. Son -6 fotogramas de desfase.
 
 /**
  * Valor mínimo de globalJitter para activar la vibración.
  */
 const GLOBAL_JITTER_MIN = 24;
 
 /**
  * Valor máximo de globalJitter para activar la vibración.
  */
 const GLOBAL_JITTER_MAX = 30;
 
 /**
  * Si es true, activa el modo depuración, que permite pausar el juego con la tecla P y hacer que avance fotograma
  * a fotograma con la tecla N
  */
 let debug = false;
 
 /**
  * Determina si el sonido está silenciado.
  */
 let soundMuted = false;

 /**
  * Determina si el juego está pausado.
  */
let pause = false;

/**
 * Determina si se debe avanzar un fotograma aunque el juego esté pausado.
 */
let skip = false;