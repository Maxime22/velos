/* Façon 1 OBJET */

var stylo = {
    type: "bille", // Propriété
    couleur: "bleu",
    marque: "Bic"
};

/* Façon 2 OBJET */
// Constructeur MonObjet
function MonObjet() {
    // Initialisation de l'objet
    // ...
}
// Instanciation d'un objet à partir du constructeur
var monObj = new MonObjet();

console.log(stylo.couleur); // Affiche "bleu"
stylo.couleur = "rouge"; // Modifie la couleur de l'encre du stylo
console.log("Mon stylo à " + stylo.type + " " + stylo.marque + " écrit en " + stylo.couleur);
stylo.prix = 2.5; // Ajout dynamique de la propriété prix à l'objet stylo
console.log("Il coûte " + stylo.prix + " euros");

/* MINI JEU DE RÔLE */
var perso1 = {
    nom: "Spartacus",
    sante: 150,
    force: 25,

    // Renvoie la description du personnage
    decrire: function () {
        var description = this.nom + " a " + this.sante + " points de vie et " + this.force + " en force";
        return description;
    }
};

console.log(perso1.decrire());
perso1.sante = perso1.sante - 20;
perso1.force = perso1.force + 10;
console.log(perso1.decrire());

var ennemy = {
    nom: "Glaber",
    sante: 150,
    force: 25,

    attack: function (perso) {
        perso.sante = perso.sante - 20;
    }
}

console.log(ennemy.nom + " apparait");
console.log(ennemy.nom + " attaque " + perso1.nom);
ennemy.attack(perso1);
console.log(perso1.decrire());
// var perso2 = new perso1(); FAUX CAR perso1 n'est pas un constructeur ni une classe mais un objet simple ! ON A PAS ENCORE LES CLASSES ICI

/* Creer un tableau */
var films = ["Le loup de Wall Street", "Vice-Versa", "Babysitting"];
console.log(films.length);
films.push("Les Bronzés");
console.log(films[3]); // Affiche "Les Bronzés"

var Film = {    // Initialise le film    
    init: function (titre, annee) {
        this.titre = titre;
        this.annee = annee;
    },
    // Renvoie la description du film    
    decrire: function () {
        var description = this.titre + " (" + this.annee + ")";
        return description;
    }
};

var film1 = Object.create(Film);
film1.init("Le loup de Wall Street", 2013);
var film2 = Object.create(Film);
film2.init("Vice-Versa", 2015);
var film3 = Object.create(Film);
film3.init("Babysitting", 2013);

var mousquetaires = ["Athos", "Portos", "Aramis"];

for (i = 0; i < mousquetaires.length; i++) {
    console.log(mousquetaires[i]);
}

mousquetaires.push("d'Artagnan");

mousquetaires.forEach(function (mousquetaire) {
    console.log(mousquetaire);
});

var valeurs = [11, 3, 7, 2, 9, 10];
var sum = 0;
var min = 0;
for (i = 0; i < valeurs.length; i++) {
    sum = sum + valeurs[i];
    if (i === 0) {
        min = valeurs[i];
    } else {
        if (valeurs[i] < min) {
            min = valeurs[i];
        }
    }
}

console.log(sum, min);

/* PROTOTYPES */ // Les classes ne semblent pas exister en JS, on utilise des prototypes qui sont vides à la base
// ce sont ces prototypes qui sont appelés quand on a pas instancié d'autres variables ou fonctions
// Toute fonction déclaré possède nativement une propriété « prototype » initialement vide : 
var Dog = function() {}; // declaring constructor
Dog.prototype; // prints "{}" : prototype exists and is empty
// Alors, qu’est-ce qu’un prototype ? Et bien dit simplement, c’est une liste de propriétés, attaché à un constructeur, 
// qui va servir de « fallback » lorsque l’on cherche à accéder à une propriété manquante d’une instance dudit constructeur. 
// Une propriété rajouté sur le prototype du constructeur devient disponible sur les instances :
Dog.prototype.bark = function () { // defining a method on the Dog prototype
    console.log("wouf wouf");
};
var bobby = new Dog();
bobby.bark(); // using the prototype declaration - prints "wouf wouf" to the console
var felix = new Dog();
(bobby.bark == felix.bark); // instances share same reference - returns true;
bobby.bark = Dog.prototype.bark // which is the prototype property - returns true;

/* Pour créer des modèles d'objet en JavaScript, on utilise les prototypes. 
En plus de ses propriétés particulières, tout objet JavaScript possède une propriété interne appelée prototype. 
Il s'agit d'un lien (on parle de référence) vers un autre objet. 
Lorsqu'on essaie d'accéder à une propriété qui n'existe pas dans un objet, 
JavaScript essaie de trouver cette propriété dans le prototype de cet objet.*/
var unObjet = {
        a: 2
    };
// Crée unAutreObjet avec unObjet comme prototype
var unAutreObjet = Object.create(unObjet);
console.log(unAutreObjet.a); // Affiche 2
// Crée encoreUnObjet avec unAutreObjet comme prototype
var encoreUnObjet = Object.create(unAutreObjet);
console.log(encoreUnObjet.a); // Affiche 2
console.log(encoreUnObjet.b); // Affiche undefined