/**
 * Clase GameObject
 * 
 * Esta es la clase padre de todas las clases del juego.
 * Al hacer que otra clase extienda de esta, se le dota de atributos y métodos comunes
 * a todos los objetos del juego. De esta forma es posible realizar actualizaciones y dibujados
 * de cualquier objeto, o comprobar colisiones entre objetos de cualquier subclase, por ejemplo.
 */
 class GameObject {

    /**
     * En esta lista estática se almacenan referencias a todos las instancias "vivas" de esta clase.
     * Cuando se ejecuta el método destroy() de un objeto, su referencia se elimina de esta lista.
     * En esta lista los objetos estarán ordenados ascendentemente por su atributo z_index, dado
     * que esta es la lista que se recorre para actualizar y dibujar los objetos.
     */
    static list = [];

    /**
     * Devuelve la posición de la lista en la que se debe insertar un objeto
     * en base su índice Z. El proceso se realiza mediante búsqueda binaria.
     * 
     * Nota: El orden de objetos con mismo índice Z es despreciado. Esta función
     * no asegura que, dado un índice z que exista repetidas veces en varios objetos de la lista,
     * la posición devuelta sea al principio, al final, o en un punto medio de dichos objetos.
     * 
     * @param {*} z Índice z
     * @returns La posición del array en la que debe insertarse un nuevo objeto.
     */
    static getInsertPosition(z) {

        let start = 0;
        let end = GameObject.list.length - 1;

        while (start <= end) {

            let mid = Math.trunc((start + end) / 2);
     
            if (GameObject.list[mid].z_index == z) return mid;
            else if (GameObject.list[mid].z_index < z) start = mid + 1;
            else end = mid - 1;
        }

        return end + 1;
    }

    /**
     * Constructor de la clase GameObject.
     * Todos los parámetros son opcionales y por defecto su valor es 0.
     * 
     * @param {*} x en el eje X
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} z_index 
     */
    constructor(x = 0, y = 0, width = 0, height = 0, z_index = 0) {

        // GameObject no debe instanciarse directamente, así que lanzamos un error informativo si esto ocurre.
        if (this.constructor === GameObject) {
            throw new Error("GameObject is abstract and can't be instantiated.");
        }

        /**
         * Posición del objeto en el eje X
         */
        this.x = x;

        /**
         * Posición del objeto en el eje Y
         */
        this.y = y;

        /**
         * Ancho del objeto
         */
        this.width = width;

        /**
         * Altura del objeto
         */
        this.height = height;

        /**
         * Índice Z del objeto. Sirve para determinar el orden de este objeto en la lista de objetos,
         * la cual se recorre para actualizar y dibujar los objetos. 
         */
        this.z_index = z_index;

        /**
         * Flag para determinar si el método destroy() de este objeto ya se ha llamado.
         */
        this.destroyed = false;

        // Añadimos el objeto a la lista de objetos en la posición que le corresponda en base a su z_index
        GameObject.list.splice(GameObject.getInsertPosition(this.z_index), 0, this);

    }

    /**
     * Elimina este objeto de la lista estática de objetos.
     * Se comprueba que el objeto no haya sido destruido previamente, dado que algunos objetos podrían
     * intentar llamar a este método más de una vez por update() y se podrían eliminar objetos equivocados
     * de la lista en caso de no realizar dicha comprobación.
     */
    destroy() {
        if (!this.destroyed) {
            GameObject.list.splice(GameObject.list.indexOf(this), 1);
            this.destroyed = true;
        }   
    }

    /**
     * Indica si el objeto está destruido (es decir, si su método destroy() ya se ha ejecutado).
     * 
     * @returns true si está destruído, false si no.
     */
    isDestroyed() {
        return this.destroyed;
    }

    /**
     * Determina si este objeto se solapa con otro.
     * Si solo se tocan, pero no se solapan, no se considera colisión.
     * 
     * Nota: si se quiere considerar como colision también cuando se toquen,
     * basta con cambiar los < y > por <= y >= respectivamente.
     * 
     * @param {GameObject} gameObject 
     * @returns true si colisionan, false si no.
     */
    collides(gameObject) {

        return (this.x < gameObject.x + gameObject.width &&
                this.x + this.width > gameObject.x &&
                this.y < gameObject.y + gameObject.height &&
                this.y + this.height > gameObject.y)
    }

    /**
     * Método que define el comportamiento del objeto en cada fotograma.
     * Debe ser implementado en cada clase que extienda de esta.
     */
    update() {}

    /**
     * Método que define cómo se dibuja este objeto en el canvas.
     * Este método no debe modificar atributos propios ni ajenos, solo leerlos.
     * Debe ser implementado en cada clase que extienda de esta.
     */
    draw() {}
    
}