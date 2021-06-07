// Cargamos las imágenes que se van a usar.

/**
 * Array que contiene las imágenes precargadas de los ladrillos.
 */
 const IMAGES_BRICKS = [];
 function preloadImage(url, array) {
     let img = new Image();
     img.src = url;
     array.push(img);
 }
 preloadImage('img/brick_blue.png', IMAGES_BRICKS);
 preloadImage('img/brick_green.png', IMAGES_BRICKS);
 preloadImage('img/brick_yellow.png', IMAGES_BRICKS);
 preloadImage('img/brick_orange.png', IMAGES_BRICKS);
 preloadImage('img/brick_purple.png', IMAGES_BRICKS);
 
 /**
  * Colores de los ladrillos.
  * En el mismo orden en que se cargan sus correspondientes imágenes.
  */
 const BRICK_COLORS = [
     'rgb(97, 211, 227)',
     'rgb(113, 243, 65)',
     'rgb(235, 211, 32)', 
     'rgb(255, 121, 48)',
     'rgb(162, 113, 255)'
 ];