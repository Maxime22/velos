/* IL Y A 2 FACONS DE CREER DES OBJETS EN JS, SOIT AVEC DES VAR (syntaxe littéral)
var stylo = {
    type: "bille",
    couleur: "bleu",
    marque: "Bic"
};
// SOIT AVEC DES FUNCTONS (constructeurs)
Un constructeur est une fonction particulière dont le rôle est d'initialiser un nouvel objet. Son nom commence souvent par une lettre majuscule, 
mais ce n'est pas une obligation.‌
La création de l'objet à partir du constructeur est appelée l'instanciation. Elle s'effectue à l'aide du mot-clé new.
// Constructeur MonObjet
function MonObjet() {
    // initialisation de l'objet
}
// Instanciation d'un objet à partir du constructeur
var monObj = new MonObjet();*/

// AVEC LA PREMIERE FACON ON UTILISE Object.create(NomDuPrototype) pour créer des objets à partir du même prototype
// AVEC LA DEUXIEME FACON ON UTILISE new(NomDuConstructeur) pour créer des objets à partir du constructeur, 
// on devra notamment utiliser this dans les variables liées au constructeur
// DANS LES 2 CAS IL FAUT UTILISER LE PROTOTYPE POUR NE PAS AVOIR DES METHODES DUPLIQUEES POUR CHAQUE NEW... ?

var Personnage = {
    initPerso: function (nom, sante, force, piece, xp) {
        this.nom = nom;
        this.sante = sante;
        this.force = force;
    },

    // Attaque un personnage cible    
    attaquer: function (cible) {
        if (this.sante > 0) {
            var degats = this.force;
            console.log(this.nom + " attaque " + cible.nom + " et lui fait " + degats + " points de dégâts");
            cible.sante = cible.sante - degats;
            if (cible.sante > 0) {
                console.log(cible.nom + " a encore " + cible.sante + " points de vie");
            } else {
                cible.sante = 0;
                console.log(cible.nom + " est mort !");
            }
        } else {
            console.log(this.nom + " ne peut pas attaquer : il est mort...");
        }
    }
};

var Joueur = Object.create(Personnage);
// Initialise le joueur
Joueur.initJoueur = function (nom, sante, force) {
    this.initPerso(nom, sante, force);
    this.xp = 0;
    this.piece = 10;
    this.key = 1;
    // L'expérience du joueur est toujours initialisée à 0
};
// Renvoie la description du joueur
Joueur.decrire = function () {
    var description = this.nom + " a " + this.sante + " points de vie, " +
        this.force + " en force et " + this.xp + " points d'expérience, " + this.piece + " pièces d'or et " + this.key +" clé(s)";
    return description;
};
// Combat un adversaire
Joueur.combattre = function (adversaire) {
    this.attaquer(adversaire); 
    if (adversaire.sante === 0) {
        console.log(this.nom + " a tué " + adversaire.nom + " et gagne " +
            adversaire.valeur + " points d'expérience ainsi que " + adversaire.piece + " pièces d'or et " + adversaire.key + " clé(s)");
        this.xp += adversaire.valeur;
        this.piece += adversaire.piece;
        this.key += adversaire.key;
    }
};

var Adversaire = Object.create(Personnage);
// Initialise l'adversaire
Adversaire.initAdversaire = function (nom, sante, force, race, valeur, piece, key) {
    this.initPerso(nom, sante, force);
    this.race = race;
    this.valeur = valeur;
    this.piece = piece;
    this.key = key;
};

var joueur1 = Object.create(Joueur);
joueur1.initJoueur("Aurora", 150, 25);

var joueur2 = Object.create(Joueur);
joueur2.initJoueur("Glacius", 130, 30);
console.log("Bienvenue dans ce jeu d'aventure ! Voici nos courageux héros :");
console.log(joueur1.decrire());
console.log(joueur2.decrire());

var monstre = Object.create(Adversaire);
monstre.initAdversaire("ZogZog", 40, 20, "orc", 10, 10, 1);
console.log("Un affreux monstre arrive : c'est un " + monstre.race + " nommé " + monstre.nom);

monstre.attaquer(joueur1);
monstre.attaquer(joueur2);
joueur1.combattre(monstre);
joueur2.combattre(monstre);
console.log(joueur1.decrire());
console.log(joueur2.decrire());