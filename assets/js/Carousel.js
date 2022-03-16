/**
 * @class
 * Represente notre carousel ainsi que ces differentes configuration et d'option
 */
 export default class Carousel {
  
  /**
   * Permet de lancer un evenement quand on deplace notre carousel
   * 
   * @callback moveCallback 
   * @param {number} index Le callback a enregistrer dans this.moveCallbacks 
   * @returns {any}
   */

  /**
   * @constructor
   * @param {HTMLElement} element L'element HTML dont on veut transformer en Carousel
   * @param {Object} options Les parametres du carousel
   * @param {Number} [options.slidesToScroll = 1] Le nombre d'elements à faire défiler
   * @param {Number} [options.slidesVisible = 1] Le nombre d'element visible dans un slide
   * @param {Boolean} [options.loop = false] Permet de masquer ou afficher une navigation si on a un index qui n'a plus de contenus ou si on est à l'index Zero ou au dernier index, il permet de dire si "On doit boucler en fin de carousel" et afficher le bouton next ou prev
   * @param {Number} [options.navigation = false] Pour avoir les boutons de navigation prev et next
   * @param {Boolean} [options.pagination = false ] Permet d'avoir ou non un systeme de pagination nous permettant d'aller sur une page du carousel en particulier et permettra de savoir sur quel element on est
   * @param {Number} [options.infinite = false] Pour avoir une navigation des slides Infinity
   * 
   * @memberof Carousel
   */
  constructor (element, options = {}) {
    
    // ---------- DEFINITION DES VARIABLES -------------------
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      navigation: true,
      infinite: false,
      pagination: false
    }, options);
    
    /**
     * Permet de specifier si oui ou non notre carousel s'effectue sur mobile
     */
    this.isMobile = false;


    /**
     * Permet de selectionner l'element visible, à l'initialisation c'est l'element zero (0) qui est visible
     */
    this.currentItem = 0;

    // Le conteneurs des callBacks
    this.moveCallbacks = [];


    // On conserve uniquement les enfant de `element` dans un tableau lors de l'execution courant sans tenir compte de l'effet asynchrone et du coup dans notre cas on aura 5 element dans notre `element` au lieu de 6 elements
    /**
     * @member {Array<HTMLElement>} children Les enfants de `element` on moment de creation de l'Object carousel
     */
    let children = [].slice.call(element.children) // Pour avoir que des enfant qui sont des element HTML et non des textes

    // ----------- MODIFICATION DU DOM -----------

    // On creer notre element racine de notre carousel
    this.root = this.createElementWithClass('carousel');


    // On creer aussi le `containeur` de notre carousel
    this.container = this.createElementWithClass('carousel__container');

    // ----- L'ACCESSIBILITER POUR NAVIGUER AVEC LES TOUCHES DU CLAVIER -------------
    // L'attribut 'tabindex' permet de rendre un element focusable et ensuite on doit lui donner un chiffre, `1` si c'est le premier element et si vous lui donner `0` il prendra automatiquement comme ordre l'ORDRE HTML
    this.root.setAttribute('tabindex', '0');



    // On ajoute le conteneur à notre element Racine
    this.root.appendChild(this.container);


    // On ajoute notre carousel à l'element de configuration càd à l'element que l'on veut transformer en carousel
    this.element.appendChild(this.root);


    // On ajoute tous les enfants de `element` dans le containeur de notre carousel et on les retourne après quelques modification
    this.items = children.map((item) => {
      // Etant donnée que les enfant peuvent changer de classe suivant le projet on va donc creer un element `carousel__item` dans lequel on va mettre les differents items
      const carouselItem = this.createElementWithClass('carousel__item');

      carouselItem.appendChild(item);
      this.container.appendChild(carouselItem)
      return carouselItem
    });

    // ---------- FONCTIONS D'INITIALISTATION ---------
    // Apres avoir instancier le carousel on definis les styles adequates à l'ecran qu'on a
    this.setStyle();
    if (this.options.navigation === true) {
      // On initialise aussi la navigation
      this.createNavigation();
    }
    if (this.options.pagination === true) {

      // On initialise la pagination
      this.createPagination();
    }

    // ----------------- EVENEMENTS ---------
    this.moveCallbacks.forEach(cb => cb(this.currentItem))
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.root.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.prev();

      }
    });
  }
    
  /**
   * Créer un element HTML et lui affecte une classe
   * 
   * @param {String} className La classe de l'element
   * @param {String} element L'element HTML que l'on veut créer
   * @returns {HTMLElement}
   * 
   * @memberof Carousel
   */
  createElementWithClass(className, element = 'div') {
    const myElement = document.createElement(element);
    myElement.setAttribute('class', className);
    return myElement;
  }

  /**
   *Permet de remettre les styles par defaut une fois l'initialisation du carousel fait, pour des raisons de performance on a choisis les pourcentages pour eviter l'ecouter l'evenement `onresize`
   On va calculer la largeur des items du carousel selon le nombre qu'on veut afficher, dans notre cas c'est 3 car `options.slidesVisible=3`
   *
   * @memberof Carousel
   */
   setStyle() {
    // On definis une ratio qui va etre un peu la largeur en pourcentages des elements dans le carousel qui est le nombre d'item diviser par les nombre d'element que l'on veut afficher
    let ratio = this.items.length / this.slidesVisible;
    // On definis la largeur du `carousel__container`
    // On ajoute une largeur calculer avec "ratio"
    this.container.style.width = (ratio * 100) + "%";
    // On parcour tous les elements dans notre `.carousel_container` pour leurs appliquer une largeur calculer
    this.items.forEach(carouselItem => carouselItem.style.width = ((100 / this.slidesVisible) / ratio) + '%');

  }

  /**
   * Crée les flêches de navigation dans le DOM
   */
  createNavigation () {
    const nextButton = this.createElementWithClass('carousel__next', 'button');
    const prevButton = this.createElementWithClass('carousel__prev', 'button');
    
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);
    
    // On utilise bind(this) pour lui dire `au click tu applique cette methode mais dans cette methode this faire reference à la classe et non à l'objet sur lequel il s'execute`
    nextButton.addEventListener('click', this.next.bind(this));
    prevButton.addEventListener('click', this.prev.bind(this));
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add('carousel__prev--hidden')
      } else {
        prevButton.classList.remove('carousel__prev--hidden')
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add('carousel__next--hidden')
      } else {
        nextButton.classList.remove('carousel__next--hidden')
      }
    })
  }

  /**
   * Permet de creer les puces de pagination de notre carousel dans le DOM
   */
  createPagination () {
    
    // Le tableau nous permettra lors de l'ecoute du deplacement vers la page correspondante mettre la classe active sur le boutton qui est actuellement actif 
    let buttons = [];

    // Le containeur des bouttons des paginations
    let pagination = this.createElementWithClass('carousel__pagination');
    
    // On ajoute le conteneur des puces à l'element `.carousel`
    this.root.appendChild(pagination);
    
    for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
      // On creer à chaque tour de boucle une puce
      let button = this.createElementWithClass('carousel__pagination__btn','button');

      // Au click sur la puce nous menera au slide voulus ou à la page voulus
      button.addEventListener('click', () => this.goToItem(i));

      // On ajoute cette puce au containeur des puces
      pagination.appendChild(button);

      // On ajoute les le button au tableau des bouttons
      buttons.push(button);
    }
    this.onMove(index => {
      let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
      if (activeButton) {
        buttons.forEach(btn => btn.classList.remove('carousel__pagination__btn--active'));
          activeButton.classList.add('carousel__pagination__btn--active');
      }
    })
  }

  /**
   * Permet d'aller au Slider suivant
   *
   * @memberof Carousel
   */
   next() {
    this.goToItem(this.currentItem + this.slidesToScroll);
  }

  /**
   *Permet d'aller au slider precedent
   *
   * @memberof Carousel
   */
  prev() {
    this.goToItem(this.currentItem - this.slidesToScroll);

  }

  /**
   * Permet d'aller à un index particulier du `carousel` et donc Déplace le carousel vers l'element cibler
   *
   * @param {Number} index L'index sur lequel on veut se rendre
   * @param {Boolean} [animation = true ] Si oui ou non on veut une animation lors du deplacement
   * @memberof Carousel
   */
   goToItem (index) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    let translateX = index * -100 / this.items.length
    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
    this.currentItem = index
    this.moveCallbacks.forEach(cb => cb(index))
  }

  /**
   * Rajoute un écouteur qui écoute le déplacement du carousel ET DONC
   * Permet d'emmettre un evenement quand on deplace notre carousel et aura pour role d'enregistrer des callBack dans un tableau et cacher l'un des bouton de deplacement
   * 
   * @param {moveCallback} cb
   * 
   * @memberof Carousel
   */
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  /**
   * Ecouteur pour le redimensionnement de la fenetre
   * Permet de changer la dimension de nos carousel selon la largeur de la fenetre
   * 
   * @returns {any}
   */
   onWindowResize() {
    // Si la largeur de la fenetre est inferieur à 800px on change les largeurs de nos element et de nos dimension de carousel lors du defilement
    let mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      // On redefinis les styles
      this.setStyle();
      this.moveCallbacks.forEach(cb => cb(this.currentItem));
    }
  }


  /**
   * Retourne le nombre le nombre d'element à slider selon qu'on est sur un ecran de type mobile ou desktop
   * 
   * @returns {number}
   */
   get slidesToScroll() {
    return this.isMobile ? 1 : this.options.slidesToScroll;
  }

  /**
   * Retourne le nombre le nombre d'element visible dans le carousel selon qu'on est sur un ecran de type mobile ou desktop
   * 
   * @returns {number}
   */
  get slidesVisible() {
    return this.isMobile ? 1 : this.options.slidesVisible;
  }

}
