
# Fonctionnement du Carousel

## À propos de Carousel

On écrira notre code en utilisant la syntaxe ES6 afin de faciliter l'organisation du code (si vous souhaitez supporter des navigateurs qui ne comprennent pas cette syntaxe libre à vous d'utiliser un outil pour convertir le code).

## L'objectif

Notre objectif est de créer une class `Carousel` qui s'adapte à un maximum situations. Nous allons pour cela mettre en place les fonctionnalités suivantes :

- On peut choisir le nombre d'éléments que l'on souhaite rendre visible
- On doit pouvoir paramétrer le nombre d'éléments à faire défiler
- une option `loop` permettra de faire boucler le carrousel (lorsque l'on arrive au bout du défilement, le carrousel peut revenir au tout début)
- l'affichage devra-t-être responsive et n'afficher qu'un seul slide lorsque l'on est sur une taille d'écran restreinte.
- Enfin, le système devra être accessible et permettre une navigation au clavier.

Nous ferons évoluer ce script dans de prochains jours avec, par exemple, la création d'un système de pagination ou encore la gestion d'un système de carrousel infini.
Dans ce fichier on va reflechir à ce que l'on va faire au niveau de notre `carousel` et comment il va fonctionner
Mon idée serai de prendre tous les elements de notre carousel, dans notre cas on en a cinq(5) et les entourer d'une grosse div `<div></div>` et cette grosse div `<div></div>` on va la faire bouger de droite à gauche ce qui va permettre de faire defiler les differents elements
Et donc on aura

```{HTML}
    <div class="carousel">
        <div class="carousel__container">
            Nos items à slider...<div class="carousel__item">...
        </div> 
    </div>

```

On veut que les elements de notre carousel soit les uns à cotés des autres et cela veut dire que notre element `.carousel__container` doit prendre une largeur qui est suffisante pour acceuillir nos differents elements, dans notre cas on a `Cinq(5) elements` et on veut afficher 3 elements par slide(`slidesVisibles:3`) et donc il faudra que ce `.carousel__container` qu'il prenne `166,66%` de largeur par rapport à son parent et pour calculer ça il nous faut prendre `le nombre d'element total dans notre element carousel` divisier par `le nombre d'elements que je souhaite rendre visible`

Mais aussi on veut que les elements se trouvant dans `.carousel__container` ne puisse pas passer à la ligne et donc il va falloir dire que chaque element càd `.carousel__item` doit prendre un tier (1/3) de ce qui est disponible dans notre cas car on veut afficher 3 element pas slide d'où le `1/3` et donc il faudra ponder le 33% par le ration que l'on a obtenus et donc il faut que l'on fasse `"1" *diviser* par "le nombre d'element visible" et que je *divise* ça par "le ratio" et que je multiplie ça par 100` et donc 
`{ [ ( 1 / slidesVisible ) * 100 ) ] / ration}` qui est equivalent à `[(100/slidesVisible)/ratio]` et cette valeur est à mettre en pourcentage et non en pixel donc il faut le concatener à la fin par un `+"%"`

Et pour faire le slider on va utiliser les transformation avec `transfom:translate3d(X,Y,Z)` on va nous utiliser la partie X
et donc:

- Il faut savoir savoir d'abord le nombres d'elements qui sont visible `this.items.length` qui contient le nombre des elements dans `.carousel__container`
et le calcul est que on va prendre `cent(100)` on le `"divise"` par `le nombre d'elements visible` et tous cela multiplier par l'index que je souhaite consulter par exemple si on a 5 element vis et qu'on veut aller au 2ème element il faut que je fasse un slide de 40% et le calcul est `(100/5)*2 = 40`

Pour le systeme de boucle sur le carousel notre idée est que `"On  va emmettre un evenement lorsque l'on change d'item"`

## Le systeme de scroll infinis

Pour mettre en place le systeme de scroll infinie car ce qu'il va falloir faire c'est dupliquer les elements à l'interieur de notre `container` et en mettre un petit peu avant et un petit peu après pour montrer que l'on a des elements de maniere constante
Pour connaitre le nombre d'element on doit en dupliquer on doit faire:
`Le nombre d'element visible` dans notre cas on a `3 elements visibles` et ensuite il faudra en rajouter `2` dans notre cas parce que il peut arriver qu'on se retrouve avec un petit element qui va se retrouver tout seul.
Pour ajouter ces elements on va le faire sur l'element `this.items` au lien de `this.children` car `this.items` represente les elements qui sont dans le `carousel__item` et on va faire cela uniquement si l'option `infinite` est activer

Apparence
1 2 3 4 5 6 7 : Au depart
3 4 5 6 7 | 1 2 3 4 5 6 7 | 1 2 3 4 5: Au scroll infinis
