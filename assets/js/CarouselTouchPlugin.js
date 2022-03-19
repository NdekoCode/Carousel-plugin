import Carousel from "./Carousel.js";

/**
 * Pour gerer ce tactile on va avoir besoin de 3 evenements:
 * - D'abord on va detecter quand l'utilisateur maintient la souris donc lorsque il appuis avec sa souris ou lorsqu'il commence à appuyer avec son doigt
 * - Ensuite on va detecter quand-ce qu'il bouge donc dès qu'il va bouger il va falloir bouger le carousel en fonction
 * - Enfin il va falloir detecter quand il lache la pression et c'est à ce comment là que on finira de slider
 * 
 * 
 * DONC globalement on aura 3 evenements à ecouter et ces evemenents on va pas tous les ecouter sur le carousel
 * - On va ecouter le debut de la pression sur le container du carousel
 * - par contre le deplacement de la souris on va l'ecouter de maniere generale sur le document par ce que l'utilisateur peut commencer à slider et quitter en faite notre element ducoup il faudra continuer à detecter ce mouvement là
 */
/**
 * Permet de mettre le système tactile à notre carousel càd une navigation tactile
 *
 * @class CarouselTouchPlugin
 */
export default class CarouselTouchPlugin {

  /**
   * Permet de mettre une instance CarouselTouchPlugin et prend en parametre une instance de notre Carousel
   * 
   * @param {Carousel} Carousel
   * @memberof CarouselTouchPlugin
   */
  constructor(carousel) {

    // On initialise le carousel
    this.carousel = carousel;
    // On annule le comportement initial du drag&Drop sur les images
    this.carousel.container.addEventListener('dragstart',e =>e.preventDefault());

    // On va commencer d'abord par la pression sur la souris, dans le cas de la souris c'est l'evenement Mousedown mais dans le cas du mobile mobile ça sera l'evement 'touchstart'
    // On va ajouter ces deux evement sur l'element principale
    this.carousel.container.addEventListener('mousedown', this.startDrag.bind(this));
    this.carousel.container.addEventListener('touchstart',this.startDrag.bind(this));

    // On va ecouter le deplacement de la souris de maniere generale
    window.addEventListener('mousemove', this.drag.bind(this));
    window.addEventListener('touchmove',this.drag.bind(this));

    // On ecoute quand l'utilisateur arrete de cliquer
    window.addEventListener('touchend', this.endDrag.bind(this));
    window.addEventListener('mouseup', this.endDrag.bind(this));
    // On ecoute aussi quand il y a une annulation du touch
    window.addEventListener('touchcancel',this.endDrag.bind(this));

  }
  /**
   * Permet de demarrer le deplacement du Carousel au touché
   *
   * @param {MouseEvent | TouchEvent} evt
   * @memberof CarouselTouchPlugin
   */
  startDrag (evt) {
    // Dans le cas où c'est un 'TouchEvent' on va devoir detecter combien de doigt l'utilisateur à utiliser car si il utilise deux doigt peut etre qu'il est entrer de faire un zoom sur la page
    if (evt.touches) {
      
      // Pas besoin d'aller plus loin car l'utilisateur est entrer de faire un geste multiTouch 
      if (evt.touches.length > 1) {
        return
      } else {
        // On recrase la variable e au premier point de pression
        evt = evt.touches[0]; // Ainsi à partir de cette variable `e` on pourra recuperer screenX et screenY
        // e.screenX: La position de la pression en X
        // e.screenY: La position de la pression en Y
      }
    }
    // On sauvegarde dans l'instance `l'origin` càd le point où on a commencer à draguer qui sera un object contenant les coordonnés en x et en y
    this.origin = {x: evt.screenX, y: evt.screenY};// Dans un 'MouseEvent' et `TouchEvent` ils ont les memes proprieter
    /**@var {number} La largeur du conteneur des items*/
    this.width = this.carousel.containerWidth;
    this.carousel.disableTransition();
    console.log("startDrag ",this.origin);

  }
  
  /**
   * Permet Le deplacement de la souris ou du tactile
   *
   * @param {MouseEvent | TouchEvent} evt
   * @memberof CarouselTouchPlugin
   */
  drag (evt) {
    console.log("Drag");
    // On verifie si on a déjà commencer à draguer
    if (this.origin) {
      let point = evt.touches ? evt.touches[0] : evt;
      /**Je calcul la translation, pour ca on va comparer le screenX et screenY de l'evement dans startDrag et celui dans drag*/
      let translate = {x: point.screenX - this.origin.x, y: point.screenY - this.origin.y};
      // On essaie de voir si l'utilisateur essaie de scroller en voulant defiler
      if(evt.touches && Math.abs(translate.x)> Math.abs(translate.y)) {
        evt.preventDefault();
        evt.stopPropagation();
        // Si on a plusieurs doigts on arrete tous
      } else if(e.touches) {
        return
      }
      this.lastTranslate = translate;
      // La derniere translation faite ie quand l'utilisateur a relacher son doigt ou la souris
      let translateBase = this.carousel.currentItem * -100 / this.carousel.items.length;
      // On va calculer les valeurs obtenus par screenX et screenY en pourcentage
      this.carousel.translate(translateBase + 100 * translate.x/this.width);
      this.carousel.moveCallbacks.forEach(cb => cb(this.carousel.currentItem));
    }

  }
  
  /**
   * Permet la fin le deplacement du Carousel au relachement du touché
   *
   * @param {MouseEvent | TouchEvent} evt
   * @memberof CarouselTouchPlugin
   */
   endDrag(evt) {
     console.log('endDrag')
    // Cette evenement va avoir un inconvenient c'est que il ne recevra pas dans le cas du `touch` le point en X et en Y lors du relachement
    // Donc il faut concerver la derniere translation qui a été appuyer pour savoir à quel niveau on est
    // On verifie si on a déjà eu quelque chose
    if(this.origin && this.lastTranslate) {
      this.carousel.enableTransition();
      // On doit ensuite savoir si on doit aller au carousel suivant ou au carousel precedent, dans ce cas pour le savoir:
      // On doit connaitre le pourcentage de scroll qui a été effectué par rapport à la taille de notre carousel
      if(Math.abs(this.lastTranslate.x/ this.carousel.carouselWidth) > 0.2) {
        //0.2 =20%  donc je vais pouvoir deplacer à droite ou à gauche
        if(this.lastTranslate.x < 0) {
          this.carousel.next();
        } else {
          this.carousel.prev();
        }

      } else {
        this.carousel.goToItem(this.carousel.currentItem);
      }
      
    this.carousel.moveCallbacks.forEach(cb => cb(this.carousel.currentItem))
    }
    this.origin =null;
  }
}
