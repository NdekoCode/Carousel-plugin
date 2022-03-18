import Carousel from "./Carousel.js";
const onReady = function () {
document.addEventListener('DOMContentLoaded', function () {

  
/**
 * Voici comment va se derouler notre code:
 * ? 1. On va faire un `new Carousel()` et à l'interieur on aura deux parametres:
 *  - Le premier parametre c'est l'element que je souhaite transformer en carousel(avec un `querySelector` ou un `getElement`)
 * - en deuxieme parametre on aura un objet d'options qui contient le "slidesToScroll" qui permettra d'indiquer le nombre d'element à scroller et "slidesVisible" qui permettra d'indiquer le nombre d'element visible
 * 
 * Pour lancer notre code JS on va attendre le chargement complete du DOM
 */

  new Carousel(document.querySelector('#carousel1'), {
    slidesVisible: 3,
    slidesToScroll: 3,
    loop: false,
    pagination: true ,
    infinite: true
  });
  new Carousel(document.querySelector('#carousel3'), {
    slidesVisible: 2,
    slidesToScroll: 2,
    loop: true,
    pagination: true
  });
  new Carousel(document.querySelector('#carousel2'), {
    pagination: true,
    loop : true,
    pagination: true,
    infinite: true
  });

});

}

onReady();





