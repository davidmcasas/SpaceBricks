// Cargamos los sonidos que se van a usar y definimos las funciones asociadas.

/**
 * Volumen general de todos los sonidos del juego (música incluida). En una escala de 0 a 1.
 */
let masterVolume = 0.8;

/**
 * Música del juego.
 */
const MUSIC = new Audio('music/spacebricks_loop.ogg');

// Función que se llama cada vez que la música avanza ('timeupdate').
// Se usa para crear el loop automático de la canción, dado que si solo usamos la función 'ended',
// se creará un pequeño silencio entre el fin de una reprodución y el inicio de la siguiente, creando un loop imperfecto.
// De todas formas este loop tampoco es perfecto ya que el tiempo de llamada a 'timeupdate' puede variar, pero se asemeja más
// a un loop perfecto.
MUSIC.addEventListener('timeupdate', function(){
    var buffer = 0.3;
    if (this.currentTime > this.duration - buffer) {
        this.currentTime = 0;
        this.play();
    }
});

// Función que se llama si la canción termina.
MUSIC.addEventListener('ended', function(){
    this.currentTime = 0
    this.play();
});

// Sonidos
const SOUND_INTRO_RISER = new Audio('music/riser.ogg');
const SOUND_SWOOSH = new Audio('sound/swoosh.ogg');
const SOUND_BALL_HIT = new Audio('sound/ball_hit.ogg');
const SOUND_SUPER_BALL_HIT = new Audio('sound/super_ball_hit.ogg');
const SOUND_LASER_SHOOT = new Audio('sound/laser_shoot.ogg');
const SOUND_BALL_SPAWN = new Audio('sound/ball_spawn.ogg');
const SOUND_PLAYER_HURT = new Audio('sound/player_hurt.ogg');
const SOUND_PLAYER_EXPLOSION = new Audio('sound/player_explosion.ogg');

/**
 * Función que reproduce un sonido.
 * Lo primero que hace es ponerle el tiempo a 0, por si ya se estuviera reproduciendo.
 * 
 * @param {*} sound 
 */
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

/**
 * Silencia todos los sonidos del juego (música incluída) poniendo su volumen a 0
 */
function muteSounds() {
    MUSIC.volume = 0;
    SOUND_INTRO_RISER.volume = 0;
    SOUND_BALL_HIT.volume = 0;
    SOUND_SUPER_BALL_HIT.volume = 0;
    SOUND_LASER_SHOOT.volume = 0;
    SOUND_SWOOSH.volume = 0;
    SOUND_BALL_SPAWN.volume = 0;
    SOUND_PLAYER_HURT.volume = 0;
    SOUND_PLAYER_EXPLOSION.volume = 0;
}

/**
 * Desilencia todos los sonidos del juego (música incluída) igualando su volumen a la variable masterVolume
 */
function unMuteSounds() {
    MUSIC.volume = masterVolume;
    SOUND_INTRO_RISER.volume = masterVolume;
    SOUND_BALL_HIT.volume = masterVolume;
    SOUND_SUPER_BALL_HIT.volume = masterVolume;
    SOUND_LASER_SHOOT.volume = masterVolume;
    SOUND_SWOOSH.volume = masterVolume;
    SOUND_BALL_SPAWN.volume = masterVolume;
    SOUND_PLAYER_HURT.volume = masterVolume;
    SOUND_PLAYER_EXPLOSION.volume = masterVolume;
}

/**
 * Prepara los sonidos asignándoles el volumen por defecto.
 */
function readySounds() {
    unMuteSounds();
}